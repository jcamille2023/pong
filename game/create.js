dx = 2;
dy = 2;
const ball = document.getElementById("ball");
const left_paddle = document.getElementById("l_paddle");
const right_paddle = document.getElementById("r_paddle");
var direction_changed = false;



function keyDownHandler(e) {
	if (e.key == "Down" || e.key == "ArrowDown") {
		left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) + "px";
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		left_paddle.style.top = String(Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2)) + 10) + "px";
	}
	
}
document.addEventListener("keydown", keyDownHandler, false);


function move() {
	var lp_pos = Number(left_paddle.style.top.slice(0,left_paddle.style.top.length-2))
	var rp_pos = Number(right_paddle.style.top.slice(0,right_paddle.style.top.length-2))
	var ball_xpos = Number(ball.style.left.slice(0,ball.style.left.length-2));
	if(ball_xpos <= 300 && ball_xpos >= 280) {
		direction_changed = false;
	}
	
	// ball movement
	if(ball_xpos >= 566 || ball_xpos <= 0) {
		if(ball_xpos >= 566) {
			return "player 1 wins";
		}
		else {
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
	ball_xpos = String(ball_xpos) + "px";
	ball.style.left = ball_xpos;
	
	
	console.log(ball_xpos);
	ball_ypos += dy;
	ball_ypos = String(ball_ypos) + "px";
	ball.style.top = ball_ypos;
	
	
}
