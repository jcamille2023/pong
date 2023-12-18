var list_of_games = [];
const list_players = document.getElementById("lists_of_games");

    // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signInAnonymously, setPersistence, browserSessionPersistence, updateProfile } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
  import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAjHsCstknxm_3cdBzYulCBSZLxSr1qqJQ",
    authDomain: "ping-pong-online-4248e.firebaseapp.com",
    projectId: "ping-pong-online-4248e",
    storageBucket: "ping-pong-online-4248e.appspot.com",
    messagingSenderId: "967048086805",
    appId: "1:967048086805:web:2b5d4563794ed5934ed51c",
    measurementId: "G-RBV9QDF1HP"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase();
  const analytics = getAnalytics(app);
  var playerId;
  var username;
  var new_variables = [];
  onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in");
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    playerId = user.uid;
     updateProfile(auth.currentUser, {displayName: playerId}).then(() => {document.getElementById("user_id").innerHTML = playerId;}).catch((error) => {
         console.log("Some kind of error occured.");
});
    set(ref(database, "/players/" + playerId), {username: playerId});
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
    console.log(errorCode);
    console.log(errorMessage);
  });

function print_games(a) {
      const button_text = "<button id='";
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
        var url = new URL("https://jcamille2023.github.io/pong/lobby");
        url.searchParams.append('game_id', "new");
        console.log(url);
        window.location.href = url;
       }
       else {
        var url = new URL("https://jcamille2023.github.io/pong/lobby");
        url.searchParams.append('game_id', a);
        console.log(url);
        window.location.href = url;
       }
      }
window.playWith = playWith;


function submit_username() {
    let content = document.getElementById("content");
    let content2 = new_variables[0];
    let username_input = document.getElementById("user_input");
    username = username_input.value;
    console.log(username);
    updateProfile(auth.currentUser, {displayName: username}).then(() => {
        content.style.display = "inline";
        content2.innerHTML = "";
        set(ref(database, "/players/" + playerId), {username: username});
        document.getElementById("user_id").innerHTML = username;
    }).catch((error) => {
  // An error occurred
  // ...
});
   
   
}
window.submit_username = submit_username;

function set_username() {
    let content = document.getElementById("content");
    content.style.display = "none";
    
    let content2 = document.getElementById("set_username");
    
    let window_title = document.createElement("h3");
    let title_text_1 = document.createTextNode("Change your username");
    
    let username_paragraph = document.createElement("p");
    let paragraph_text_1 = document.createTextNode("Enter your new username");

    let username_input = document.createElement("input");
    
    let submit_button = document.createElement("button");
    let br = document.createElement("br");
    
    submit_button.innerHTML = "Submit";
    username_input.setAttribute("type","text");
    username_input.setAttribute("id","user_input");
    submit_button.setAttribute("onclick","submit_username()");
    
    window_title.appendChild(title_text_1);
    content2.appendChild(window_title);
    content2.appendChild(username_paragraph);
    content2.appendChild(br);
    content2.appendChild(username_input);
    content2.appendChild(submit_button);
    username_paragraph.appendChild(paragraph_text_1);

    
    new_variables.push(content2);
}
window.set_username = set_username;
