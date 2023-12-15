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



function keyDownHandler(e) {
	if (e.key == "Down" || e.key == "ArrowDown") {
		let updates = {};
		let r_paddle_pos = {ypos: Number(right_paddle.style.top.slice(0,right_paddle.style.top.length-2)) + 10};
		updates['/games/' + gameId + "/positions/right_paddle"] = r_paddle_pos;
		update(dbRef, updates);
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		let updates = {};
		let r_paddle_pos = {ypos: Number(right_paddle.style.top.slice(0,right_paddle.style.top.length-2)) - 10};
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
			      opponentId = data.player_1;
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
		setInterval(move, 10);
}				
	else{console.log("User is signed out.");}
});


