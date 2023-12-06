var list_of_games = [];
const list_players = document.getElementById("lists_of_games");

    // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
  import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "AIzaSyB-aP1AEjzCLPCs7Yg4GY_Z4pnLZ8T2qys",
  authDomain: "ping-pong-online.firebaseapp.com",
  projectId: "ping-pong-online",
  storageBucket: "ping-pong-online.appspot.com",
  messagingSenderId: "213821744223",
  appId: "1:213821744223:web:d86dbc68386c81a10567ea",
  measurementId: "G-PXQC20J5RZ"
};



  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase();
  const analytics = getAnalytics(app);
  let playerId;
  let playerRef; 
  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const playerId = user.uid;
    console.log("User is signed in");
    console.log(playerId);
    document.getElementById("user_id").innerHTML = playerId;
    const gamesRef = ref(database, 'games/');
onValue(gamesRef, (snapshot) => {
    const data = snapshot.val();
    if (data != null) {
        console.log(data);
        console.log(Object.keys(data));
        list_of_games = Object.keys(data);
        console.log(list_of_games);
        print_games(list_of_games);

        for(let n = 0; n < Object.keys(data).length; n++) {
            if (data[list_of_games[n]].players.player_2) {
                console.log(list_of_games[n]);
                document.getElementById(list_of_games[n]).remove();
            }
            if(!list_players.hasChildNodes()) {
                list_players.innerHTML = "There are no active games at this time.";
            }
        }

        
    }
    else {
        list_players.innerHTML = "There are no joinable games at this time.";
    }
  });
    // ...
  } else {
    console.log("User is signed out");
    // User is signed out
    // ...
  }
});


setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInAnonymously(auth);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

function print_games(a) {
      
      const button_text = "<button id='"
      const button_text_2 = "' onclick=playWith('";
      const button_text_3 = "')>";
      const button_text_4 = "</button>";
      list_players.innerHTML = "";
      console.log(a.length);
      for (let n = 0; n != a.length; n++) {
        console.log("hi");
        list_players.innerHTML += button_text + a[n] + button_text_2 + a[n] + button_text_3 + a[n] + button_text_4;
      }
    }      
window.print_games = print_games;
function playWith(a) {
       if (a == "new") {
        var url = new URL("https://jcamille2023.github.io/tictactoe/play/create");
        window.location.href = url;
       }
       else {
        var url = new URL("https://jcamille2023.github.io/tictactoe/play/join");
        url.searchParams.append('game_id', a);
        console.log(url);
        window.location.href = url;
       }
      }
window.playWith = playWith;
