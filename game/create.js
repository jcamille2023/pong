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
var direction_changed = false;
var dx;
var dy;
var playerId;
var opponentId;
var interval;

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function random_number_gen(b) {
	return Math.floor(Math.random() * b);
}





function declare_win(a) {
	let updates = {};
	let win = {winner: a};
	updates["/games/" + gameId + "/win"] = win;
	update(dbRef,updates);
}

function keyDownHandler(e) {
	if (e.key == "Down" || e.key == "ArrowDown") {
		let updates = {};
		let l_paddle_pos = {ypos: Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 45};
		if(l_paddle_pos > 291) {
			return "Limit reached";
		}
		updates['/games/' + gameId + "/positions/left_paddle"] = l_paddle_pos;
		update(dbRef, updates);
		// left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) + "px"; will be moved to control by firebase
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		// left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) - "px"; will be moved to control by firebase
		let updates = {};
		let l_paddle_pos = {ypos: Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) - 45};
		if(l_paddle_pos.ypos < 1) {
			return "Limit reached";
		}
		updates['/games/' + gameId + "/positions/left_paddle"] = l_paddle_pos;
		update(dbRef, updates);
	}
	
}
document.addEventListener("keydown", keyDownHandler, false);


function move() {
	var lp_pos = Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2));
  var rp_pos = Number(right_paddle.style.top.slice(0,right_paddle.style.top.length-2));
	var ball_xpos = Number(ball.style.left.slice(0,ball.style.left.length-2));
	if(ball_xpos <= 300 && ball_xpos >= 280) {
		direction_changed = false;
	}
	
	// ball movement
	if(ball_xpos >= 566 || ball_xpos <= 0) {
		if(ball_xpos >= 566) {
			clearInterval(interval);
			console.log("win - player_1");
			declare_win(playerId);
			return "player 1 wins";
		}
		else {
			clearInterval(interval);
			console.log("win - player_2");
			declare_win(opponentId);
			return "player 2 wins";
		}
	}
	let ball_ypos = Number(ball.style.top.slice(0,ball.style.top.length-2));
	
	if(ball_ypos >= lp_pos && ball_ypos <= (lp_pos + 110) && ball_xpos <= 25 && direction_changed == false) {
		dx = -1.1*dx;
		dy = 1.1*dy
		direction_changed = true;
	}
	if(ball_ypos >= rp_pos && ball_ypos <= (rp_pos + 110) && ball_xpos >= 539 && direction_changed == false) {
		dx = -1.1*dx;
		dy = 1.1*dy;
		direction_changed = true;
	}
	if(ball_ypos >= 367 || ball_ypos <= 0) {
		dy = -dy;
	}
	console.log(ball_xpos);
	ball_xpos += dx;
	ball_ypos += dy;
	var ball_position = {xpos: ball_xpos, ypos: ball_ypos};
	let updates = {};
	updates['/games/' + gameId + "/positions/ball"] = ball_position;
	update(dbRef, updates);
	console.log(ball_xpos);
	
}
function start_game() {
	const t = random_number_gen(10);
	if(t < 5) {
		dx = 0.5;
	}
	else {
		dx = -0.5; 
	}
	dy = 1;
	interval = setInterval(move,5);
}

onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		get(child(dbRef,"games/" + gameId + "/players")).then((snapshot) => {
        		const data = snapshot.val();
			if(data == null) {
				document.getElementById("pong").innerHTML = "<h1>Ping Pong Online</h1><br><p>This game does not exist.</p>";
				let button = document.createElement("button");
				button.setAttribute("onclick","go_home()");
				button.innerHTML = "Back to main menu";
				document.getElementById("pong").appendChild(button); 
			}
			console.log(data);
			opponentId = data.player_2;
			console.log(data.player_2);
			console.log(opponentId);
			document.getElementById("player_id").innerHTML = user.displayName;
				get(child(dbRef, "players/" + opponentId)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("opponent_id").innerHTML = username;
	 			});
			document.getElementById("game_id").innerHTML = gameId;
			start_game();
		});	
		var ballRef = ref(database, "/games/" + gameId + "/positions/ball");
    		onValue(ballRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			ball.style.left = String(data.xpos) + "px";
			ball.style.top = String(data.ypos) + "px";
		});
		var leftPaddleRef =  ref(database, "/games/" + gameId + "/positions/left_paddle");
		onValue(leftPaddleRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			left_paddle.style.top = String(data.ypos) + "px";
		});
		var rightPaddleRef =  ref(database, "/games/" + gameId + "/positions/right_paddle");
		onValue(rightPaddleRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			right_paddle.style.top = String(data.ypos) + "px";
		});
		var winRef =  ref(database, "/games/" + gameId + "/win");
		onValue(winRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			if (!data.play_again) {
				document.getElementById("player_id").innerHTML = user.displayName;
				get(child(dbRef, "players/" + data.winner)).then((snapshot) => {
		 			let data = snapshot.val();
		 			console.log(data);
		 			console.log(Object.values(data));
		 			let username = Object.values(data)[0];
					document.getElementById("opponent_id").innerHTML = username + " wins!";
	 			});
			document.getElementById("play_again").setAttribute("style","");
			}
		});
		var deleteRef =  ref(database, "/games/" + gameId + "/delete");
		onValue(deleteRef, (snapshot) => {
			const data = snapshot.val();
			if(data.delete == true) {
				remove(ref(database, "/games/" + gameId));
				go_home();
			}
		});
		var playAgainRef =  ref(database, "/games/" + gameId + "/win/play_again");
		onValue(playAgainRef, (snapshot) => {
			const data = snapshot.val();
			console.log(data);
			if (data != null) {
			document.getElementById("play_again").setAttribute("style", "visibility: hidden");
			let game_end_section = document.getElementById("game_end");
			let p = document.createElement("p");
			p.setAttribute("id","prompt");
			if (data.play_again == true) {
				if(document.getElementById("agree")) {
					document.getElementById("agree").remove();
				}
				document.getElementById("prompt").remove();
				document.getElementById("game_winner").innerHTML = "";
				var ball_position = {xpos: 280, ypos: 183};
				let updates = {};
				updates['/games/' + gameId + "/positions/ball"] = ball_position;
				let l_paddle_pos = {ypos: 143};
				updates['/games/' + gameId + "/positions/left_paddle"] = l_paddle_pos;
				update(dbRef, updates);
				let r_paddle_pos = {ypos: 143};
				updates['/games/' + gameId + "/positions/right_paddle"] = r_paddle_pos;
				let win = {};
				updates['/games/' + gameId + "/win/"] = win;
				update(dbRef, updates);
				start_game();
			}
			else if(data.play_again == playerId) {
				p.innerHTML = "Sent a request to play again!";
			}
			else if(data.play_again == opponentId) {
				p.innerHTML = opponentId + " sent a play again request.";
			}
			game_end_section.appendChild(p);
			if(data.play_again == opponentId) {
				let button = document.createElement("button");
				button.setAttribute("onclick","agree()");
				button.setAttribute("id","agree");
				button.innerHTML = "Play again?";
				game_end_section.appendChild(button);
			}
			}
		});
		
}				
	else{console.log("User is signed out.");}
});


