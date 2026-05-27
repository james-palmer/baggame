import SwiftUI

struct GameView: View {
    @ObservedObject var viewModel: GameViewModel
    @State private var currentName = ""
    @State private var showingEndRound = false
    
    var body: some View {
        VStack {
            // Timer and Score
            HStack {
                Label("\(viewModel.timeRemaining)s", systemImage: "clock")
                    .font(.title2)
                Spacer()
                Label("\(viewModel.currentPlayer?.score ?? 0)", systemImage: "star.fill")
                    .font(.title2)
            }
            .padding()
            
            Spacer()
            
            // Current Name Card
            if viewModel.isRoundActive {
                VStack(spacing: 20) {
                    Text(currentName)
                        .font(.system(size: 42, weight: .bold))
                        .multilineTextAlignment(.center)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color(.systemBackground))
                        .cornerRadius(12)
                        .shadow(radius: 5)
                    
                    // Game Buttons
                    HStack(spacing: 20) {
                        Button(action: passName) {
                            Label("Pass", systemImage: "arrow.right.circle")
                                .font(.title2)
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.bordered)
                        .tint(.red)
                        
                        Button(action: correctGuess) {
                            Label("Got It!", systemImage: "checkmark.circle")
                                .font(.title2)
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
                .padding()
            } else {
                VStack(spacing: 20) {
                    Text("Round \(viewModel.currentSession?.currentRound ?? 1)")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Button(action: { viewModel.startRound() }) {
                        Label("Start Round", systemImage: "play.fill")
                            .font(.title2)
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            
            Spacer()
        }
        .navigationTitle("Game")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Round Over", isPresented: $showingEndRound) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("You got \(viewModel.currentPlayer?.score ?? 0) names correct!")
        }
    }
    
    private func passName() {
        // Get next name from bag
        if let nextName = viewModel.bagNames.first {
            currentName = nextName
            viewModel.bagNames.removeFirst()
        }
    }
    
    private func correctGuess() {
        viewModel.nameGuessed()
        passName()
    }
}

struct EnterNamesView: View {
    @ObservedObject var viewModel: GameViewModel
    @State private var names: [String] = []
    @State private var currentName = ""
    
    var remainingNames: Int {
        (viewModel.currentSession?.namesPerPlayer ?? 5) - names.count
    }
    
    var body: some View {
        VStack {
            Text("Enter Names")
                .font(.largeTitle)
                .padding()
            
            Text("\(remainingNames) names remaining")
                .font(.headline)
            
            List {
                ForEach(names, id: \.self) { name in
                    Text(name)
                }
                .onDelete { indexSet in
                    names.remove(atOffsets: indexSet)
                }
                
                if remainingNames > 0 {
                    HStack {
                        TextField("Enter a name", text: $currentName)
                            .textFieldStyle(.roundedBorder)
                        
                        Button(action: addName) {
                            Image(systemName: "plus.circle.fill")
                        }
                        .disabled(currentName.isEmpty)
                    }
                }
            }
            
            Button("Submit Names") {
                viewModel.submitNames(names)
            }
            .buttonStyle(.borderedProminent)
            .disabled(remainingNames > 0)
            .padding()
        }
    }
    
    private func addName() {
        guard !currentName.isEmpty && remainingNames > 0 else { return }
        names.append(currentName)
        currentName = ""
    }
}

struct ScoresView: View {
    @ObservedObject var viewModel: GameViewModel
    
    var body: some View {
        List {
            ForEach(viewModel.currentSession?.teams ?? []) { team in
                Section(team.name) {
                    ForEach(team.players) { player in
                        HStack {
                            Text(player.name)
                            Spacer()
                            Text("\(player.score)")
                                .font(.headline)
                        }
                    }
                    
                    HStack {
                        Text("Total")
                            .fontWeight(.bold)
                        Spacer()
                        Text("\(team.totalScore)")
                            .font(.headline)
                            .fontWeight(.bold)
                    }
                }
            }
        }
        .navigationTitle("Scores")
    }
}
