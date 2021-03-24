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

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

sessionPicked=urlParams["id"]
liveRoundData();

function liveRoundData() {

    var unsubscribe =  db.collection("sessions").doc(sessionPicked)
        .onSnapshot(function(doc) {
          listenCheckEntered = true
          console.log("LiveRound Snapshot called")
          /*get how long is left in round
          timeRoundEnd = doc.data().timeRoundEnd
          var timeNow = Date.now() 
          var msLeft = timeRoundEnd - timeNow
          var timeLeft = msLeft / 1000
          console.log(timeLeft) 
          
          var display = document.querySelector('#liveShowTime');
          liveTimer(timeLeft,display)
          */

        if (typeof doc.data() !== 'undefined'){
            document.getElementById('sessionNotEntered').style.display =  'none';   
        } else {

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
        }
        });
    }

    var input = document.getElementById("joinSessionID");
    input.addEventListener("keydown", function(event) {
    if (event.key === "Enter" ) {
        event.preventDefault();
        sessionPick();
    }
});

function sessionPick() {
    sessionPicked = document.getElementById('joinSessionID').value.toUpperCase();
    liveRoundData(); 
}
      