var listeningFirebaseRefs = [];

//Nav buttons
var menuHome = document.getElementById('menu-goHome');
var menuStart = document.getElementById('menu-start');
var menuTeams = document.getElementById('menu-teams');
var menuScores = document.getElementById('menu-scores');
 //HIDE ROUND SCREEN  var menuRound = document.getElementById('menu-round');
var menuRefresh = document.getElementById('menu-refresh');
var menuExit = document.getElementById('menu-exit');

//screens
var homeScreen = document.getElementById('homeScreen');
var startScreen = document.getElementById('startScreen');
var scoresScreen = document.getElementById('scoresScreen');
 //HIDE ROUND SCREEN  var roundScreen = document.getElementById('roundScreen');
var teamsScreen = document.getElementById('teamsScreen');
var infoScreen = document.getElementById('infoScreen');

//home buttons
var homeStartButton = document.getElementById('homeStartButton');
var homeProgressButton = document.getElementById('homeGoInProgressIcon')
var homeMyTeamButton = document.getElementById('homeMyTeamIcon')

var homeStart = document.getElementById('homeStart');
var homeProgress = document.getElementById('homeGoInProgress')
var homeMyTeam = document.getElementById('homeMyTeam')

var playerNames =[]

//Elements
var selectSession = document.getElementById("selectSession");

// Lottie Animations
const fireworks = document.getElementById("fireworks")
const confetti = document.getElementById("confetti")

// Firestore
var db = firebase.firestore();  
var sessions = db.collection('sessions');
var names = db.collection('names');
var teams = db.collection('teams');
var increaseBy = firebase.firestore.FieldValue.increment(1);
var increaseBy2 = firebase.firestore.FieldValue.increment(2);

//Track firestore listeners
var listenMVP = false
var listenShowHome = false
var listenCheckEntered = false
var listenLiveRound = false

var wordCloudNames = [];

// Selected variables
var activeSessions = [];
var activeTeams = [];
var activeTeamNames = [];
var activePlayers = [];
var roundTime;
var playerPicked;
var playerPickedName;
var teamPicked;
var teamPickedName;
var sessionPicked;
var sessionPickedName;
var sessionID
var namesPerPlayer;
var playerNumber

var jokerGame
var jokerAvailable
var jokerActive = false

var gameStarted

var playerScores= []
var playerScore
var orderedPlayerNames = []
var playerName
var playerTurns
var avgScore

var activeTeamOne;
var activeTeamTwo;
var activeTeamThree;
var activeTeamFour;
var activeTeamOneName;
var activeTeamTwoName;
var activeTeamThreeName;
var activeTeamFourName;


var t1r1Score = 0;
var t1r2Score = 0;
var t1r3Score = 0;
var t2r1Score = 0;
var t2r2Score = 0;
var t2r3Score = 0;
var t3r1Score = 0;
var t3r2Score = 0;
var t3r3Score = 0;
var t4r1Score = 0;
var t4r2Score = 0;
var t4r3Score = 0;
var t1TotalScore = 0;
var t2TotalScore = 0;
var t3TotalScore = 0;
var t4TotalScore = 0;
var yAxisInterval = 1


var currentOrderNumber;
var currentPlayer;
var currentPlayerName;
var currentTeam;
var currentTeamName;
var currentScore;
var currentRound;

var nextRound = currentRound + 1;
var count = 0; 
var nameArrayCount = 0;
var bagNames = [];
var currentBagName = bagNames[nameArrayCount]
var countNamesLeft = bagNames.length;
var latestSession;
var namesGotThisRound = [];
var gameHasPassed = false;
var roundScore;
var timeLeftOver
var countPlayersLeftToEnter
var teamCount;
 var hasEnteredNames;
 var turnActive
 var timeRoundEnd

var roundProgress

var t1p1; var t1p2;var t1p3;var t1p4;var t1p5;var t1p6;var t1p7;var t1p8;var t1p9;

var t2p1;var t2p2;var t2p3;var t2p4;var t2p5;var t2p6;var t2p7;var t2p8;var t2p9;

var t3p1;var t3p2;var t3p3;var t3p4;var t3p5;var t3p6;var t3p7;var t3p8;var t3p9;

var t4p1;var t4p2;var t4p3;var t4p4;var t4p5;var t4p6;var t4p7;var t4p8;var t4p9;
  

////////////////////////////////////////////////////////////////////
/* Cleanups the UI and removes all Firebase listeners.*/

function cleanupUi() {
  // Stop all currently listening Firebase listeners.
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid || !user && currentUID === null) {
    return;
  }
  currentUID = user ? user.uid : null;

  /*
  
  cleanupUi();
  if (user) {
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
    startDatabaseQueries();
  } else {
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
*/
}

window.addEventListener('load', function() {
  
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  
  firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
  
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

// Bind menu buttons.
  menuHome.onclick = function() {showSection(homeScreen, menuHome); updateHomeScreenDetails();};
  menuStart.onclick = function() {getStartInfo(); hideAlert();};
  menuTeams.onclick = function() {showTeamScreen();};
  menuScores.onclick = function() {showScoresScreen();};
   //HIDE ROUND SCREEN  menuRound.onclick = function() {showRoundScreen();};
  menuRefresh.onclick = function() {updateHomeScreenDetails();};
  menuExit.onclick = function() {bmLogOut()};
  
// Bind home screen buttons.
  $('#homeStartButton').on('click', function(e){
    getStartInfo();
  });
  
  $('#homeProgressButton').on('click', function(e){
    getStartInfo();
  });
    
  document.getElementById('join-button').onclick = function()  {joinScreen();};   
  
  //********************************************
  //  Switch on/off the dynamic words in splash background
  // getWordCloudNames();
  //********************************************  
  
  }, false);

/**
 * Displays the given section element and changes styling of the given button.
 */
function showSection(sectionElement, buttonElement) {
  homeScreen.style.display = 'none';
  startScreen.style.display = 'none';
  teamsScreen.style.display = "none";
  scoresScreen.style.display = 'none';
  //HIDE ROUND SCREEN  roundScreen.style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById('scoreboard').style.display =  'none';  
  document.getElementById("roundEnd-splash").style.display = "none" ;
  document.getElementById("welcomeScreen").style.display = "none";
  
  menuHome.classList.remove('is-active');
  menuStart.classList.remove('is-active');
  menuTeams.classList.remove('is-active');
  menuScores.classList.remove('is-active');
   //HIDE ROUND SCREEN  menuRound.classList.remove('is-active');
    
  if (sectionElement) {sectionElement.style.display = 'block';}
  if (buttonElement) {buttonElement.classList.add('is-active');}
}
 
//*******************************************
// Welcome Screen Functions
//******************************************

function getWordCloudNames(){
 wordCloudNames = [];
 db.collection("names").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {wordCloudNames.push(doc.data().bagName); });
   shuffle(wordCloudNames)
   
    document.getElementById("wordCloudNames").innerHTML = wordCloudNames.join(' '); 
    });
};

function delSess(sess){

//Delete names entered into session
  var namesToDelete = db.collection('names').where('sessionName','==',sess);
namesToDelete.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    doc.ref.delete();
   });
  console.log(sess+" names deleted")
}).catch(function(error) {console.log("Error getting document:", error);}); ;  
  
//Delete players in session
var playersToDelete = db.collection('players').where('sessionName','==',sess);
playersToDelete.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    doc.ref.delete();
   });
  console.log(sess+" players deleted")
}).catch(function(error) {console.log("Error getting document:", error);}); ;  

//Delete teams
  var teamsToDelete = db.collection('teams').where('sessionName','==',sess);
teamsToDelete.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    doc.ref.delete();
   });
  console.log(sess+" teams deleted")
}).catch(function(error) {console.log("Error getting document:", error);}); ;  

//Delete session
db.collection("sessions").doc(sess).delete().then(function() {
    console.log("Session successfully deleted!");
}).catch(function(error) {
    console.error("Error deleting session: ", error);
});

}

function bmLogOut(){
  
  noSleep.disable();
  document.getElementById("waitScreen").style.display = "none";
  document.getElementById("createScreen").style.display = "none";
  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("createScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("signOutIcon").style.display = "none";  
  document.getElementById("createSuccess").style.display = "none";
  document.getElementById("roundEnd-splash").style.display = "none";
  document.getElementById("enterScreen").style.display = "none";
  document.getElementById('setupCreateGameSessionButton').disabled = false;
  document.getElementById('submitNamesButton').disabled = true;  
  document.getElementById('enterNameFour').style.display ="block";
    document.getElementById('enterNameFive').style.display ="block";
    document.getElementById('enterNameSix').style.display ="block";
    document.getElementById('enterNameSeven').style.display ="block";
    document.getElementById('enterNameEight').style.display ="block";
    document.getElementById('enterNameNine').style.display ="block";
    document.getElementById('enterNameTen').style.display ="block";
  disableNavBarButtons();
  
  document.getElementById('enterNameOne').value = "";
  document.getElementById('enterNameTwo').value = "";
  document.getElementById('enterNameThree').value = "";
  document.getElementById('enterNameFour').value = "";
  document.getElementById('enterNameFive').value = "";
  document.getElementById('enterNameSix').value = "";
  document.getElementById('enterNameSeven').value = "";
  document.getElementById('enterNameEight').value = "";
  document.getElementById('enterNameNine').value = "";
  document.getElementById('enterNameTen').value = "";

  homeScreen.style.display = 'none';
  startScreen.style.display = 'none';
  teamsScreen.style.display = "none";
  scoresScreen.style.display = 'none';
   //HIDE ROUND SCREEN  roundScreen.style.display = "none";
  
  fireworks.style.display="none"
  confetti.style.display="none"
  
//  document.getElementById("turnAlert").style.display = "none";   
  document.getElementById("scoreboard").style.display = "none" ;
  document.getElementById("welcomeScreen").style.display = "none"
  
  document.getElementById("teamThree").style.display = "none"; 
  document.getElementById("teamFour").style.display = "none"; 
  document.getElementById("gridThree" ).style.display = "none"; 
  document.getElementById("gridFour" ).style.display = "none"; 
  
  document.getElementById("endGameTrigger").style.display = "none"; 
  
  document.getElementById("page-splash").style.display = "block";
  document.getElementById("wordCloud").style.display = "block";
  
  location.reload()
  console.log("Logged Out and Page Reloaded")
  
}

function createScreen() {
  document.getElementById("createScreen").style.display = "block";
  document.getElementById("page-splash").style.display = "none";
  document.getElementById("wordCloud").style.display = "none";
  document.getElementById("header").style.display = "block";

  sessionID = randomString(4, '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ');
  console.log(sessionID)


window.navigator.vibrate(200);
};

function joinScreen(){

document.getElementById("page-splash").style.display = "none";
document.getElementById("wordCloud").style.display = "none";
document.getElementById("joinScreen").style.display = "block";
document.getElementById("header").style.display = "block";  

};

function adjustNameCount(){
   db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
    if (doc.exists) { namesPerPlayer = doc.data().namesPerPlayer;
                      document.getElementById("enterNameCount").innerHTML =  namesPerPlayer;
                     if (namesPerPlayer == 3) {
                        document.getElementById('enterNameFour').style.display ="none";
                        document.getElementById('enterNameFive').style.display ="none";
                        document.getElementById('enterNameSix').style.display ="none";
                        document.getElementById('enterNameSeven').style.display ="none";
                        document.getElementById('enterNameEight').style.display ="none";
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 4) {
                        document.getElementById('enterNameFive').style.display ="none";
                        document.getElementById('enterNameSix').style.display ="none";
                        document.getElementById('enterNameSeven').style.display ="none";
                        document.getElementById('enterNameEight').style.display ="none";
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 5) {
                        document.getElementById('enterNameSix').style.display ="none";
                        document.getElementById('enterNameSeven').style.display ="none";
                        document.getElementById('enterNameEight').style.display ="none";
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 6) {
                        document.getElementById('enterNameSeven').style.display ="none";
                        document.getElementById('enterNameEight').style.display ="none";
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 7) {
                        document.getElementById('enterNameEight').style.display ="none";
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 8) {
                        document.getElementById('enterNameNine').style.display ="none";
                        document.getElementById('enterNameTen').style.display ="none";
                        } else if (namesPerPlayer == 9) {
                        document.getElementById('enterNameTen').style.display ="none";
                        };

    } else {console.log("No such document!");
    }}).catch(function(error) {console.log("Error getting document:", error);}); 
  
  
}

//********************************************
// Create screen functions
//********************************************

  $('#addPlayer').on('click', function(e){
    var playerAdd = document.getElementById('addPlayerName').value
    playerNames.push(playerAdd.trim());
    document.getElementById("playersEntered").innerHTML = playerNames   
    document.getElementById("addPlayerName").value = ""  
  });

  document.getElementById('addPlayerName').addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById("addPlayer").click();
    }
  });

  $('#clearPlayersEntered').on('click', function(e){
    playerNames=[]
    document.getElementById("addPlayerName").value = ""  
    document.getElementById("playersEntered").innerHTML = playerNames   
  });

 document.getElementById("timePicked").onchange = function() {
    document.getElementById("timeRound").innerHTML = document.getElementById('timePicked').value
 };
 
  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  function createGameSession(){
    sessionPickedName = sessionID
    //create an identifier using millisecond time count function
    var d = new Date();
    var sessName = sessionID
    sessionPicked = sessName
    document.getElementById("createSessionID").innerHTML = sessionID
    document.getElementById("waitSessionID").innerHTML = sessionID
    var teamOneName = "BLUE TEAM";
    var teamTwoName = "ORANGE TEAM";
    var teamThreeName = "PURPLE TEAM";
    var teamFourName = "RED TEAM";

    var teamOne = sessName.concat(teamOneName);
    var teamTwo = sessName.concat(teamTwoName);
    var teamThree = sessName.concat(teamThreeName);
    var teamFour = sessName.concat(teamFourName);

    var timePicked = document.getElementById('timePicked').value
    var orderNumber = 1 
    var t1number = 1
    var t2number = 1
    var t3number = 1
    var t4number = 1
    var countNumberPlayers = playerNames.length;
    var currentPlayerNumber;
    namesPerPlayer = document.getElementById("createNameCount").value;
    var totalNameCount = namesPerPlayer*countNumberPlayers;
    jokerGame = document.getElementById("createJoker").checked;
    activePlayers = playerNames

    shuffle(playerNames);
    var teamsSelected = document.getElementById("createSelectTeamNumber").value  
    teamCount = parseInt(teamsSelected,10)
  
    // decide which player starts
    if (playerNames.length % teamCount == 0){
    currentPlayer = playerNames[0]
    currentTeam = teamOne
    currentTeamName = teamOneName
    currentPlayerNumber = 1
    } else if (playerNames.length % teamCount == 1){
    currentPlayer = playerNames[1]
    currentTeam = teamTwo
    currentTeamName = teamTwoName
    currentPlayerNumber = 2
    } else if (playerNames.length % teamCount == 2){
    currentPlayer = playerNames[2]
    currentTeam = teamThree
    currentTeamName = teamThreeName
    currentPlayerNumber = 3
    } else if (playerNames.length % teamCount == 3){
    currentPlayer = playerNames[3]
    currentTeam = teamFour
    currentTeamName = teamFourName
    currentPlayerNumber = 4
    }
    
    // Create Turns-active to listen to changes
  
    db.collection("turns-active").doc(sessName).set({timeRoundEnd: 0, turnActive: false, currentPlayer: currentPlayer, currentTeam: currentTeam, currentTeamName: currentTeamName, currentRound: 1}).then(function() {console.log("Session successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);}); 

  
    // Create team 1
    db.collection("teams").doc(teamOne).set({teamName: teamOneName, tpNumber: 1, sessionName: sessName, jokerAvailable: jokerGame, r1Score: 0, r2Score: 0, r3Score: 0 , totalScore: 0, lastRoundScore: 0, teamSize: 0, p01:"", p02:"",p03:"",p04:"",p05:"",p06:"",p07:"",p08:"",p09:""}).then(function() {console.log("Team one successfully created!");
    }).catch(function(error) {console.error("Error writing document: ", error);});
    // Create team 2
    db.collection("teams").doc(teamTwo).set({teamName: teamTwoName, tpNumber: 1, sessionName: sessName, jokerAvailable: jokerGame, r1Score: 0, r2Score: 0, r3Score: 0 ,  totalScore: 0, lastRoundScore: 0, teamSize: 0, p01:"", p02:"",p03:"",p04:"",p05:"",p06:"",p07:"",p08:"",p09:""}).then(function() {console.log("Team two successfully created!");
    }).catch(function(error) {console.error("Error writing document: ", error);});

   if (teamCount == 3) {
      
      db.collection("sessions").doc(sessName).set({name: sessionPickedName, active: true, started: false, timeRoundEnd: 0, turnActive: false, namesPerPlayer: namesPerPlayer, numberOfPlayers: countNumberPlayers, numberOfPlayersEntered: 0, numberOfTeams: 3, lastNameGuessed: "None guessed yet" , currentRound: 1, currentTeam: currentTeam, currentTeamName: currentTeamName, currentPlayer: currentPlayer, currentPlayerNumber : currentPlayerNumber, currentScore: 0, roundTimeDefault: timePicked, roundTime: timePicked, p01:"", p02:"", p03:"", p04:"", p05:"", p06:"", p07:"", p08:"", p09:"", p10:"", p11:"", p12:"", p13:"", p14:"", p15:"", p16:"", p17:"", p18:"", p19:"", p20:""}).then(function() {console.log("Session successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);}); 
      
      // create team 3
      db.collection("teams").doc(teamThree).set({teamName: teamThreeName, tpNumber: 1, sessionName: sessName, jokerAvailable: jokerGame, r1Score: 0, r2Score: 0, r3Score: 0 ,  totalScore: 0, lastRoundScore: 0, teamSize: 0, p01:"", p02:"",p03:"",p04:"",p05:"",p06:"",p07:"",p08:"",p09:""}).then(function() {console.log("Team two successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);});  
    
    for (var i = 0, len = playerNames.length; i < len; i++) { 
            
   if (orderNumber == 1){  db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                           db.collection("teams").doc(teamOne).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                           db.collection("sessions").doc(sessName).update({p01:playerNames[i]}).then(function() {console.log("t1p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      else if (orderNumber == 2){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p02:playerNames[i]}).then(function() {console.log("t3p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 3){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p03:playerNames[i]}).then(function() {console.log("t1p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 4){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p04:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 5){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p05:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 6){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p06:playerNames[i]}).then(function() {console.log("t3p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 7){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p07:playerNames[i]}).then(function() {console.log("t1p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 8){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p08:playerNames[i]}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 9){ db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p09:playerNames[i]}).then(function() {console.log("t3p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 10){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 4, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p10:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 11){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 4, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p11:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 12){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 4, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p12:playerNames[i]}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 13){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne,teamName: teamOneName, teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p13:playerNames[i]}).then(function() {console.log("t2p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 14){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p14:playerNames[i]}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 15){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p15:playerNames[i]}).then(function() {console.log("t2p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 16){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName, teamOrderNumber: 6, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p06:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p16:playerNames[i]}).then(function() {console.log("t2p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 17){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 6, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p06:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p17:playerNames[i]}).then(function() {console.log("t2p8: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 18){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 6, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p06:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p18:playerNames[i]}).then(function() {console.log("t2p9: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 19){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 7, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p07:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p19:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 20){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: 7, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p07:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p20:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }    
      //increment session player number
    orderNumber++;
      };
    
  }
  else if (teamCount == 4) {
        
      db.collection("sessions").doc(sessName).set({name: sessionPickedName,active: true, started: false, timeRoundEnd: 0, turnActive: false, namesPerPlayer: namesPerPlayer, numberOfPlayers: countNumberPlayers, numberOfPlayersEntered: 0, numberOfTeams: 4, lastNameGuessed: "None guessed yet" , currentRound: 1, currentTeam: currentTeam, currentTeamName: currentTeamName, currentPlayer: currentPlayer, currentPlayerNumber : currentPlayerNumber, currentScore: 0, roundTimeDefault: timePicked, roundTime: timePicked, p01:"", p02:"", p03:"", p04:"", p05:"", p06:"", p07:"", p08:"", p09:"", p10:"", p11:"", p12:"", p13:"", p14:"", p15:"", p16:"", p17:"", p18:"", p19:"", p20:""}).then(function() {console.log("Session successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);}); 
      
      // create team 3 and 4
      db.collection("teams").doc(teamThree).set({teamName: teamThreeName, tpNumber: 1, sessionName: sessName, jokerAvailable: jokerGame, r1Score: 0, r2Score: 0, r3Score: 0 ,  totalScore: 0, lastRoundScore: 0, teamSize: 0, p01:"", p02:"",p03:"",p04:"",p05:"",p06:"",p07:"",p08:"",p09:""}).then(function() {console.log("Team two successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);});  
    
      db.collection("teams").doc(teamFour).set({teamName: teamFourName, tpNumber: 1, sessionName: sessName, jokerAvailable: jokerGame, r1Score: 0, r2Score: 0, r3Score: 0 ,  totalScore: 0, lastRoundScore: 0, teamSize: 0, p01:"", p02:"",p03:"",p04:"",p05:"",p06:"",p07:"",p08:"",p09:""}).then(function() {console.log("Team two successfully created!");
      }).catch(function(error) {console.error("Error writing document: ", error);});  
     
    for (var i = 0, len = playerNames.length; i < len; i++) { 
            
   if (orderNumber == 1){  db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0, avgScore: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName, teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                           db.collection("teams").doc(teamOne).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                           db.collection("sessions").doc(sessName).update({p01:playerNames[i]}).then(function() {console.log("t1p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      
      else if (orderNumber == 2){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0, avgScore: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p02:playerNames[i]}).then(function() {console.log("t2p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 3){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0, sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p03:playerNames[i]}).then(function() {console.log("t3p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 4){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0, sessionName: sessName, hasEnteredNames: false, team:teamFour, teamName: teamFourName,teamOrderNumber: 1, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamFour).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t4p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p04:playerNames[i]}).then(function() {console.log("t4p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 5){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p05:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 6){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p06:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 7){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p07:playerNames[i]}).then(function() {console.log("t3p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 8){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamFour, teamName: teamFourName,teamOrderNumber: 2, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamFour).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t4p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p08:playerNames[i]}).then(function() {console.log("t4p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 9){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p09:playerNames[i]}).then(function() {console.log("t1p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 10){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p10:playerNames[i]}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 11){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p11:playerNames[i]}).then(function() {console.log("t3p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
     
      else if (orderNumber == 12){ db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamFour, teamName: teamFourName,teamOrderNumber: 3, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamFour).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t4p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p12:playerNames[i]}).then(function() {console.log("t4p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
     
      else if (orderNumber == 13){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 4,orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p13:playerNames[i]}).then(function() {console.log("t1p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 14){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: 4,orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p14:playerNames[i]}).then(function() {console.log("t2p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 15){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber:4,orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p15:playerNames[i]}).then(function() {console.log("t3p4"+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 16){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamFour,teamName: teamFourName, teamOrderNumber:4,orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamFour).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t4p4 "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p16:playerNames[i]}).then(function() {console.log("t4p4"+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
     
      else if (orderNumber == 17){db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName,teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamOne).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p17:playerNames[i]}).then(function() {console.log("t1p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 18){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamTwo,teamName: teamTwoName, teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamTwo).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p18:playerNames[i]}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      
      else if (orderNumber == 19){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamThree, teamName: teamThreeName,teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamThree).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t3p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p19:playerNames[i]}).then(function() {console.log("t3p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
     
      else if (orderNumber == 20){db.collection("players").doc(playerNames[i]).set({score: 0, turns: 0,avgScore: 0,sessionName: sessName, hasEnteredNames: false, team:teamFour, teamName: teamFourName,teamOrderNumber: 5, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); 
                                  db.collection("teams").doc(teamFour).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t4p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);});
                                  db.collection("sessions").doc(sessName).update({p20:playerNames[i]}).then(function() {console.log("t4p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 

      //increment session player number
    orderNumber++;
      };
    }  else {
      
      
    //********* 2 team game  ************
      db.collection("sessions").doc(sessName).set({name: sessionPickedName, active: true, started: false, timeRoundEnd: 0, turnActive: false, namesPerPlayer: namesPerPlayer, numberOfPlayers: countNumberPlayers, numberOfPlayersEntered: 0, numberOfTeams: 2, lastNameGuessed: "None guessed yet" , currentRound: 1, currentTeam: currentTeam, currentTeamName: currentTeamName, currentPlayer: currentPlayer, currentPlayerNumber : currentPlayerNumber, currentScore: 0, roundTimeDefault: timePicked, roundTime: timePicked, p01:"", p02:"", p03:"", p04:"", p05:"", p06:"", p07:"", p08:"", p09:"", p10:"", p11:"", p12:"", p13:"", p14:"", p15:"", p16:"", p17:"", p18:"", p19:"", p20:""}).then(function() {console.log("Session successfully created!");
    }).catch(function(error) {console.error("Error writing document: ", error);}); 
    //iterate through names and add to players to the DB
      for (var i = 0, len = playerNames.length; i < len; i++) { 
      if (i % 2 == 0){   
      //add new player to players collection
      db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamOne, teamName: teamOneName, teamOrderNumber: t1number, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);
        }).catch(function(error) {console.error("Error writing document: ", error);}); 
      //add player to team in order
      if (t1number == 1){db.collection("teams").doc(teamOne).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      else if (t1number == 2){db.collection("teams").doc(teamOne).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 3){db.collection("teams").doc(teamOne).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 4){db.collection("teams").doc(teamOne).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 5){db.collection("teams").doc(teamOne).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 6){db.collection("teams").doc(teamOne).update({p06:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 7){db.collection("teams").doc(teamOne).update({p07:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 8){db.collection("teams").doc(teamOne).update({p08:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p8: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t1number == 9){db.collection("teams").doc(teamOne).update({p09:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t1p9: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      //increment team player number
      t1number++;
    } else {
      //add new player to players collection
      db.collection("players").doc(playerNames[i]).set({score: 0, sessionName: sessName, hasEnteredNames: false, team:teamTwo, teamName: teamTwoName,teamOrderNumber: t2number, orderNumber: orderNumber}).then(function() {console.log("Player created: "+playerNames[i]);
        }).catch(function(error) {console.error("Error writing document: ", error);}); 
      //add player to team in order
            if (t2number == 1){db.collection("teams").doc(teamTwo).update({currentPlayer:playerNames[i], p01:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      else if (t2number == 2){db.collection("teams").doc(teamTwo).update({p02:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 3){db.collection("teams").doc(teamTwo).update({p03:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 4){db.collection("teams").doc(teamTwo).update({p04:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 5){db.collection("teams").doc(teamTwo).update({p05:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 6){db.collection("teams").doc(teamTwo).update({p06:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 7){db.collection("teams").doc(teamTwo).update({p07:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 8){db.collection("teams").doc(teamTwo).update({p08:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p8: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (t2number == 9){db.collection("teams").doc(teamTwo).update({p09:playerNames[i], teamSize: increaseBy}).then(function() {console.log("t2p9: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      //increment team player number
        t2number++;
    };
      //add player to session in order
       if (orderNumber == 1){db.collection("sessions").doc(sessName).update({p01:playerNames[i]}).then(function() {console.log("t2p1: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }
      else if (orderNumber == 2){db.collection("sessions").doc(sessName).update({p02:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 3){db.collection("sessions").doc(sessName).update({p03:playerNames[i]}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 4){db.collection("sessions").doc(sessName).update({p04:playerNames[i]}).then(function() {console.log("t2p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 5){db.collection("sessions").doc(sessName).update({p05:playerNames[i]}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 6){db.collection("sessions").doc(sessName).update({p06:playerNames[i]}).then(function() {console.log("t2p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 7){db.collection("sessions").doc(sessName).update({p07:playerNames[i]}).then(function() {console.log("t2p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 8){db.collection("sessions").doc(sessName).update({p08:playerNames[i]}).then(function() {console.log("t2p8: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 9){db.collection("sessions").doc(sessName).update({p09:playerNames[i]}).then(function() {console.log("t2p9: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 10){db.collection("sessions").doc(sessName).update({p10:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 11){db.collection("sessions").doc(sessName).update({p11:playerNames[i]}).then(function() {console.log("t2p2: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 12){db.collection("sessions").doc(sessName).update({p12:playerNames[i]}).then(function() {console.log("t2p3: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 13){db.collection("sessions").doc(sessName).update({p13:playerNames[i]}).then(function() {console.log("t2p4: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 14){db.collection("sessions").doc(sessName).update({p14:playerNames[i]}).then(function() {console.log("t2p5: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 15){db.collection("sessions").doc(sessName).update({p15:playerNames[i]}).then(function() {console.log("t2p6: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 16){db.collection("sessions").doc(sessName).update({p16:playerNames[i]}).then(function() {console.log("t2p7: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 17){db.collection("sessions").doc(sessName).update({p17:playerNames[i]}).then(function() {console.log("t2p8: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 18){db.collection("sessions").doc(sessName).update({p18:playerNames[i]}).then(function() {console.log("t2p9: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 19){db.collection("sessions").doc(sessName).update({p19:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); } 
      else if (orderNumber == 20){db.collection("sessions").doc(sessName).update({p20:playerNames[i]}).then(function() {console.log("t2p10: "+playerNames[i]);}).catch(function(error) {console.error("Error writing document: ", error);}); }    
      //increment session player number
    orderNumber++;
    };
        
  }
 
createPlayerOptions();

document.getElementById('setupCreateGameSessionButton').disabled = true;
document.getElementById("createSuccess").style.display = "block";
document.getElementById("createScreen").style.display = "none";

};

function createPlayerOptions (){
    console.log("Active players: "+ activePlayers);
    var selectPlayer = document.getElementById("createSelectPlayer");
      for(var i = 0; i < activePlayers.length; i++) {
          var opt = activePlayers[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          selectPlayer.appendChild(el);
        } 
    }; 

function showCreateJoinButton(){
  document.getElementById("createJoinButton").style.display = "block";
  }

function createJoinGame(){
document.getElementById("createSuccess").style.display = "none";
playerPicked = document.getElementById("createSelectPlayer").value;
joinGame();
}

// create new game back button to start page
function createBack() {
  document.getElementById("page-splash").style.display = "block";
  document.getElementById("wordCloud").style.display = "block";
  document.getElementById("createScreen").style.display = "none";
  location.reload()
  console.log("Reloaded")
}  

//***************************************
// Join Game Functions
//***************************************

var input = document.getElementById("joinSessionID");
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter" ) {
      event.preventDefault();
      sessionPick();
  }
});

function sessionPick() {
  
  sessionPicked = document.getElementById('joinSessionID').value.toUpperCase();
  
  getPlayers();
 }

function playerPick() {
  playerPicked = document.getElementById('selectPlayer').value;
  document.getElementById("joinGame").style.display = "block";
}

function joinGame(){
  console.log("Session Picked: "+sessionPicked)
  console.log("Player Picked: "+playerPicked)
  document.getElementById("joinScreen").style.display = "none";
  getTeams();
  getTeamPicked();
  console.log("Active teams: "+activeTeams);
  document.getElementById("waitSessionID").innerHTML = sessionPicked
  document.getElementById("enterPlayerPicked").innerHTML = playerPicked;
  document.getElementById('startShowPlayer').innerHTML = playerPicked;
  document.getElementById("loginName").innerHTML = playerPicked;
  document.getElementById('welcomePlayer').innerHTML = playerPicked;
  
  hasUserEnteredNames();
  
}

function updateHomeScreen(){
  
    document.getElementById('refreshIcon').style = "animation: spin-reverse 2s 1 linear;"

  
        document.getElementById('showNextPlayer').innerHTML =  currentPlayer;    
        document.getElementById('showNextTeam').innerHTML =  currentTeamName
        document.getElementById('showRound').innerHTML =  "Round "+currentRound           
        document.getElementById("homeStart").style.display = "none";
        document.getElementById("homeGoInProgress").style.display = "none";
        document.getElementById("homeMyTeam").style.display = "none";
        document.getElementById("homeWait").style.display = "none";    
        document.getElementById("menu-start").style.display = "none"; 
      
      // Logic to determine what to display on the home screen
      
       if (currentRound == 4){
         //if game has ended:
          homeScreen.style.display = 'none';
          startScreen.style.display = 'none';
          teamsScreen.style.display = "none";
          document.getElementById("gameOverScreen").style.display = 'block';
          document.getElementById("signOutIcon").style.display = "block";  
          document.getElementById("menu-goHome").style.display = "none";        
          document.getElementById("menu-refresh").style.display = "none";  
          document.getElementById("endGameTrigger").style.display = "block";  
         
         endTeamScores();
        
 
         fireworks.style.display="block"
         var animFireworks = bodymovin.loadAnimation({
            wrapper: fireworks,
            animType: 'svg',
            loop: true,
            path: 'https://assets7.lottiefiles.com/temp/lf20_n16WIy.json'
          });
         
          //HIDE ROUND SCREEN   roundScreen.style.display = "none";         
          
         enableNavBarButtons();
         document.getElementById("roundEnd-splash").style.display = "none" ;
             
            document.getElementById("menu-start").style.display = "none"; 
           // document.getElementById("turnAlert").style.display = "none";     
          //HIDE ROUND SCREEN     menuRound.style.display = "none"
      } else  if (currentPlayer == playerPicked && turnActive == false){
      //Users turn
            enableNavBarButtons();
            document.getElementById("homeStart").style.display = "block";
            document.getElementById("menu-start").style.display = "block";
      // openAlert();    
     
     } else if (currentPlayer !== playerPicked) {

            if (currentTeam == teamPicked){
              // Users teams turn, but not users turn
              document.getElementById("homeMyTeam").style.display = "block";
              document.getElementById("myTeamPlayer").innerHTML = currentPlayer;
                if (currentRound == 1){
              document.getElementById("myTeamRound").innerHTML = "describing";
                }           
                if (currentRound == 2){
              document.getElementById("myTeamRound").innerHTML = "giving a 1 word clue for";
                }           
                if (currentRound == 3){
              document.getElementById("myTeamRound").innerHTML = "acting out";
                }           
           
         } else if (turnActive == true){
            //Not users teams turn but a go is in progress
             document.getElementById("homeGoInProgress").style.display = "block";
         } else {
          //Not users teams turn and waiting for next team to start
            document.getElementById("homeWait").style.display = "block";           
         }               
     } 
  
  }


function updateHomeScreenDetails(){
 
    document.getElementById('refreshIcon').style = "animation: spin-reverse 2s infinite linear;"
      
  db.collection("turns-active").doc(sessionPicked).get().then(function(doc) {  
      currentPlayer = doc.data().currentPlayer; 
      currentTeam = doc.data().currentTeam;
      currentTeamName = doc.data().currentTeamName;
      currentRound = doc.data().currentRound;
      turnActive = doc.data().turnActive
      updateHomeScreen(); 
      console.log("update function executed")
  })                                                 
}


function showHomeScreenDetails(){
    document.getElementById('refreshIcon').style = "animation: spin-reverse 2s infinite linear;"
  
var unsubscribeShowHome =  db.collection("turns-active").doc(sessionPicked)
    .onSnapshot(function(doc) {
      
      listenShowHome = true
      console.log("Show snapshot called")
      
      currentPlayer = doc.data().currentPlayer; 
      currentTeam = doc.data().currentTeam;
      currentTeamName = doc.data().currentTeamName;
      currentRound = doc.data().currentRound;
      turnActive = doc.data().turnActive
      updateHomeScreen();

  });  
}

function hasUserEnteredNames() {
 
   db.collection("players").doc(playerPicked).get().then(function(doc) {
    if (doc.exists) { hasEnteredNames = doc.data().hasEnteredNames;
                     console.log("Player has entered names: "+hasEnteredNames)
              if (hasEnteredNames == true) {
                checkForPlayersEnteredNames();
              } else {
                adjustNameCount();
                document.getElementById("enterScreen").style.display = "block"
              };
    } else {console.log("No such document!");
    }}).catch(function(error) {console.log("Error getting document:", error);}); 
};

function checkForPlayersEnteredNames () {

var unsubscribe =  db.collection("players").where("hasEnteredNames", "==", false).where("sessionName", "==", sessionPicked)
    .onSnapshot(function(querySnapshot) {
      
       listenCheckEntered = true
       console.log("CheckEntered Snapshot called")
      
      
        var playersLeftToEnter = [];
        querySnapshot.forEach(function(doc) {
            playersLeftToEnter.push(doc.id);
        });
   document.getElementById("playersYetToEnter").innerHTML = "Players left: "+playersLeftToEnter
  
   console.log("Count players left to enter: "+playersLeftToEnter.length)
      
      if (playersLeftToEnter.length == 0) {
        
        unsubscribe();
        listenCheckEntered = false;
  
       db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
                if (doc.exists) { gameStarted = doc.data().started;
                                       currentRound = doc.data().currentRound;                                  
                                  var upNextPlayer = doc.data().currentPlayer;
                                  var upNextTeam = doc.data().currentTeam
                                  var upNextTeamName = doc.data().currentTeamName
                                  document.getElementById("upNextTeam").innerHTML = upNextTeamName;
                                  document.getElementById("upNextPlayer").innerHTML = upNextPlayer;

                  document.getElementById("waitScreen").style.display = "none";
                                 
                    if (currentRound !== 4){             
                  document.getElementById("welcomeScreen").style.display = "block"
                 } else {
                   showSection(homeScreen, menuHome);
                   showHomeScreenDetails();
                   enableNavBarButtons();
                 }
                                              
                } else {console.log("No such document!");
              }}).catch(function(error) {console.log("Error getting document:", error);}); 

      } else {
            document.getElementById("waitScreen").style.display = "block";
      }
  });
}

/*When user Joins game - populate session and player functions
function getActiveSessions () {
  
  activeSessions = [];
  sessionPicked = ""
  
  removeOptions(document.getElementById("selectSession"));
  
  db.collection("sessions").where("active","==",true).get().then(function(querySnapshot) {
     querySnapshot.forEach(function(doc) {
    activeSessions.push(doc.data().name); 
     });
      return activeSessions;
  }).then(function (activeSessions) {
      sessionOptions(activeSessions);
      document.getElementById("selectSession").style.display = "block";
    });
};
*/

function sessionOptions (activeSessions){
    console.log("Active sessions: "+ activeSessions);
      //Start Session options set  
     var selectStartSession = document.getElementById("selectSession");
      for(var i = 0; i < activeSessions.length; i++) {
          var opt = activeSessions[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          selectStartSession.appendChild(el);
        } 
}; 

function removeOptions(selectbox) {
    var i;
    for(i = selectbox.options.length - 1 ; i > 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function getPlayers () {
    activePlayers = [];
    playerPicked = "";
  
    removeOptions(document.getElementById("selectPlayer"));
  
    db.collection("players").where("sessionName","==",sessionPicked).get().then(function(querySnapshot) {
     querySnapshot.forEach(function(doc) {
    activePlayers.push(doc.id); 
     });
      return activePlayers;
  }).then(function (activePlayers) {
     console.log(activePlayers)
      
      if (activePlayers.length == 0){
        document.getElementById('sessionNotRecognised').style.display =  'block';   
        
    } else {
      document.getElementById("selectPlayer").style.display = "block";
      document.getElementById('sessionNotRecognised').style.display =  'none';  
      playerOptions(activePlayers); 
    }

    });
};

function playerOptions (activeSessions){
    console.log("Active players: "+ activePlayers);
  
      //Start Session options set  
     var selectPlayer = document.getElementById("selectPlayer");
          for(var i = 0; i < activePlayers.length; i++) {
          var opt = activePlayers[i];
          var el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          selectPlayer.appendChild(el);
        } 
}; 
      
function getTeams () {
    activeTeams = [];
    activeTeamNames = [];  
    db.collection("teams").where("sessionName","==",sessionPicked).get().then(function(querySnapshot) {
     querySnapshot.forEach(function(doc) {
      activeTeams.push(doc.id); 
      activeTeamNames.push(doc.data().teamName)
     });
      return activeTeams;
    }).then(function (activeTeams){
     activeTeamOne = activeTeams[0];
     activeTeamOneName = activeTeamNames[0];
      document.getElementById('showTeamOneName').innerHTML = activeTeamOneName
      activeTeamTwo = activeTeams[1];
      activeTeamTwoName = activeTeamNames[1];
      document.getElementById('showTeamTwoName').innerHTML = activeTeamTwoName
      if (activeTeams.length == 3){
        activeTeamThree = activeTeams[2];
        activeTeamThreeName = activeTeamNames[2];
        document.getElementById('showTeamThreeName').innerHTML = activeTeamThreeName
      } else if (activeTeams.length == 4){
        activeTeamThree = activeTeams[2];
        activeTeamThreeName = activeTeamNames[2];
        activeTeamFour = activeTeams[3];  
        activeTeamFourName = activeTeamNames[3];
        document.getElementById('showTeamThreeName').innerHTML = activeTeamThreeName
        document.getElementById('showTeamFourName').innerHTML = activeTeamFourName
      } else {
        console.log("Error updating active team names")
      };
    populateTeams(activeTeams);
    });
};

function getTeamPicked() {
    teamPicked = "";
    db.collection("players").doc(playerPicked).get().then(function(doc) {
    if (doc.exists) {teamPicked = doc.data().team;
                     teamPickedName = doc.data().teamName;
                     playerNumber = doc.data().orderNumber;
                     console.log("Team picked: "+teamPicked)
                     document.getElementById("welcomeTeam").innerHTML = teamPickedName;
                     //document.getElementById("loginTeamName").innerHTML = teamPickedName;
                     document.getElementById("loginSessionName").innerHTML = sessionPicked;

    } else {console.log("No such document!");
    }}).catch(function(error) {console.log("Error getting document:", error);}); 
};

function getCurrentRound() {
     db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
    if (doc.exists) { currentRound = doc.data().currentRound;
                     console.log("Current Round: "+currentRound);
                   } else {console.log("No such document!");
    }}).catch(function(error) {console.log("Error getting document:", error);}); 
};

function populateTeams() {
  
$('li').filter(function(){return $.trim($(this).html()) == '';}).show()
  
  activeTeamOne = activeTeams[0];
  activeTeamTwo = activeTeams[1];
  activeTeamThree = activeTeams[2];
  activeTeamFour = activeTeams[3];
  
db.collection("teams").doc(activeTeamOne).get().then(function(doc) {if (doc.exists) { 
  
  t1p1 = doc.data().p01
  t1p2 = doc.data().p02
  t1p3 = doc.data().p03
  t1p4 = doc.data().p04
  t1p5 = doc.data().p05
  t1p6 = doc.data().p06
  t1p7 = doc.data().p07
  t1p8 = doc.data().p08
  t1p9 = doc.data().p09
  
document.getElementById('t1p1').innerHTML = t1p1
document.getElementById('t1p2').innerHTML = t1p2
document.getElementById('t1p3').innerHTML = t1p3
document.getElementById('t1p4').innerHTML = t1p4
document.getElementById('t1p5').innerHTML = t1p5
document.getElementById('t1p6').innerHTML = t1p6
document.getElementById('t1p7').innerHTML = t1p7
document.getElementById('t1p8').innerHTML = t1p8
document.getElementById('t1p9').innerHTML = t1p9
   
} else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

  //get Team 2 as JS Object
db.collection("teams").doc(activeTeamTwo).get().then(function(doc) {if (doc.exists) { 
  t2p1 = doc.data().p01
  t2p2 = doc.data().p02
  t2p3 = doc.data().p03
  t2p4 = doc.data().p04
  t2p5 = doc.data().p05
  t2p6 = doc.data().p06
  t2p7 = doc.data().p07
  t2p8 = doc.data().p08
  t2p9 = doc.data().p09

document.getElementById('t2p1').innerHTML = t2p1
document.getElementById('t2p2').innerHTML = t2p2
document.getElementById('t2p3').innerHTML = t2p3
document.getElementById('t2p4').innerHTML = t2p4
document.getElementById('t2p5').innerHTML = t2p5
document.getElementById('t2p6').innerHTML = t2p6
document.getElementById('t2p7').innerHTML = t2p7
document.getElementById('t2p8').innerHTML = t2p8
document.getElementById('t2p9').innerHTML = t2p9


  
  if (activeTeams.length == 2) { 
      $('li').filter(function(){return $.trim($(this).html()) == '';}).hide()  
  }
  
} else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

if (activeTeams.length == 3){

db.collection("teams").doc(activeTeamThree).get().then(function(doc) {if (doc.exists) { 
  t3p1 = doc.data().p01
  t3p2 = doc.data().p02
  t3p3 = doc.data().p03
  t3p4 = doc.data().p04
  t3p5 = doc.data().p05
  t3p6 = doc.data().p06
  t3p7 = doc.data().p07
  t3p8 = doc.data().p08
  t3p9 = doc.data().p09
  
document.getElementById('t3p1').innerHTML = t3p1
document.getElementById('t3p2').innerHTML = t3p2
document.getElementById('t3p3').innerHTML = t3p3
document.getElementById('t3p4').innerHTML = t3p4
document.getElementById('t3p5').innerHTML = t3p5
document.getElementById('t3p6').innerHTML = t3p6
document.getElementById('t3p7').innerHTML = t3p7
document.getElementById('t3p8').innerHTML = t3p8
document.getElementById('t3p9').innerHTML = t3p9
        $('li').filter(function(){return $.trim($(this).html()) == '';}).hide()  
      document.getElementById("teamThree").style.display = "block"; 
} else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

  }
    if (activeTeams.length == 4){
$('li').filter(function(){return $.trim($(this).html()) == '';}).show()
  db.collection("teams").doc(activeTeamThree).get().then(function(doc) {if (doc.exists) { 
  t3p1 = doc.data().p01
  t3p2 = doc.data().p02
  t3p3 = doc.data().p03
  t3p4 = doc.data().p04
  t3p5 = doc.data().p05
  t3p6 = doc.data().p06
  t3p7 = doc.data().p07
  t3p8 = doc.data().p08
  t3p9 = doc.data().p09
  
document.getElementById('t3p1').innerHTML = t3p1
document.getElementById('t3p2').innerHTML = t3p2
document.getElementById('t3p3').innerHTML = t3p3
document.getElementById('t3p4').innerHTML = t3p4
document.getElementById('t3p5').innerHTML = t3p5
document.getElementById('t3p6').innerHTML = t3p6
document.getElementById('t3p7').innerHTML = t3p7
document.getElementById('t3p8').innerHTML = t3p8
document.getElementById('t3p9').innerHTML = t3p9
document.getElementById("teamThree").style.display = "block"; 
} else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

    db.collection("teams").doc(activeTeamFour).get().then(function(doc) {if (doc.exists) { 
  t4p1 = doc.data().p01
  t4p2 = doc.data().p02
  t4p3 = doc.data().p03
  t4p4 = doc.data().p04
  t4p5 = doc.data().p05
  t4p6 = doc.data().p06
  t4p7 = doc.data().p07
  t4p8 = doc.data().p08
  t4p9 = doc.data().p09
  
document.getElementById('t4p1').innerHTML = t4p1
document.getElementById('t4p2').innerHTML = t4p2
document.getElementById('t4p3').innerHTML = t4p3
document.getElementById('t4p4').innerHTML = t4p4
document.getElementById('t4p5').innerHTML = t4p5
document.getElementById('t4p6').innerHTML = t4p6
document.getElementById('t4p7').innerHTML = t4p7
document.getElementById('t4p8').innerHTML = t4p8
document.getElementById('t4p9').innerHTML = t4p9
        document.getElementById("teamFour").style.display = "block"; 
          $('li').filter(function(){return $.trim($(this).html()) == '';}).hide()  
} else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
}
 
};


//**********************************
// Enter Names Functions
//**********************************
var targetName
var wikiName
var wikiLink

function enterSubmitNames() {
var bagName1 = document.getElementById('enterNameOne').value;
var bagName2 = document.getElementById('enterNameTwo').value;
var bagName3 = document.getElementById('enterNameThree').value;
var bagName4 = document.getElementById('enterNameFour').value;
var bagName5 = document.getElementById('enterNameFive').value;
var bagName6 = document.getElementById('enterNameSix').value;
var bagName7 = document.getElementById('enterNameSeven').value;
var bagName8 = document.getElementById('enterNameEight').value;
var bagName9 = document.getElementById('enterNameNine').value;
var bagName10 = document.getElementById('enterNameTen').value;
              
var bagNamesEntered= [bagName1,bagName2,bagName3,bagName4,bagName5,bagName6,bagName7,bagName8,bagName9,bagName10]  
var nameId = ''.concat(sessionPicked,playerNumber);
  document.getElementById('submitNamesButton').disabled = true;   
var newId = parseInt(namesPerPlayer,10)
var increaseByNPP = firebase.firestore.FieldValue.increment(newId);
var nameId1 = nameId.concat('01')
var nameId2 = nameId.concat('02')
var nameId3 = nameId.concat('03')
var nameId4 = nameId.concat('04')
var nameId5 = nameId.concat('05')
var nameId6 = nameId.concat('06')
var nameId7 = nameId.concat('07')
var nameId8 = nameId.concat('08')
var nameId9 = nameId.concat('09')
var nameId10 = nameId.concat('10')    
       
       
db.collection("names").doc(nameId1.toString()).set({bagName: bagName1, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 1 successfully written: "+bagName1);
}).catch(function(error) {console.error("Error writing document: ", error);});

  
db.collection("names").doc(nameId2.toString()).set({bagName: bagName2, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 2 successfully written: "+bagName2);
}).catch(function(error) {console.error("Error writing document: ", error);});

db.collection("names").doc(nameId3.toString()).set({bagName: bagName3,submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 3 successfully written: "+bagName3);
}).catch(function(error) {console.error("Error writing document: ", error);});

if (namesPerPlayer > 3) {
db.collection("names").doc(nameId4.toString()).set({bagName: bagName4, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 4 successfully written: "+bagName4);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 4) {   
db.collection("names").doc(nameId5.toString()).set({bagName: bagName5, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName5);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 5) {
db.collection("names").doc(nameId6.toString()).set({bagName: bagName6, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName6);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 6) {  
db.collection("names").doc(nameId7.toString()).set({bagName: bagName7, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName7);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 7) {
db.collection("names").doc(nameId8.toString()).set({bagName: bagName8, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName8);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 8) {
db.collection("names").doc(nameId9.toString()).set({bagName: bagName9, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName9);
}).catch(function(error) {console.error("Error writing document: ", error);});
}
if (namesPerPlayer > 9) {
db.collection("names").doc(nameId10.toString()).set({bagName: bagName10, submittedBy: playerPicked, sessionName: sessionPicked, round: 1}).then(function() {console.log("Name 5 successfully written: "+bagName10);
}).catch(function(error) {console.error("Error writing document: ", error);});
};
       
db.collection("players").doc(playerPicked).update({hasEnteredNames: true}).then(function() {console.log("Player entered names: True ");
}).catch(function(error) {console.error("Error writing document: ", error);});

db.collection("sessions").doc(sessionPicked).update({numberOfPlayersEntered: increaseBy}).then(function() {console.log("numberOfPlayersEntered: +1");
}).catch(function(error) {console.error("Error writing document: ", error);});
 

         
document.getElementById("enterScreen").style.display = "none"
  

checkForPlayersEnteredNames ();
};          

// WikiData top people based on number of Wiki articles referencing them
function getRandomWikiName(){

  document.getElementById('wikiWait').style.display= 'block';
  document.getElementById('wiki').style.display= 'none';

  
function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
	var settings = {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};
	return $.ajax( endpointUrl, settings ).then( doneCallback );
}

var endpointUrl = 'https://query.wikidata.org/sparql',
	  
    sparqlQuery = "SELECT ?person ?name ?linkcount ?wikipedia_article\n" +
        "WHERE\n" +
        "{\n" +
        "  ?person wdt:P31 wd:Q5 ;   # human\n" +
        "     wdt:P569 ?born .\n" +
        "  FILTER (?born >= \"1920-01-01T00:00:00Z\"^^xsd:dateTime) .\n" +
        "  ?person wikibase:sitelinks ?linkcount .\n" +
        "  FILTER (?linkcount > 50) .\n" +
        "  ?person rdfs:label ?name FILTER(lang(?name)=\"en\").\n" +
        "  ?wikipedia_article schema:about ?person .\n" +
        "  ?wikipedia_article schema:isPartOf <https://en.wikiquote.org/> .\n" +
        "}\n" +
        "ORDER BY DESC(?linkcount)\n" +
        "LIMIT 1 OFFSET "+ Math.floor((Math.random() * 100) + 1);

makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
//		$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
    console.log(data.results.bindings[0].name.value)
    console.log(data.results.bindings[0].wikipedia_article.value)
  wikiName = data.results.bindings[0].name.value
  wikiLink = data.results.bindings[0].wikipedia_article.value
}
).then(function(){
  document.getElementById('wikiWait').style.display= 'none';
  document.getElementById('wiki').style.display= 'block';
  document.getElementById('wiki').src = wikiLink;
  })
}


function addRandomWikiName(){
  document.getElementById(targetName).value = wikiName
  document.getElementById('wiki').src = "";
  countNamesEntered();
}

document.getElementById('enterNameOne').addEventListener("keyup", function(event) {
   countNamesEntered();
});
document.getElementById('enterNameTwo').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameThree').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameFour').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameFive').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameSix').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameSeven').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameEight').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameNine').addEventListener("keyup", function(event) {
  countNamesEntered();
});
document.getElementById('enterNameTen').addEventListener("keyup", function(event) {
  countNamesEntered();
});


function oneSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton1").style.display = "block"; targetName = 'enterNameOne';}
function twoSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton2").style.display = "block"; targetName = 'enterNameTwo';}
function threeSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton3").style.display = "block"; targetName = 'enterNameThree';}
function fourSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton4").style.display = "block"; targetName = 'enterNameFour';}
function fiveSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton5").style.display = "block"; targetName = 'enterNameFive';}
function sixSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton6").style.display = "block"; targetName = 'enterNameSix';}
function sevenSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton7").style.display = "block"; targetName = 'enterNameSeven';}
function eightSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton8").style.display = "block"; targetName = 'enterNameEight';}
function nineSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton9").style.display = "block"; targetName = 'enterNameNine';}
function tenSelect(){hideAllWiki(); document.getElementById("randomWikiNameButton10").style.display = "block"; targetName = 'enterNameTen';}

function hideAllWiki(){
  document.getElementById("randomWikiNameButton1").style.display = "none";
  document.getElementById("randomWikiNameButton2").style.display = "none";
  document.getElementById("randomWikiNameButton3").style.display = "none";
  document.getElementById("randomWikiNameButton4").style.display = "none";
  document.getElementById("randomWikiNameButton5").style.display = "none";
  document.getElementById("randomWikiNameButton6").style.display = "none";
  document.getElementById("randomWikiNameButton7").style.display = "none";
  document.getElementById("randomWikiNameButton8").style.display = "none";
  document.getElementById("randomWikiNameButton9").style.display = "none";
  document.getElementById("randomWikiNameButton10").style.display = "none";
  countNamesEntered();
  }

var namesInputSoFar

function countNamesEntered(){

if (document.getElementById('enterNameTen').value.length > 0){
  namesInputSoFar = 10 }

else if (document.getElementById('enterNameNine').value.length > 0){
  namesInputSoFar = 9 }

else if (document.getElementById('enterNameEight').value.length > 0){
  namesInputSoFar = 8 }

else if (document.getElementById('enterNameSeven').value.length > 0){
  namesInputSoFar = 7 }

else if (document.getElementById('enterNameSix').value.length > 0){
  namesInputSoFar = 6 }

else if (document.getElementById('enterNameFive').value.length > 0){
  namesInputSoFar = 5 }

else if (document.getElementById('enterNameFour').value.length > 0){
  namesInputSoFar = 4 }

else if (document.getElementById('enterNameThree').value.length > 0){
  namesInputSoFar = 3 }

else if (document.getElementById('enterNameTwo').value.length > 0){
  namesInputSoFar = 2 }

else if (document.getElementById('enterNameOne').value.length > 0){
  namesInputSoFar = 1 }

else {namesInputSoFar = 0}

if (namesInputSoFar == namesPerPlayer){
  document.getElementById('submitNamesButton').disabled = false;
  console.log("Required number of names met")
}

  
}
//************************************************
//GAME SCREEN FUNCTIONs
//*************************************************
function getBagNames(){
 bagNames = [];
 db.collection("names").where("sessionName","==",sessionPicked).where("round","==",currentRound).get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {bagNames.push(doc.data().bagName); });
   console.log([bagNames])
   document.getElementById("gameStartButton").style.display = "block"; 
 });
};


function getStartInfo () {
  
  getRoundTime();   

  showSection(startScreen, menuStart);
     
  db.collection("players").doc(playerPicked).get().then(function(doc) {
    if (doc.exists) { playerTurns = doc.data().turns;
                     console.log("Turns: "+playerTurns);
                  } else {console.log("No such document!");
     };
  });
  
  db.collection("teams").doc(teamPicked).get().then(function(doc) {
    if (doc.exists) { jokerAvailable = doc.data().jokerAvailable;
                     console.log("Joker Available: "+jokerAvailable);
                     
                     if (jokerAvailable == true) {
                         document.getElementById("startJoker").style.display = "block"; 
                     }
                     
                  } else {console.log("No such document!");
     };
  });
  
  document.getElementById("start-splash").style.display = "block"; 
 
  
  
  db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
    if (doc.exists) {
      
                  currentRound = doc.data().currentRound;
                  console.log("Current Round: "+currentRound);
                  getBagNames();
                     
                  if (currentRound == 1){
                    document.getElementById('startShowCurrentRound').innerHTML = "<h5>Round 1</h5><hr><p>Describe the bag name that is randomly shown to you for your team to guess.</p><p>You can use as many words as you like without saying the name or a rhyming word</p><p>e.g. for the name James, you can't say 'Rhymes with Games', but you could say 'Rhymes with 'something'-master'!"
                  } else if (currentRound == 2) {
                    document.getElementById('startShowCurrentRound').innerHTML = "<h5>Round 2</h5><p></p><p>Use <strong>ONE</strong> word to describe the bag name that you pull out</p><p>Once you've said a word, there's no going back!</p><p>hint: the names are the same as they were in round 1"
                  } else if (currentRound == 3) {
                   document.getElementById('startShowCurrentRound').innerHTML = "<h5>Round 3</h5><p></p><p>Act out the bag name for your team</p><p>no sound effects, grunting or any other verbal hints or clues allowed!"
                  } else if (currentRound == 4) {
                  document.getElementById('startShowCurrentRound').innerHTML = "<h5>Game Over!</h5>"
                  }
                }
    else {console.log("No such document!");};
    
     }).catch(function(error) {console.log("Error getting document:", error);}); 
  
};

function getRoundTime(){
  
     db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
    if (doc.exists) { roundTime = doc.data().roundTime;
                     console.log("Round time: "+roundTime);
                      document.getElementById('startTimeLeft').innerHTML = "You have "+roundTime+" seconds"
                  } else {console.log("No such document!");
     };
  });
};

function startRound() {
 
  jokerActive = document.getElementById("activeJoker").checked;
  document.getElementById("startJoker").style.display = "none";
  document.getElementById("gameStartButton").style.display = "none";  
     
  disableNavBarButtons();
  
  enableGotItButton();
  
  hideGotPassButton();
  
  namesGotThisRound = [];
  gameHasPassed = false;
  nameArrayCount = 0;
  document.getElementById("gameStart").style.display = "block";  
  document.getElementById("start-splash").style.display = "none"; 
  var display = document.querySelector('#gameShowTime');
  
  
  startTimer(roundTime, display);
  document.getElementById('gameShowName').innerHTML = bagNames[0]
  
  var roundTimeNow = parseInt(roundTime)
  var timeNow = Date.now() 
  timeRoundEnd = timeNow + (roundTimeNow*1000)

  
 db.collection('sessions').doc(sessionPicked).update({ timeRoundEnd: timeRoundEnd, turnActive: true, currentPlayer: playerPicked, currentScore: 0 }).then(function() {console.log("Session player logged");
}).catch(function(error) {console.error("Error updating current player and reset score: ", error);});
  
 db.collection('turns-active').doc(sessionPicked).update({ timeRoundEnd: timeRoundEnd, turnActive: true, currentPlayer: playerPicked}).then(function() {console.log("Session player logged");
}).catch(function(error) {console.error("Error updating current player and reset score: ", error);});
  
  
      
};


//Start Timer
function startTimer(duration, display) {
  
  shuffle(bagNames);
  turnActive = true;
  console.log(bagNames);
  countNamesLeft = bagNames.length;
    if (countNamesLeft > 1) {
                              enablePassButton();
    } else if (countNamesLeft == 1){
                            document.getElementById('gameShowNumberLeft').innerHTML = "Last name!"
    } 
  
  document.getElementById('gameShowNumberLeft').innerHTML = countNamesLeft - 1 + " other names left";

var timer = duration, minutes, seconds;
var tickTock = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
 
        display.textContent = seconds;  
    
    if (timer==0){
      document.getElementById('countdownClockMP3').play()
      clearInterval(tickTock)
      endRoundWithNamesLeft();
         } else if (bagNames.length == 0) {  
          //new screen here for if you guess all names before time's up
          timeLeftOver = timer
          console.log(timeLeftOver)
          clearInterval(tickTock);
          endRoundWithTimeLeft();
         } else {
          --timer 
         roundProgress = ((roundTime-timer)/roundTime)*100
           //document.getElementById("roundProgressBar").style.width = roundProgress+"%"
      document.getElementById("roundProgressBar").setAttribute("style","width: "+roundProgress+"%")
    }   
  }, 1000);
  console.log(timer)
};

// Function to get bag names for the upcoming session
//Shuffle
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    } return arra1;
};
  
// Buttons when game has started
// notes: passed name will always be [0]
function gameGotItButton () {
document.getElementById('correctSound').play();
gameRemoveName();
  
  //case - user hasn't passed and there are no names left
if(bagNames.length == 0 && gameHasPassed == false){
noNamesLeft();
} 
  else if (bagNames.length == 1 && gameHasPassed==true) {
//case - user got the name and the passed name is the only one left
document.getElementById('gameGotItButton').disabled = false;
document.getElementById('gamePassButton').disabled = true; 
document.getElementById('gameShowNumberLeft').innerHTML = "Just the passed name is left";
document.getElementById('gameShowNamePassed').innerHTML = "-"
document.getElementById('gameShowName').innerHTML = bagNames[0];
nameArrayCount = 0;
hideGotPassButton();  
} 
  else if (bagNames.length == 1 && gameHasPassed==false) {
//case - user got the name and there is only one left with no passes
document.getElementById('gameGotItButton').disabled = false;
document.getElementById('gamePassButton').disabled = true; 
document.getElementById('gameShowNumberLeft').innerHTML = "Last name!";
document.getElementById('gameShowNamePassed').innerHTML = "-"
document.getElementById('gameShowName').innerHTML = bagNames[0];
nameArrayCount = 0;
hideGotPassButton();  
} 
  else {
//case - user hasn't passed and there is at least one name left
gameUpdateNumberLeft();
currentBagName = bagNames[nameArrayCount]
document.getElementById('gameShowName').innerHTML = currentBagName;
};
};  


function gamePassButton () { 
document.getElementById('passSound').play();
document.getElementById('gameShowNamePassed').innerHTML = bagNames[0]
console.log("Name passed: "+bagNames[0])
gameHasPassed = true;
nameArrayCount = 1;
currentBagName = bagNames[1];  
document.getElementById('gameShowName').innerHTML = currentBagName
disablePassButton();
showGotPassButton();
};


function gameGotPassButton () {
document.getElementById('correctSound').play();
nameArrayCount = 0
gameRemoveName();
gameHasPassed = false;
hideGotPassButton();
document.getElementById('gameShowNamePassed').innerHTML = "-"
if(bagNames.length == 0){
//case - passed name was the last name
noNamesLeft(); 
} else {
//case - user got the passed name and there is at least one other new name
if (bagNames.length > 1){
  enablePassButton();
}
gameUpdateNumberLeft();
currentBagName = bagNames[0]  
document.getElementById('gameShowName').innerHTML = currentBagName;  
};
};

function disablePassButton() {
 document.getElementById('gamePassButton').disabled = true;
};
  
function enablePassButton(){
 document.getElementById('gamePassButton').disabled = false;
};

function disableGotItButton(){
document.getElementById('gameGotItButton').disabled = true;
};

function enableGotItButton(){
document.getElementById('gameGotItButton').disabled = false;
};

function showGotPassButton(){
document.getElementById('gameGotPassButton').style.display = "block";
};

function hideGotPassButton(){
document.getElementById('gameGotPassButton').style.display = "none";
};

function gameUpdateNumberLeft() {
countNamesLeft = bagNames.length
console.log(bagNames.length + " names left");
document.getElementById('gameShowNumberLeft').innerHTML = countNamesLeft - 1 + " other names left";
};

//run this function when no names are left in the bag
function noNamesLeft(){
document.getElementById('gameGotItButton').disabled = true;
document.getElementById('gamePassButton').disabled = true; 
document.getElementById('gameShowNumberLeft').innerHTML = "No names left!";
document.getElementById('gameShowName').innerHTML = "-";
};


function gameRemoveName (){
var namesRemoved = (bagNames.splice(nameArrayCount, 1 )).toString();
namesGotThisRound.push(namesRemoved);  
var nextRound = currentRound + 1
var updateNameRound = []
// remove name from round bag

db.collection("names").where("sessionName","==",sessionPicked).where("round","==",currentRound).where("bagName","==",namesRemoved).get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    updateNameRound.push(doc.id); });
   console.log(updateNameRound[0]);
 
db.collection("names").doc(updateNameRound[0]).update({round: nextRound}).then(function() {console.log(namesRemoved+updateNameRound[0]+" round updated to "+nextRound);
}).catch(function(error) {console.error("Error updating name round: ", error);});
  
});
  
db.collection("sessions").doc(sessionPicked).update({lastNameGuessed: namesRemoved}).then(function() {console.log("Last name guessed updated to: "+namesRemoved);
}).catch(function(error) {console.error("Error updating name round: ", error);});  

 // If joker round is active, increase by 2

  if (jokerActive == true) {
           if (currentRound == 1){ 
db.collection('teams').doc(teamPicked).update({ r1Score: increaseBy2, totalScore: increaseBy2 }).then(function() {console.log("r1Score increased by 2");
}).catch(function(error) {console.error("Error updating r1Score: ", error);});
} else if (currentRound == 2) {
db.collection('teams').doc(teamPicked).update({ r2Score: increaseBy2, totalScore: increaseBy2 }).then(function() {console.log("r2Score increased by 2");
}).catch(function(error) {console.error("Error updating r2Score: ", error);});  
} else {
db.collection('teams').doc(teamPicked).update({ r3Score: increaseBy2, totalScore: increaseBy2 }).then(function() {console.log("r3Score increased by 2");
}).catch(function(error) {console.error("Error updating r3Score: ", error);});  
};  
    
db.collection('sessions').doc(sessionPicked).update({ currentScore: increaseBy2 }).then(function() {console.log("session current score increased by 2");
}).catch(function(error) {console.error("Error updating currentScore: ", error);});  
   
db.collection('players').doc(playerPicked).update({ score: increaseBy2 }).then(function() {console.log("player score increased by 2");
}).catch(function(error) {console.error("Error updating player Score: ", error);});    
    
  }

  else {
//add to score of current team in current round  
       if (currentRound == 1){ 
db.collection('teams').doc(teamPicked).update({ r1Score: increaseBy, totalScore: increaseBy }).then(function() {console.log("r1Score increased");
}).catch(function(error) {console.error("Error updating r1Score: ", error);});
} else if (currentRound == 2) {
db.collection('teams').doc(teamPicked).update({ r2Score: increaseBy, totalScore: increaseBy }).then(function() {console.log("r2Score increased");
}).catch(function(error) {console.error("Error updating r2Score: ", error);});  
} else {
db.collection('teams').doc(teamPicked).update({ r3Score: increaseBy, totalScore: increaseBy }).then(function() {console.log("r3Score increased");
}).catch(function(error) {console.error("Error updating r3Score: ", error);});  
};  

db.collection('sessions').doc(sessionPicked).update({ currentScore: increaseBy }).then(function() {console.log("session current score increased");
}).catch(function(error) {console.error("Error updating currentScore: ", error);});  
  
db.collection('players').doc(playerPicked).update({ score: increaseBy }).then(function() {console.log("player score increased");
}).catch(function(error) {console.error("Error updating player Score: ", error);});    
  
}
    
console.log("Round names guessed: "+namesGotThisRound);
console.log("Name guessed: "+namesRemoved); 
};

var nextWord = (function() {
   return function() {
   return bagNames[++count % bagNames.length];
  }
}());




function endRound(){
  //update last round score
  $('li').filter(function(){return $.trim($(this).html()) == '';}).show()
  $('li').filter(function(){return $.trim($(this).html()) == 'undefined';}).show()
  
  if (jokerActive == true) {
  roundScore = namesGotThisRound.length*2;
  console.log(roundScore);
    db.collection('teams').doc(teamPicked).update({ lastRoundScore: roundScore, jokerAvailable: false }).then(function() {
      console.log("lastRoundScore updated to "+roundScore);
      console.log("Joker used")
    }).catch(function(error) {console.error("Error updating lastRoundScore: ", error);});  
    
  }
  
  else {  
  roundScore = namesGotThisRound.length;
  console.log(roundScore);
    db.collection('teams').doc(teamPicked).update({ lastRoundScore: roundScore }).then(function() {console.log("lastRoundScore updated to "+roundScore);
    }).catch(function(error) {console.error("Error updating lastRoundScore: ", error);});  
      
  }
  

var  newAvgScore = roundScore / playerTurns
  
    db.collection('players').doc(playerPicked).update({ avgScore: newAvgScore}).then(function() {console.log("player Avg score adjusted");
}).catch(function(error) {console.error("Error updating player Score: ", error);});   
  
//show end round splash page
  if (roundScore == 0) {
 document.getElementById('endRoundScore').innerHTML = "You got 0 points! I'd blame your team if I were you..." 
}  else if (roundScore == 1)
      document.getElementById('endRoundScore').innerHTML = "You scored 1 point! Not bad...!"
  else {
      document.getElementById('endRoundScore').innerHTML = "You scored "+roundScore+" points, well done!" 
    }
  
console.log("Names got this round: "+namesGotThisRound)

document.getElementById('nameGuessed1').innerHTML = namesGotThisRound[0];
document.getElementById('nameGuessed2').innerHTML = namesGotThisRound[1];
document.getElementById('nameGuessed3').innerHTML = namesGotThisRound[2];
document.getElementById('nameGuessed4').innerHTML = namesGotThisRound[3];
document.getElementById('nameGuessed5').innerHTML = namesGotThisRound[4];
document.getElementById('nameGuessed6').innerHTML = namesGotThisRound[5];
document.getElementById('nameGuessed7').innerHTML = namesGotThisRound[6];
document.getElementById('nameGuessed8').innerHTML = namesGotThisRound[7];
document.getElementById('nameGuessed9').innerHTML = namesGotThisRound[8];
document.getElementById('nameGuessed10').innerHTML = namesGotThisRound[9];
document.getElementById('nameGuessed11').innerHTML = namesGotThisRound[10];
document.getElementById('nameGuessed12').innerHTML = namesGotThisRound[11];
document.getElementById('nameGuessed13').innerHTML = namesGotThisRound[12];
document.getElementById('nameGuessed14').innerHTML = namesGotThisRound[13];
  
$('li').filter(function(){return $.trim($(this).html()) == 'undefined';}).hide()
$('li').filter(function(){return $.trim($(this).html()) == '';}).hide()  
  
document.getElementById("roundEnd-splash").style.display = "block" ;
document.getElementById("gameStart").style.display = "none" ;

updateScores();
document.getElementById("scoreboard").style.display = "block" ;
  
enableNavBarButtons();

};

function endRoundWithTimeLeft(){
      //what to do here when there aren't any names left but still time left
      //increment session round
      if (currentRound == 3) {
      document.getElementById('endRoundMessage').innerHTML = "<h5>Game over!</h5><hr><p>That's it, no names left in this final round. Let's tally up the scores and find our winner!</p><hr>"
        playerTurns = playerTurns + 1
  console.log(playerTurns)
  
  db.collection('players').doc(playerPicked).update({ turns: increaseBy }).then(function() {console.log("player score increased");
}).catch(function(error) {console.error("Error updating player Score: ", error);});    
        
      } else {
      document.getElementById('endRoundMessage').innerHTML = "<h5>End of the round!</h5><hr><p> That's it, no names left for this round but it's still your go! Let's tally up the scores, then you go again with the time you had left!</p><hr>"  
      };  
  
      db.collection('sessions').doc(sessionPicked).update({ turnActive: false, currentRound: increaseBy, roundTime: timeLeftOver  }).then(function() {console.log("round end: Session round increased");
      }).catch(function(error) {console.error("Error updating r1Score: ", error);});

      db.collection('turns-active').doc(sessionPicked).update({ turnActive: false, currentRound: increaseBy}).then(function() {console.log("round end: turns-active Session round increased");
      }).catch(function(error) {console.error("Error updating r1Score: ", error);});
  
      endRound();  
      
      };


function endRoundWithNamesLeft(){
    //typical end of turn with names left
    //get default time and push to roundTime
    document.getElementById('endRoundMessage').innerHTML = "<h5>Time's up!</h5><hr>"
  playerTurns = playerTurns + 1
  db.collection('players').doc(playerPicked).update({ turns: increaseBy}).then(function() {console.log("player score increased");
}).catch(function(error) {console.error("Error updating player Score: ", error);});    
  
     db.collection("sessions").doc(sessionPicked).get().then(function(doc) {
        if (doc.exists) { roundTime = doc.data().roundTimeDefault;
                         console.log("Round time: "+roundTime);
                         
                        db.collection('sessions').doc(sessionPicked).update({ turnActive: false, roundTime: roundTime }).then(function() {console.log("round end: Session round increased");
                        }).catch(function(error) {console.error("Error updating roundTime: ", error);}); 
                         
                        db.collection('turns-active').doc(sessionPicked).update({ turnActive: false}).then(function() {console.log("round end: turns-active Session round increased");
                        }).catch(function(error) {console.error("Error updating r1Score: ", error);});
                         
        } else {console.log("No such document!");
      };
    });
  
       var nextPlayer  
       var nextGamePlayer 
       var nextTeam 
       var nextTeamName
    //get current session details -> total # players, current order number
     db.collection("teams").doc(teamPicked).get().then(function(doc) {
    if (doc.exists) { var currentPlayerNumber = doc.data().tpNumber;
                      var totalPlayers = doc.data().teamSize 
                      
                    if (totalPlayers == currentPlayerNumber) {    
                       db.collection('teams').doc(teamPicked).update({ tpNumber: 1 }).then(function() {console.log("Team player back to 1");
                      }).catch(function(error) {console.error("Error updating currentPlayerNumber back to 1: ", error);});  
                      
                      nextPlayer = doc.data().p01
                      
                      
                    } else {
        
                         if (currentPlayerNumber+1 == 2) { nextPlayer = doc.data().p02
                         } else if (currentPlayerNumber+1 == 3) { nextPlayer = doc.data().p03
                         } else if (currentPlayerNumber+1 == 4) { nextPlayer = doc.data().p04
                         } else if (currentPlayerNumber+1 == 5) { nextPlayer = doc.data().p05
                         } else if (currentPlayerNumber+1 == 6) { nextPlayer = doc.data().p06
                         } else if (currentPlayerNumber+1 == 7) { nextPlayer = doc.data().p07
                         } else if (currentPlayerNumber+1 == 8) { nextPlayer = doc.data().p08
                         } else if (currentPlayerNumber+1 == 9) { nextPlayer = doc.data().p09                                   
                         } else if (currentPlayerNumber+1 == 10) { nextPlayer = doc.data().p10          
                         }                                                         
                      db.collection('teams').doc(teamPicked).update({tpNumber: increaseBy }).then(function() {console.log("team player number increased");
                      }).catch(function(error) {console.error("Error updating currentPlayerNumber: ", error);});  
                    }          
                     
                     
                     db.collection('teams').doc(teamPicked).update({ currentPlayer: nextPlayer }).then(function() {
                    
                          
                        if (teamPicked == activeTeamOne) { 
                                   nextTeam = activeTeamTwo
                                   nextTeamName = activeTeamTwoName
                       } else if (teamPicked == activeTeamTwo && activeTeams.length == 2) { 
                                   nextTeam = activeTeamOne
                                    nextTeamName = activeTeamOneName
                        } else if (teamPicked == activeTeamTwo) { 
                                   nextTeam = activeTeamThree
                                   nextTeamName = activeTeamThreeName
                        } else if (teamPicked == activeTeamThree && activeTeams.length == 3) { 
                                   nextTeam = activeTeamOne
                                   nextTeamName = activeTeamOneName
                        } else if (teamPicked == activeTeamThree) { 
                                   nextTeam = activeTeamFour
                                   nextTeamName = activeTeamFourName
                        }  else if (teamPicked == activeTeamFour) { 
                              nextTeam = activeTeamOne   
                             nextTeamName = activeTeamOneName
                        }
                   
                    db.collection("teams").doc(nextTeam).get().then(function(doc) {
                       nextGamePlayer = doc.data().currentPlayer 

                        db.collection('sessions').doc(sessionPicked).update({ currentTeam: nextTeam, currentTeamName: nextTeamName, currentPlayer: nextGamePlayer }).then(function() {console.log("Session player number increased");
                        }).catch(function(error) {console.error("Error updating currentPlayerNumber: ", error)});
                      
                        db.collection('turns-active').doc(sessionPicked).update({ currentTeam: nextTeam, currentTeamName: nextTeamName, currentPlayer: nextGamePlayer}).then(function() {console.log("turns-active session player number increased");
                        }).catch(function(error) {console.error("Error updating r1Score: ", error);});
                      
                      });
                    })
                    
                       
                    } else {console.log("No such document!");}
       }).catch(function(error) {console.log("Error getting document:", error);});
                    
      endRound();  
  
  jokerActive = false;
  jokerAvailable = false;
    };

//***********************
// Game details buttons
//***********************

function showTeamScreen() {
showSection(teamsScreen, menuTeams)
};

function showScoresScreen() {
  showSection(scoresScreen, menuScores)
  document.getElementById('scoreboard').style.display =  'block';   
  updateScores();
}


// Game details back buttons
function backToGameDetailsScreen() {
  showSection(homeScreen, menuHome)
 };

//*********************
//Live round screen
//*********************

/* LIVE SCREEN DISABLED
function showRoundScreen() {
  showSection(roundScreen, menuRound)
  liveRoundData();

}


function liveRoundData() {

var unsubscribe =  db.collection("sessions").doc(sessionPicked)
    .onSnapshot(function(doc) {
      
      listenCheckEntered = true
      console.log("LiveRound Snapshot called")
      
      //get how long is left in round
      timeRoundEnd = doc.data().timeRoundEnd
      var timeNow = Date.now() 
      var msLeft = timeRoundEnd - timeNow
      var timeLeft = msLeft / 1000
      console.log(timeLeft) 
      
      var display = document.querySelector('#liveShowTime');
     // liveTimer(timeLeft,display)
      
     if (doc.data().turnActive == true){
       //Round active 
       if (doc.data().currentScore == 0) {
          document.getElementById('roundScoreNow').innerHTML = "No points scored yet";     
        } else if (doc.data().currentScore == 1) {
          document.getElementById('roundScoreNow').innerHTML =  doc.data().currentScore+" point this round";     
        } else {
          document.getElementById('roundScoreNow').innerHTML =  doc.data().currentScore+" points this round";     
        }
          document.getElementById('turnStatus').style.display =  'none';      
          document.getElementById('turnInProgress').style.display =  'block';   
          document.getElementById('turnInProgressNameScore').style.display =  'block';  
          document.getElementById('roundPlayer').innerHTML =  doc.data().currentPlayer;     
          document.getElementById('roundTeam').innerHTML =  doc.data().currentTeamName;
          document.getElementById('lastNameGuessed').innerHTML = "Guessed: "+doc.data().lastNameGuessed;           
          document.getElementById('roundNextPlayer').innerHTML =  "";     
          document.getElementById('roundNextTeam').innerHTML =  ""; 
     } else {
       // No round active
         document.getElementById('turnStatus').style.display =  'block';      
         document.getElementById('turnInProgress').style.display =  'none';   
         document.getElementById('turnInProgressNameScore').style.display =  'none'; 
         document.getElementById('roundNextPlayer').innerHTML =  "Next player: "+doc.data().currentPlayer;     
         document.getElementById('roundNextTeam').innerHTML =  "Next team: "+doc.data().currentTeamName;      
     }
    });
}

function liveTimer(duration, display) {
  
var timer = duration, minutes, seconds;
var tickTock = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
 
        display.textContent = seconds;  
    
    if (timer==0){
      document.getElementById('countdownClockMP3').play()
      clearInterval(tickTock)

      } else if (bagNames.length == 0) {  
          // Detect that the round is up, pause timer       
        
      } else {
          --timer 
         roundProgress = ((roundTime-timer)/roundTime)*100
         document.getElementById("roundProgressBar").setAttribute("style","width: "+roundProgress+"%")
    }   
  }, 1000);
  console.log(timer)
};
*/
//************************
//Scores screen function
//************************
var teamScores= []      
var orderedTeamIDs = []   
var orderedTeamNames = []  

function endTeamScores(){
  
  db.collection("teams").where("sessionName", "==", sessionPicked).orderBy("totalScore","desc").get().then(function(querySnapshot){
     
  teamScores= []      
  orderedTeamIDs = []   
  orderedTeamNames = []   
  
    querySnapshot.forEach(function(doc) {
          var teamID = doc.id
          var teamName = doc.data().teamName
          var teamScore = doc.data().totalScore
          orderedTeamIDs.push(teamID)
          orderedTeamNames.push(teamName)
          teamScores.push(teamScore)
        });

    var winningMargin = teamScores[0] - teamScores[1]
    var rankTeam = orderedTeamIDs.indexOf(teamPicked)    
    
    // Determine if there is an outright winner
    if (teamScores[0] > teamScores[1]){
      
      document.getElementById("winningTeam").innerHTML = orderedTeamNames[0]+ " won with "+teamScores[0]+" points!"
      
      // Determine if my team won
      if (rankTeam== 0) {
        document.getElementById("winningSubText").innerHTML = "Congratulations! You won by "+winningMargin 
        confetti.style.display="block"
        var animConfetti = bodymovin.loadAnimation({
            wrapper: confetti,
            animType: 'svg',
            loop: true,
            path: 'https://assets9.lottiefiles.com/temp/lf20_sTumYD.json'
          });        
        
      } else if (rankTeam == 1) {
        document.getElementById("winningSubText").innerHTML = "You came 2nd with "+teamScores[1]+" points"
      } else if (rankTeam == 2) {
        document.getElementById("winningSubText").innerHTML = "You came 3rd with "+teamScores[2]+" points"
      } else if (rankTeam == 3) {
        document.getElementById("winningSubText").innerHTML = "You came 4th with "+teamScores[3]+" points" 
      } 

    } else {
      
     // if it's a tie, work out a tie between how many teams 
      if (teamScores[0] == teamScores[1] && teamScores[0] == teamScores[2] && teamScores[0] == teamScores[3]) {
        document.getElementById("winningTeam").innerHTML = "It's a 4 way tie!"
        document.getElementById("winningSubText").innerHTML = "Everyone's a winner... sort of" 
      } else if (teamScores[0] == teamScores[1] && teamScores[0] == teamScores[2]) {
        document.getElementById("winningTeam").innerHTML = "It's a 3 way tie!"
        document.getElementById("winningSubText").innerHTML = "Everyone's a winner... sort of" 
      } else {
        document.getElementById("winningTeam").innerHTML = orderedTeamNames[0]+" and "+orderedTeamNames[1]+" tied with "+teamScores[0]+" points!"
          if (rankTeam == 0 || rankTeam == 1) {
          document.getElementById("winningSubText").innerHTML = "Everyone's a winner... sort of" 
          } else if (rankTeam == 2) {
          document.getElementById("winningSubText").innerHTML = "You came 3rd with "+teamScores[2]+" points"
          } else if (rankTeam == 3) {
          document.getElementById("winningSubText").innerHTML = "You came 4th with "+teamScores[3]+" points"    
          }
        }
      }
    
    mVP();
    
  })
}


function updateScores1(){
/* Show teams in list order desc
  
  mVP();
  
  db.collection("teams").where("sessionName", "==", sessionPicked).orderBy("totalScore","desc")
    .onSnapshot(function(querySnapshot) {
    var teamScores= []      
    var teams = []
    querySnapshot.forEach(function(doc) {
          var tName = doc.data().teamName
          var tScore = doc.data().totalScore
          teams.push(tName)
          teamScores.push(tScore)
        });
    // first place
       document.getElementById("scoreGridTeamOne").innerHTML = teams[0] 
    if(typeof teamScores[0] !== "undefined"){
       document.getElementById("scoreGridTeamOneScore").innerHTML = teamScores[0] ;          
       }
    // second place
       document.getElementById("scoreGridTeamTwo").innerHTML = teams[1] 
    if(typeof teamScores[1] !== "undefined"){
       document.getElementById("scoreGridTeamTwoScore").innerHTML = teamScores[1] ;          
       }
   
    if (teams.length == 3){ 
            // Third place
             document.getElementById("scoreGridTeamThree").innerHTML = teams[2] 
            if(typeof teamScores[2] !== "undefined"){
             document.getElementById("scoreGridTeamThreeScore").innerHTML = teamScores[2] ;          
             }
       document.getElementById("gridThree" ).style.display = "block"; 
        }
    
    if (teams.length == 4){
             // Third place
             document.getElementById("scoreGridTeamThree").innerHTML = teams[2] 
            if(typeof teamScores[2] !== "undefined"){
             document.getElementById("scoreGridTeamThreeScore").innerHTML = teamScores[2] ;          
             }
            // Fourth place
             document.getElementById("scoreGridTeamFour").innerHTML = teams[4] 
             if(typeof teamScores[3] !== "undefined"){
             document.getElementById("scoreGridTeamFourScore").innerHTML = teamScores[1] ;          
             }
      document.getElementById("gridThree" ).style.display = "block";
      document.getElementById("gridFour" ).style.display = "block";
          
    }
  })*/
}

function updateScores(){
mVP();
  

//Team One Scores 
db.collection("teams").doc(activeTeamOne).get().then(function(doc) {if (doc.exists) { 
        t1r1Score = doc.data().r1Score; 
        t1r2Score = doc.data().r2Score;
        t1r3Score = doc.data().r3Score;
        t1TotalScore = doc.data().totalScore;   
        if(typeof t1TotalScore !== "undefined"){
              document.getElementById("scoreGridTeamOneScore").innerHTML = t1TotalScore; 
          }
        document.getElementById("scoreGridTeamOne").innerHTML = activeTeamOneName
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

//Team Two Scores 
db.collection("teams").doc(activeTeamTwo).get().then(function(doc) {if (doc.exists) { 
        t2r1Score = doc.data().r1Score; 
        t2r2Score = doc.data().r2Score;
        t2r3Score = doc.data().r3Score;
        t2TotalScore = doc.data().totalScore;
        if(typeof t2TotalScore !== "undefined"){
        document.getElementById("scoreGridTeamTwoScore").innerHTML = t2TotalScore; 
        }
        document.getElementById("scoreGridTeamTwo").innerHTML = activeTeamTwoName 
  
        if(activeTeams.length == 2){initializeScoreChart2();}
  
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);});  
  
  if (activeTeams.length == 3) {    
      //Team Three Scores 
        db.collection("teams").doc(activeTeamThree).get().then(function(doc) 
              {if (doc.exists) { 
              t3r1Score = doc.data().r1Score; 
              t3r2Score = doc.data().r2Score;
              t3r3Score = doc.data().r3Score;
              t3TotalScore = doc.data().totalScore;
               
              document.getElementById("scoreGridTeamThree").innerHTML = activeTeamThreeName
              if(typeof t3TotalScore !== "undefined"){
              document.getElementById("scoreGridTeamThreeScore").innerHTML = t3TotalScore;
              }
              document.getElementById("gridThree" ).style.display = "block"; 
              initializeScoreChart3();
             } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
      document.getElementById("gridThree" ).style.display = "block"; 
  } else if (activeTeams.length == 4) {
      //Team Three Scores 
        db.collection("teams").doc(activeTeamThree).get().then(function(doc) 
              {if (doc.exists) { 
              t3r1Score = doc.data().r1Score; 
              t3r2Score = doc.data().r2Score;
              t3r3Score = doc.data().r3Score;
              t3TotalScore = doc.data().totalScore;
                if(typeof t3TotalScore !== "undefined"){
              document.getElementById("scoreGridTeamThree").innerHTML = activeTeamThreeName
                }
              document.getElementById("scoreGridTeamThreeScore").innerHTML = t3TotalScore;
              document.getElementById("gridThree" ).style.display = "block"; 
             } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
            document.getElementById("gridThree" ).style.display = "block"; 
        //Team Four Scores 
            db.collection("teams").doc(activeTeamFour).get().then(function(doc) {if (doc.exists) { 
              t4r1Score = doc.data().r1Score; 
              t4r2Score = doc.data().r2Score;
              t4r3Score = doc.data().r3Score;
              t4TotalScore = doc.data().totalScore;
              document.getElementById("scoreGridTeamFour").innerHTML = activeTeamFourName
              if(typeof t4TotalScore !== "undefined"){
              document.getElementById("scoreGridTeamFourScore").innerHTML = t4TotalScore; 
                  }
              document.getElementById("gridFour" ).style.display = "block"; 
              initializeScoreChart4();
             } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
      document.getElementById("gridFour" ).style.display = "block";
  } //else { initializeScoreChart2();}
  
};

function initializeScoreChart2 () {
  
  var largestScore = Math.max(t1TotalScore, t2TotalScore, t3TotalScore,t4TotalScore);

  if (largestScore > 49) {
    yAxisInterval = 5
  } else if (largestScore > 34) {
     yAxisInterval = 4
  } else if (largestScore > 19) {
     yAxisInterval = 3
  } else if (largestScore > 9) {
     yAxisInterval = 2
  } else {
   yAxisInterval = 1 
  }
  
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title:{text: "", fontFamily: "Segoe UI", fontColor: "Teal",backgroundColor: "grey-100"},
    axisX: {interval: 1,intervalType: "Teams",},
    axisY:{valueFormatString:"#0",gridColor: "d3d3d3",tickColor: "#B6B1A8",interval: yAxisInterval},
    data: 
    //round 1
    [{ type: "stackedColumn", showInLegend: true, color: "#00796b", name: "Round 1",
        dataPoints: [
        { y: t1r1Score, x: 1, label: activeTeamOneName},
        { y: t2r1Score, x: 2, label:activeTeamTwoName}
        ]},
      { //round 2
        type: "stackedColumn",showInLegend: true,	name: "Round 2",color: "#26a69a",
        dataPoints: [
        { y: t1r2Score, x: 1, label: activeTeamOneName},
        { y: t2r2Score, x: 2, label: activeTeamTwoName}
        ]},
      {  //round 3
        type: "stackedColumn", showInLegend: true, name: "Round 3",	color: "#b2dfdb",
        dataPoints: [
        { y: t1r3Score, x: 1, label: activeTeamOneName},
        { y: t2r3Score, x: 2, label: activeTeamTwoName}
        ]}
    ]});
  chart.render();

  function toolTipContent(e) {
    var str = "";
    var total = 0;
    var str2, str3;
    for (var i = 0; i < e.entries.length; i++){
      var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: $<strong>"+e.entries[i].dataPoint.y+"</strong>bn<br/>";
      total = e.entries[i].dataPoint.y + total;
      str = str.concat(str1);
    }
    str2 = "<span style = \"color:DodgerBlue;\"><strong>"+(e.entries[0].dataPoint.x).getFullYear()+"</strong></span><br/>";
    total = Math.round(total * 100) / 100;
    str3 = "<span style = \"color:Tomato\">Total:</span><strong> $"+total+"</strong>bn<br/>";
    return (str2.concat(str)).concat(str3);
  }
}

function initializeScoreChart3 () {
  var largestScore = Math.max(t1TotalScore, t2TotalScore, t3TotalScore,t4TotalScore);

  if (largestScore > 49) {
    yAxisInterval = 5
  } else if (largestScore > 34) {
     yAxisInterval = 4
  } else if (largestScore > 19) {
     yAxisInterval = 3
  } else if (largestScore > 9) {
     yAxisInterval = 2
  } else {
   yAxisInterval = 1 
  }
  
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title:{text: "", fontFamily: "Segoe UI", fontColor: "Teal",backgroundColor: "grey-100"},
    axisX: {interval: 1,intervalType: "Teams",},
    axisY:{valueFormatString:"#0",gridColor: "d3d3d3",tickColor: "#B6B1A8",interval: yAxisInterval},
    data: 
    //round 1
    [{ type: "stackedColumn", showInLegend: true, color: "#00796b", name: "Round 1",
        dataPoints: [
        { y: t1r1Score, x: 1, label: activeTeamOneName},
        { y: t2r1Score, x: 2, label:activeTeamTwoName},
        { y: t3r1Score, x: 3, label:activeTeamThreeName}
        ]},
      { //round 2
        type: "stackedColumn",showInLegend: true,	name: "Round 2",color: "#26a69a",
        dataPoints: [
        { y: t1r2Score, x: 1, label: activeTeamOneName},
        { y: t2r2Score, x: 2, label: activeTeamTwoName},
        { y: t3r2Score, x: 3, label: activeTeamThreeName}
        ]},
      {  //round 3
        type: "stackedColumn", showInLegend: true, name: "Round 3",	color: "#b2dfdb",
        dataPoints: [
        { y: t1r3Score, x: 1, label: activeTeamOneName},
        { y: t2r3Score, x: 2, label: activeTeamTwoName},
        { y: t3r3Score, x: 3, label: activeTeamThreeName}
        ]}
    ]});
  
  chart.render();

  function toolTipContent(e) {
    var str = "";
    var total = 0;
    var str2, str3;
    for (var i = 0; i < e.entries.length; i++){
      var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: $<strong>"+e.entries[i].dataPoint.y+"</strong>bn<br/>";
      total = e.entries[i].dataPoint.y + total;
      str = str.concat(str1);
    }
    str2 = "<span style = \"color:DodgerBlue;\"><strong>"+(e.entries[0].dataPoint.x).getFullYear()+"</strong></span><br/>";
    total = Math.round(total * 100) / 100;
    str3 = "<span style = \"color:Tomato\">Total:</span><strong> $"+total+"</strong>bn<br/>";
    return (str2.concat(str)).concat(str3);
  }
}



function initializeScoreChart4 () {

var largestScore = Math.max(t1TotalScore, t2TotalScore, t3TotalScore,t4TotalScore);

  if (largestScore > 49) {
    yAxisInterval = 5
  } else if (largestScore > 34) {
     yAxisInterval = 4
  } else if (largestScore > 19) {
     yAxisInterval = 3
  } else if (largestScore > 9) {
     yAxisInterval = 2
  } else {
   yAxisInterval = 1 
  }
  
  
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title:{text: "", fontFamily: "Segoe UI", fontColor: "Teal",backgroundColor: "grey-100"},
    axisX: {interval: 1,intervalType: "Teams",},
    axisY:{valueFormatString:"#0",gridColor: "d3d3d3",tickColor: "#B6B1A8",interval: yAxisInterval},
    data: 
    //round 1
    [{ type: "stackedColumn", showInLegend: true, color: "#00796b", name: "Round 1",
        dataPoints: [
        { y: t1r1Score, x: 1, label: activeTeamOneName},
        { y: t2r1Score, x: 2, label:activeTeamTwoName},
        { y: t3r1Score, x: 3, label:activeTeamThreeName},
        { y: t4r1Score, x: 4, label:activeTeamFourName}
        ]},
      { //round 2
        type: "stackedColumn",showInLegend: true,	name: "Round 2",color: "#26a69a",
        dataPoints: [
        { y: t1r2Score, x: 1, label: activeTeamOneName},
        { y: t2r2Score, x: 2, label: activeTeamTwoName},
        { y: t3r2Score, x: 3, label: activeTeamThreeName},
        { y: t4r2Score, x: 4, label: activeTeamFourName}
        ]},
      {  //round 3
        type: "stackedColumn", showInLegend: true, name: "Round 3",	color: "#b2dfdb",
        dataPoints: [
        { y: t1r3Score, x: 1, label: activeTeamOneName},
        { y: t2r3Score, x: 2, label: activeTeamTwoName},
        { y: t3r3Score, x: 3, label: activeTeamThreeName},
        { y: t4r3Score, x: 4, label: activeTeamFourName}
        ]}
    ]});
  
  chart.render();

  function toolTipContent(e) {
    var str = "";
    var total = 0;
    var str2, str3;
    for (var i = 0; i < e.entries.length; i++){
      var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: $<strong>"+e.entries[i].dataPoint.y+"</strong>bn<br/>";
      total = e.entries[i].dataPoint.y + total;
      str = str.concat(str1);
    }
    str2 = "<span style = \"color:DodgerBlue;\"><strong>"+(e.entries[0].dataPoint.x).getFullYear()+"</strong></span><br/>";
    total = Math.round(total * 100) / 100;
    str3 = "<span style = \"color:Tomato\">Total:</span><strong> $"+total+"</strong>bn<br/>";
    return (str2.concat(str)).concat(str3);
  }
}



function disableNavBarButtons() {
document.getElementById('appNavBar').style.display = "none"
menuHome.style.display = "none"
menuStart.style.display = "none"
 //HIDE ROUND SCREEN  menuRound.style.display = "none"
menuScores.style.display = "none"  
menuTeams.style.display = "none"
menuRefresh.style.display = "none"  
}

function enableNavBarButtons() {
document.getElementById('appNavBar').style.display = "flex"
menuHome.style.display = "block"
 //HIDE ROUND SCREEN  menuRound.style.display = "block"
menuScores.style.display = "block"  
menuTeams.style.display = "block"  
menuRefresh.style.display = "block"  
}

/*
function gameOverMessage (){
var t1Score
var t2Score
var t3Score
var t4Score
var winnerTeam
var secondTeam
var thirdTeam
var fourthTeam
var scoresObj = {}

db.collection("teams").doc(activeTeamOne).get().then(function(doc) {if (doc.exists) { 
   scoresObj.teamOne= doc.data().totalScore;       
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
  
db.collection("teams").doc(activeTeamTwo).get().then(function(doc) {if (doc.exists) { 
    scoresObj.teamTwo = doc.data().totalScore;       
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 

if (activeTeams.length > 2) {
db.collection("teams").doc(activeTeamThree).get().then(function(doc) {if (doc.exists) { 
   scoresObj.teamThree = doc.data().totalScore;        
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);});
  }
if (activeTeams.length > 3) {
db.collection("teams").doc(activeTeamFour).get().then(function(doc) {if (doc.exists) { 
   scoresObj.teamFour = doc.data().totalScore;    
     } else {console.log("No such document!");}}).catch(function(error) {console.log("Error getting document:", error);}); 
  }  
  if (winnerTeam == teamPicked){
  document.getElementById('winners').innerHTML = "You won! Congratulations!"
  } else if (secondTeam == teamPicked)  {
   document.getElementById('winners').innerHTML = winnerTeam+" won! Send them your congratulations.<br>You came 2nd, so close!"
  } else if (thirdTeam == teamPicked)  {
   document.getElementById('winners').innerHTML = winnerTeam+" won! Send them your congratulations.<br>You came 3rd, podium finish!"
  } else {
   document.getElementById('winners').innerHTML = winnerTeam+" won! Send them your congratulations.<br>Better luck next time"
  }
    
}*/

    
        
function mVP(){

var unsubscribe =  db.collection("players").where("sessionName", "==", sessionPicked).orderBy("score","desc")
    .onSnapshot(function(querySnapshot) {
    
    listenMVP = true
    console.log("MVP Snapshot called")
    
    playerScores= []      
    orderedPlayerNames = []   
    querySnapshot.forEach(function(doc) {
          playerName = doc.id
          playerScore = doc.data().score
          playerTurns = doc.data().turns
          avgScore = Math.round( (playerScore / playerTurns) * 10 ) / 10
          orderedPlayerNames.push(playerName)
          playerScores.push(avgScore)
        });

    document.getElementById('myScores').style.display = "none" 
    document.getElementById('myScore').innerHTML = ""
    document.getElementById('myRank').innerHTML = ""
    
    // Show or hide the MVP / My Score section
     if (playerScores[rank] == 0 && playerScores[0] == playerScores[1]) {
    document.getElementById('scoresPerTurn').style.display = "none"
    } else  {
    document.getElementById('scoresPerTurn').style.display = "block"
    }
    
    // Only show MVP if there is a clear MVP
    if (playerScores[0]>playerScores[1]){
      document.getElementById('mVP').innerHTML = orderedPlayerNames[0]
      document.getElementById('endMVP').innerHTML = "The MVP was "+orderedPlayerNames[0] + " with "+playerScores[0]+" points per turn"
      document.getElementById('mVPScore').innerHTML = playerScores[0]+"/turn"
      document.getElementById('MVP').style.display = "flex"
      console.log("MVP: "+orderedPlayerNames[0]+ " "+playerScores[0]+" per turn")   
   }
    
    var rank = orderedPlayerNames.indexOf(playerPicked)
      
    // Show my rank
    if(rank == 0) {
      document.getElementById('myRank').innerHTML = "1st!"
      document.getElementById('endMyScore').innerHTML = "Congratulations champ!"
    } else if (rank == 1) {
      document.getElementById('myRank').innerHTML = "2nd"
      document.getElementById('endMyScore').innerHTML = "You were the 2nd most valuable player with "+playerScores[1]+" points per turn"
    } else if (rank == 2) {
      document.getElementById('myRank').innerHTML = "3rd"
      document.getElementById('endMyScore').innerHTML = "You were the 3rd most valuable player with "+playerScores[2]+" points per turn"
    } else if (rank > 2) {
      document.getElementById('myRank').innerHTML = rank+1+"th"
      document.getElementById('endMyScore').innerHTML = "You scored "+playerScores[rank]+" points per turn"
    } 
    
       // Only show myScore if it is greater than 0
    if (playerScores[rank] > 0) {
    document.getElementById('myScore').innerHTML = playerScores[rank]+"/turn"     
    document.getElementById('myScores').style.display = "flex"
    } 
    
  })
}

function endGame() {
    console.log("Deactivating session");
         fireworks.style.display="none"
         confetti.style.display="none"
  db.collection("sessions").doc(sessionPicked).update({active: false}).then(function() {
    console.log("Session deactivated");
    alert("Session Ended")
    bmLogOut();
}).catch(function(error) {console.error("Error deactivating session: ", error);});  

}


/*! NoSleep.min.js v0.9.0 - git.io/vfn01 - Rich Tibbett - MIT license */
!function(A,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.NoSleep=e():A.NoSleep=e()}("undefined"!=typeof self?self:this,function(){return function(A){function e(B){if(o[B])return o[B].exports;var Q=o[B]={i:B,l:!1,exports:{}};return A[B].call(Q.exports,Q,Q.exports,e),Q.l=!0,Q.exports}var o={};return e.m=A,e.c=o,e.d=function(A,o,B){e.o(A,o)||Object.defineProperty(A,o,{configurable:!1,enumerable:!0,get:B})},e.n=function(A){var o=A&&A.__esModule?function(){return A.default}:function(){return A};return e.d(o,"a",o),o},e.o=function(A,e){return Object.prototype.hasOwnProperty.call(A,e)},e.p="",e(e.s=0)}([function(A,e,o){"use strict";function B(A,e){if(!(A instanceof e))throw new TypeError("Cannot call a class as a function")}var Q=function(){function A(A,e){for(var o=0;o<e.length;o++){var B=e[o];B.enumerable=B.enumerable||!1,B.configurable=!0,"value"in B&&(B.writable=!0),Object.defineProperty(A,B.key,B)}}return function(e,o,B){return o&&A(e.prototype,o),B&&A(e,B),e}}(),t=o(1),n=t.webm,c=t.mp4,E="undefined"!=typeof navigator&&parseFloat((""+(/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)||[0,""])[1]).replace("undefined","3_2").replace("_",".").replace("_",""))<10&&!window.MSStream,l=function(){function A(){var e=this;B(this,A),E?this.noSleepTimer=null:(this.noSleepVideo=document.createElement("video"),this.noSleepVideo.setAttribute("muted",""),this.noSleepVideo.setAttribute("title","No Sleep"),this.noSleepVideo.setAttribute("playsinline",""),this._addSourceToVideo(this.noSleepVideo,"webm",n),this._addSourceToVideo(this.noSleepVideo,"mp4",c),this.noSleepVideo.addEventListener("loadedmetadata",function(){e.noSleepVideo.duration<=1?e.noSleepVideo.setAttribute("loop",""):e.noSleepVideo.addEventListener("timeupdate",function(){e.noSleepVideo.currentTime>.5&&(e.noSleepVideo.currentTime=Math.random())})}))}return Q(A,[{key:"_addSourceToVideo",value:function(A,e,o){var B=document.createElement("source");B.src=o,B.type="video/"+e,A.appendChild(B)}},{key:"enable",value:function(){E?(this.disable(),console.warn("\n        NoSleep enabled for older iOS devices. This can interrupt\n        active or long-running network requests from completing successfully.\n        See https://github.com/richtr/NoSleep.js/issues/15 for more details.\n      "),this.noSleepTimer=window.setInterval(function(){document.hidden||(window.location.href=window.location.href.split("#")[0],window.setTimeout(window.stop,0))},15e3)):this.noSleepVideo.play()}},{key:"disable",value:function(){E?this.noSleepTimer&&(console.warn("\n          NoSleep now disabled for older iOS devices.\n        "),window.clearInterval(this.noSleepTimer),this.noSleepTimer=null):this.noSleepVideo.pause()}}]),A}();A.exports=l},function(A,e,o){"use strict";A.exports={webm:"data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",mp4:"data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA="}}])});

var noSleep = new NoSleep();
var wakeLockEnabled = false;
var toggleEl = document.querySelector("#join-button");
    
toggleEl.addEventListener('click', function() {
          if (!wakeLockEnabled) {
          noSleep.enable(); // keep the screen on!
          wakeLockEnabled = true;
          console.log("No Sleep Enabled")
        } 
}, false);