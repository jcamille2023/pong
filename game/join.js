import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get,child,remove, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyAjHsCstknxm_3cdBzYulCBSZLxSr1qqJQ",
    authDomain: "ping-pong-online-4248e.firebaseapp.com",
    projectId: "ping-pong-online-4248e",
    storageBucket: "ping-pong-online-4248e.appspot.com",
    messagingSenderId: "967048086805",
    appId: "1:967048086805:web:2b5d4563794ed5934ed51c",
    measurementId: "G-RBV9QDF1HP"
  };

const searchParams = new URLSearchParams(window.location.search);
var gameId = searchParams.get('game_id');

const ball = document.getElementById("ball");
const left_paddle = document.getElementById("l_paddle");
const right_paddle = document.getElementById("r_paddle");
var playerId;
var opponentId;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function back_to_lobby() {
	set(ref(database,"games/" + gameId + "/delete"), {delete: true});
	go_home();
}
window.back_to_lobby = back_to_lobby;
function go_home() {
	window.location.href = "https://jcamille2023.github.io/pong/";
}
window.go_home = go_home;
function play_again() {
	let updates = {};
	updates["games/" + gameId + "/win/play_again"] = {play_again: playerId};
	update(dbRef, updates);
}
window.play_again = play_again;

function agree() {
	let updates = {};
	updates["games/" + gameId + "/win/play_again"] = {play_again: true};
	update(dbRef, updates);
}
window.agree = agree;

function keyDownHandler(e) {
	if (e.key == "Down" || e.key == "ArrowDown") {
		let updates = {};
		let r_paddle_pos = {ypos: 290 - Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) - 45};
		if(r_paddle_pos.ypos > 291) {
			return "Limit reached";
		}
		updates['/games/' + gameId + "/positions/right_paddle"] = r_paddle_pos;
		update(dbRef, updates);
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		let updates = {};
		let r_paddle_pos = {ypos: 290 - Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 45};
		if(r_paddle_pos < 1) {
			return "Limit reached";
		}
		updates['/games/' + gameId + "/positions/right_paddle"] = r_paddle_pos;
		update(dbRef, updates);
	}
	
}
document.addEventListener("keydown", keyDownHandler, false);



onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		get(child(dbRef,"games/" + gameId + "/players")).then((snapshot) => {
        		const data = snapshot.val();
			if(data == null) {
				document.getElementById("pong").innerHTML = "<p>This game does not exist.</p>";
				let button = document.createElement("button");
				button.setAttribute("onclick","go_home()");
				button.innerHTML = "Back to main menu";
				document.getElementById("pong").appendChild(button); 
			}
			console.log(data);
			console.log(data.player_1);
			opponentId = data.player_1;
			document.getElementById("player_id").innerHTML = user.displayName;
				get(child(dbRef, "players/" + opponentId)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("opponent_id").innerHTML = username;
	 			});
			document.getElementById("game_id").innerHTML = gameId;
		});
		var ballRef = ref(database, "/games/" + gameId + "/positions/ball");
    		onValue(ballRef, (snapshot) => {
			const data = snapshot.val();
			ball.style.left = String(566 - data.xpos) + "px";
			ball.style.top = String(367 - data.ypos) + "px";
		});
		var leftPaddleRef =  ref(database, "/games/" + gameId + "/positions/left_paddle");
		onValue(leftPaddleRef, (snapshot) => {
			const data = snapshot.val();
			right_paddle.style.top = String(290 - data.ypos) + "px";
		});
		var rightPaddleRef =  ref(database, "/games/" + gameId + "/positions/right_paddle");
		onValue(rightPaddleRef, (snapshot) => {
			const data = snapshot.val();
			left_paddle.style.top = String(290 - data.ypos) + "px";
		});
		var winRef =  ref(database, "/games/" + gameId + "/win");
		onValue(winRef, (snapshot) => {
			const data = snapshot.val();
			if(!data.play_again) {
				document.getElementById("player_id").innerHTML = user.displayName;
				get(child(dbRef, "players/" + data.winner)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("game_winner").innerHTML = username + " wins!";
	 			});
			document.getElementById("play_again").setAttribute("style","");
			}
		});
		var playAgainRef =  ref(database, "/games/" + gameId + "/win/play_again");
		onValue(playAgainRef, (snapshot) => {
			const data = snapshot.val();
			if(data != null) {
				document.getElementById("play_again").style.visibility = "hidden";
				let game_end_section = document.getElementById("game_end");
				if(data.play_again == playerId) {
					let p = document.createElement("p");
					p.setAttribute("id","prompt");
					let textNode = document.createTextNode("Sent a request to play again!");
					p.appendChild(textNode);
					game_end_section.appendChild(p);
				}
				else if(data.play_again == opponentId) {
					let p = document.createElement("p");
					p.setAttribute("id","prompt");
					get(child(dbRef, "players/" + data.winner)).then((snapshot) => {
		 				let data = snapshot.val();
		 				console.log(data);
		 				console.log(Object.values(data));
		 				let username = Object.values(data)[0];
						let textNode = document.createTextNode(username + " wants to play again.");
						p.appendChild(textNode);
						game_end_section.appendChild(p);
						let button = document.createElement("button");
						button.setAttribute("onclick","agree()");
						button.setAttribute("id","agree");
						button.innerHTML = "Play again?";
						game_end_section.appendChild(button);
	 				});	
				}
				else if (data.play_again == true) {
				if(document.getElementById("agree")) {
					document.getElementById("agree").remove();
				}
				document.getElementById("prompt").remove();
				document.getElementById("game_winner").innerHTML = "";
				}
			}
		});
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
		
		
}				
	else{console.log("User is signed out.");}
});


