import SwiftUI
import FirebaseCore
import FirebaseFirestore
import FirebaseAuth

// MARK: - Models
struct Player: Identifiable {
    let id: String
    var name: String
    var team: Int
    var score: Int = 0
}

struct Team: Identifiable {
    let id: Int
    var name: String
    var players: [Player]
    var scores: [Int] // Scores per round
    var totalScore: Int {
        scores.reduce(0, +)
    }
}

struct GameSession: Identifiable {
    let id: String
    var teams: [Team]
    var currentRound: Int
    var roundTime: Int
    var namesPerPlayer: Int
    var isActive: Bool
}

// MARK: - View Models
class GameViewModel: ObservableObject {
    @Published var currentSession: GameSession?
    @Published var currentPlayer: Player?
    @Published var bagNames: [String] = []
    @Published var timeRemaining: Int = 0
    @Published var isRoundActive = false
    
    private var db = Firestore.firestore()
    private var listeningRefs: [ListenerRegistration] = []
    
    init() {
        signInAnonymouslyIfNeeded()
    }
    
    private func signInAnonymouslyIfNeeded() {
        guard Auth.auth().currentUser == nil else { return }
        Auth.auth().signInAnonymously { _, error in
            if let error {
                print("Anonymous auth failed: \(error)")
            }
        }
    }
    
    private func sanitizedName(_ value: String, maxLength: Int = 80) -> String {
        let trimmed = value
            .replacingOccurrences(of: "[<>&\"'`]", with: "", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return String(trimmed.prefix(maxLength))
    }
    
    private func playerDocumentId(sessionId: String, playerName: String) -> String {
        let encodedName = sanitizedName(playerName, maxLength: 60)
            .uppercased()
            .addingPercentEncoding(withAllowedCharacters: .alphanumerics) ?? UUID().uuidString
        return "\(sessionId)__\(encodedName)"
    }
    
    func createGame(roundTime: Int, namesPerPlayer: Int) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        let sessionId = UUID().uuidString
        currentSession = GameSession(
            id: sessionId,
            teams: [],
            currentRound: 1,
            roundTime: roundTime,
            namesPerPlayer: namesPerPlayer,
            isActive: true
        )
        
        db.collection("sessions").document(sessionId).setData([
            "name": sessionId,
            "ownerUid": uid,
            "active": true,
            "started": false,
            "timeRoundEnd": 0,
            "turnActive": false,
            "namesPerPlayer": namesPerPlayer,
            "numberOfPlayers": 0,
            "numberOfPlayersEntered": 0,
            "numberOfTeams": 0,
            "lastNameGuessed": "None guessed yet",
            "currentRound": 1,
            "currentScore": 0,
            "roundTimeDefault": roundTime,
            "roundTime": roundTime
        ]) { error in
            if let error {
                print("Error creating game: \(error)")
            }
        }
    }
    
    func joinGame(sessionId: String, playerName: String, teamId: Int) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        let safeSessionId = sanitizedName(sessionId, maxLength: 20).uppercased()
        let safePlayerName = sanitizedName(playerName, maxLength: 60)
        let playerId = playerDocumentId(sessionId: safeSessionId, playerName: safePlayerName)
        
        if currentSession == nil || currentSession?.id != safeSessionId {
            currentSession = GameSession(
                id: safeSessionId,
                teams: [],
                currentRound: 1,
                roundTime: 60,
                namesPerPlayer: 5,
                isActive: true
            )
        }
        
        currentPlayer = Player(id: playerId, name: safePlayerName, team: teamId)
        
        db.collection("players").document(playerId).setData([
            "displayName": safePlayerName,
            "memberUid": uid,
            "score": 0,
            "turns": 0,
            "avgScore": 0,
            "sessionName": safeSessionId,
            "hasEnteredNames": false,
            "team": teamId,
            "teamName": "Team \(teamId + 1)",
            "teamOrderNumber": 1,
            "orderNumber": 1
        ], merge: true)
        
        db.collection("session-members").document("\(safeSessionId)__\(uid)").setData([
            "sessionName": safeSessionId,
            "uid": uid,
            "role": "player",
            "playerDocId": playerId,
            "playerName": safePlayerName,
            "joinedAt": FieldValue.serverTimestamp()
        ], merge: true)
    }
    
    func submitNames(_ names: [String]) {
        guard let sessionId = currentSession?.id,
              let player = currentPlayer,
              let uid = Auth.auth().currentUser?.uid else { return }
        
        for name in names {
            let safeName = sanitizedName(name)
            guard !safeName.isEmpty else { continue }
            
            db.collection("names").addDocument(data: [
                "bagName": safeName,
                "submittedBy": player.name,
                "submittedByUid": uid,
                "sessionName": sessionId,
                "round": 1
            ])
        }
    }
    
    func startRound() {
        guard let session = currentSession else { return }
        isRoundActive = true
        timeRemaining = session.roundTime
        
        // Start timer
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { timer.invalidate(); return }
            
            if self.timeRemaining > 0 {
                self.timeRemaining -= 1
            } else {
                timer.invalidate()
                self.endRound()
            }
        }
    }
    
    func endRound() {
        isRoundActive = false
        // Update scores and round in Firebase
    }
    
    func nameGuessed() {
        guard currentSession != nil,
              let player = currentPlayer else { return }
        
        db.collection("players").document(player.id)
            .updateData([
                "score": FieldValue.increment(Int64(1))
            ])
    }
    
    func cleanup() {
        listeningRefs.forEach { $0.remove() }
        listeningRefs.removeAll()
    }
}

// MARK: - Views
struct HomeView: View {
    @StateObject private var viewModel = GameViewModel()
    @State private var showingCreateGame = false
    @State private var showingJoinGame = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image("logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 120, height: 120)
                
                Text("BAG GAME")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Button(action: { showingCreateGame = true }) {
                    Label("Create Game", systemImage: "plus.circle")
                        .font(.title2)
                }
                .buttonStyle(.borderedProminent)
                
                Button(action: { showingJoinGame = true }) {
                    Label("Join Game", systemImage: "person.2")
                        .font(.title2)
                }
                .buttonStyle(.bordered)
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showingCreateGame) {
                CreateGameView(viewModel: viewModel)
            }
            .sheet(isPresented: $showingJoinGame) {
                JoinGameView(viewModel: viewModel)
            }
        }
    }
}

struct CreateGameView: View {
    @ObservedObject var viewModel: GameViewModel
    @Environment(\.dismiss) var dismiss
    @State private var roundTime = 60
    @State private var namesPerPlayer = 5
    
    var body: some View {
        NavigationView {
            Form {
                Section("Game Settings") {
                    Stepper("Round Time: \(roundTime) seconds", value: $roundTime, in: 30...180, step: 30)
                    Stepper("Names Per Player: \(namesPerPlayer)", value: $namesPerPlayer, in: 3...10)
                }
            }
            .navigationTitle("Create Game")
            .navigationBarItems(
                leading: Button("Cancel") { dismiss() },
                trailing: Button("Create") {
                    viewModel.createGame(roundTime: roundTime, namesPerPlayer: namesPerPlayer)
                    dismiss()
                }
            )
        }
    }
}

struct JoinGameView: View {
    @ObservedObject var viewModel: GameViewModel
    @Environment(\.dismiss) var dismiss
    @State private var sessionId = ""
    @State private var playerName = ""
    @State private var selectedTeam = 0
    
    var body: some View {
        NavigationView {
            Form {
                Section("Game Details") {
                    TextField("Session ID", text: $sessionId)
                    TextField("Your Name", text: $playerName)
                    Picker("Team", selection: $selectedTeam) {
                        Text("Blue Team").tag(0)
                        Text("Red Team").tag(1)
                        Text("Green Team").tag(2)
                        Text("Yellow Team").tag(3)
                    }
                }
            }
            .navigationTitle("Join Game")
            .navigationBarItems(
                leading: Button("Cancel") { dismiss() },
                trailing: Button("Join") {
                    viewModel.joinGame(sessionId: sessionId, playerName: playerName, teamId: selectedTeam)
                    dismiss()
                }
                .disabled(sessionId.isEmpty || playerName.isEmpty)
            )
        }
    }
}

@main
struct BagGameApp: App {
    init() {
        FirebaseApp.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            HomeView()
        }
    }
}
