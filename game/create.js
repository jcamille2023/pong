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


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase();
const dbRef = ref(getDatabase());

function random_number_gen(b) {
	return Math.floor(Math.random() * b);
}


const t = random_number_gen(40);
if(t < 20) {
	dx = 1;
}
else {
	dx = -1;
}
dy = 2;

function keyDownHandler(e) {
	if (e.key == "Down" || e.key == "ArrowDown") {
		let updates = {};
		let l_paddle_pos = {ypos: Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10};
		updates['/games/' + gameId + "/positions/left_paddle"] = l_paddle_pos;
		update(dbRef, updates);
		// left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) + "px"; will be moved to control by firebase
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		// left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) - "px"; will be moved to control by firebase
		let updates = {};
		let l_paddle_pos = {ypos: Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) - 10};
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
			return "player 1 wins";
		}
		else {
			clearInterval(interval);
			console.log("win - player_2");
			return "player 2 wins";
		}
	}
	let ball_ypos = Number(ball.style.top.slice(0,ball.style.top.length-2));
	
	if(ball_ypos >= lp_pos && ball_ypos <= (lp_pos + 110) && ball_xpos <= 25 && direction_changed == false) {
		dx = -dx;
		direction_changed = true;
	}
	if(ball_ypos >= rp_pos && ball_ypos <= (rp_pos + 110) && ball_xpos >= 539 && direction_changed == false) {
		dx = -dx;
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

onAuthStateChanged(auth, (user) => {
	if(user) {
		playerId = user.uid;
		get(child(dbRef,"games/" + gameId + "/players")).then((snapshot) => {
        		const data = snapshot.val();
			console.log(data);
			opponentId = data.player_2;
		});
		document.getElementById("player_id").innerHTML = playerId;
		document.getElementById("opponent_id").innerHTML = opponentId;
		document.getElementById("game_id").innerHTML = gameId;
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
		interval = setInterval(move, 10);
}				
	else{console.log("User is signed out.");}
});


