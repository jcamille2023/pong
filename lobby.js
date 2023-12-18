import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get,child,remove } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAjHsCstknxm_3cdBzYulCBSZLxSr1qqJQ",
    authDomain: "ping-pong-online-4248e.firebaseapp.com",
    projectId: "ping-pong-online-4248e",
    storageBucket: "ping-pong-online-4248e.appspot.com",
    messagingSenderId: "967048086805",
    appId: "1:967048086805:web:2b5d4563794ed5934ed51c",
    measurementId: "G-RBV9QDF1HP"
  };

function add_player_2(a) { // adds player 2 to database
	set(ref(database, "/games/" + gameId + "/players"), a);
 }


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function random_number_gen() {
	return Math.floor(Math.random() * 9999);
}

var playerId;
var opponentId;
var gameId;
var game_start;
const searchParams = new URLSearchParams(window.location.search);
console.log(searchParams.get('game_id'));
if (searchParams.get('game_id') == "new") {
  gameId = random_number_gen();
}
else {
  gameId = searchParams.get('game_id');
}

function go_home() {
	window.location.href = "https://jcamille2023.github.io/pong/";
}
window.go_home = go_home;
onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		console.log("User is signed in");
		console.log(playerId);
		document.getElementById("user_id").innerHTML = user.displayName;
		document.getElementById("game_id").innerHTML = gameId;
		const gamesRef = ref(database, 'games/' + gameId);
		onValue(gamesRef, (snapshot) => {
			var data = snapshot.val();
			console.log(data);
	 		if (data == null && game_start == true) {
				console.log("game null");
				window.location.href = "https://jcamille2023.github.io/pong/index?game_removed=true";
			}
		});
    if(searchParams.get('game_id') == "new") {
		set(ref(database, "/games/" + gameId + "/players"), {
		player_1: playerId,
    		});
		var playersRef = ref(database, "/games/" + gameId + "/players");
		onValue(playersRef, (snapshot) => {
			 const data = snapshot.val();
			 console.log(data);
			 if (data.player_2) {
				 opponentId = data.player_2;
				get(child(dbRef, "players/" + opponentId)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("opponent_id").innerHTML = username;
	 			});
				
         			document.getElementById("start_button").setAttribute("style","");
			 }
		});
   }
    else {
      get(child(dbRef,"games/" + gameId + "/players")).then((snapshot) => {
        const data = snapshot.val();
	if(data == null) {
		document.getElementById("center").innerHTML = "<h1>Ping Pong Online</h1><br><p>This game does not exist.</p>";
		let button = document.createElement("button");
		button.setAttribute("onclick","go_home()");
		button.innerHTML = "Back to main menu";
		document.getElementById("center").appendChild(button); 
	}
        data.player_2 = playerId;
	opponentId = data.player_1;
	// console.log(get_username(opponentId));
	get(child(dbRef, "players/" + opponentId)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("opponent_id").innerHTML = username;
	 			});
				
        add_player_2(data);
      });
    }
		var deleteRef =  ref(database, "/games/" + gameId + "/delete");
		onValue(deleteRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			if (data != null) {
			if(data.delete == true) {
				remove(ref(database, "/games/" + gameId));
				go_home();
			}
			}
		});
    var startRef = ref(database, "/games/" + gameId);
		onValue(startRef, (snapshot) => {
			 const data = snapshot.val();
			 console.log(data);
			 if (data.game_start == true) {
				if (searchParams.get('game_id') == "new") {
				var url = new URL("https://jcamille2023.github.io/pong/game/create");
				}
				else {
				var url = new URL("https://jcamille2023.github.io/pong/game/join");
				}
         			url.searchParams.append('game_id', gameId);
         			console.log(url);
         			window.location.href = url;
			 }
		});
  }
	else {
		console.log("User is signed out");
	}
});

function start_game() {
  var data;
  get(child(dbRef, "games/" + gameId)).then((snapshot) => {
    data = snapshot.val();
    console.log(data);
    data.game_start = true;
    set(ref(database, "games/" + gameId), data);
  });
  
}



function delete_session() {
	let game_ref = ref(database, "/games/" + gameId);
	remove(game_ref);
	console.log("Game session deleted.");
}

function delete_game() {
	set(ref(database,"games/" + gameId + "/delete"), {delete: true});
	go_home();
}
window.delete_game = delete_game;
function go_home() {
	window.location.href = "https://jcamille2023.github.io/pong/";
}

window.start_game = start_game;
window.delete_session = delete_session;
