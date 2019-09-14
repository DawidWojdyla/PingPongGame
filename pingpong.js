var canvas = document.getElementById('pingpong');
var ctx = canvas.getContext('2d');

var game = {};

class Paddle
{
	constructor (name, length, width, color) {
		this.x         		= 0;
		this.y         		= 0;
		this.points     	= 0;
		this.offset  		= 5;
		this.name     	= name;
		this.length   	= length;
		this.width 		= width;
		this.color     	= color;
		this.Up			= false;
		this.Down		= false;
		this.draw     	= function() {
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.length);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}
}

class Ball 
{
	constructor(radius, color){
		this.x 				= 0;
		this.y 				= 0;
		this.offsetX 	= 0;
		this.offsetY 	= 0;
		this.bounces 	= 0;
		this.radius 		= radius;
		this.color		= color;
		this.draw     	= function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}
}

function speedUpBall(){
	game.ball.offsetX *= 1.4;
	game.ball.color = "orange";
}

function changeBallReflectionAngle(){
	game.ball.offsetY *= 1.4;
}

function resetBall(){
	game.ball.color 	= "blue";
	game.ball.offsetX = (game.ball.offsetX > 0) ? 6 : -6; 
	game.ball.offsetY = (game.ball.offsetY > 0) ? 3 : -3; 
}

function initGame(){
	game.players 		= [];
	game.players[0]	= new Paddle('Player 1', 80, 10, 'green');
	game.players[1]	= new Paddle('Player 2', 80, 10, 'red');
	game.ball 			= new Ball(10, 'blue');
	
	game.state 			= 0; 
	game.pause 		= true;
	game.restart		= false;
	
	resetPlayingField();
}

function resetPlayingField(){
	game.pause       	 	= true;
	game.ball.x          	= canvas.width/2;
    game.ball.y          	= canvas.height/2;
    game.ball.offsetX  	= 6;
    game.ball.offsetY  	= 3;
    
	
    game.players[0].x     = 0;
    game.players[1].x     = canvas.width - game.players[1].width;
    game.players[0].y     = canvas.height/2 - game.players[0].length/2;
    game.players[1].y     = game.players[0].y;
}

function keyDownHandler(e) {
    switch(e.keyCode){
		case 65: 
			game.players[0].Up = true;
			break;
		case 75: 
			game.players[1].Up = true;
			break;
		case 90: 
			game.players[0].Down = true;
			break;
		case 77: 
			game.players[1].Down = true;
			break;
		case 78: 
			if(game.pause == true)
				game.restart = true;
			break;
		case 32: 
			game.pause = !game.pause;
			break;
	}
}

function keyUpHandler(e) {
    switch(e.keyCode){
		case 65: 
			game.players[0].Up = false;
			break;
		case 75: 
			game.players[1].Up = false;
			break;
		case 90: 
			game.players[0].Down = false;
			break;
		case 77: 
			game.players[1].Down = false;
			break;
	}
}
 
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function drawGame() {
    game.ball.draw();
    game.players[0].draw();
    game.players[1].draw();
}

function showIntroduction(){
	//INFORMACJE WPROWADZAJĄCE, klawisze itp..
}

function showHeadline(message){
	ctx.font = '32px serif';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width/2, 120);
}

function showInfo(message){
	ctx.font = '30px serif';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width/2, 180);
}

function showScores(){
	ctx.font = '40px serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(game.players[0].points+" : "+game.players[1].points, canvas.width/2, 320);
	ctx.font = '25px serif';
	ctx.fillStyle = '#ddd';
	ctx.fillText("Odbicia: " + game.ball.bounces, canvas.width/2, 360);
}

function transformGame(){
   //ball movement
	game.ball.x += game.ball.offsetX;
	game.ball.y += game.ball.offsetY;
	
	//paddles movement
	if(game.players[0].Up && game.players[0].y > 0)
		game.players[0].y -= game.players[0].offset;
	
	if(game.players[1].Up && game.players[1].y > 0)
		game.players[1].y -= game.players[1].offset;
	
	if(game.players[0].Down && game.players[0].y +game.players[0].length < canvas.height)
		game.players[0].y += game.players[0].offset;
	
	if(game.players[1].Down && game.players[1].y + game.players[1].length < canvas.height)
		game.players[1].y += game.players[1].offset;
	
	//ball bouncing off the top/bottom 
	 if(game.ball.y - game.ball.radius <= 0 || game.ball.y + game.ball.radius >= canvas.height)
		game.ball.offsetY = - game.ball.offsetY;
	

	//getting a point or ball bouncing off the paddles
	if(game.ball.x < game.players[0].x ){
		game.players[1].points++;
		game.state = 3;
		game.pause = true;
		resetBall();
	}
	else if(game.ball.y >= game.players[0].y && game.ball.y  <= game.players[0].y + game.players[0].length && game.ball.x  - game.ball.radius<= game.players[0].x + game.players[0].width)
	{
		if(game.ball.y - game.players[0].y - game.players[0].length/2 < 7 && game.ball.y - game.players[0].y - game.players[0].length/2 > -7)
		{
			speedUpBall();
		 }
		else if (game.ball.y - game.ball.radius < game.players[0].y || game.ball.y + game.ball.radius > game.players[0].y + game.players[0].length)
		{
			changeBallReflectionAngle();
		}
		 else
		 {
			resetBall();
		 }
		 
	  if(game.ball.offsetX < 0){
		game.ball.offsetX = - game.ball.offsetX ; 
		game.ball.bounces++;
	  }
	  
	  
	  
	}
	
	if(game.ball.x > game.players[1].x  + game.players[1].width){
		game.players[0].points++;
		game.state = 2;
		game.pause = true;
		resetBall();
	}
	else if(game.ball.y >= game.players[1].y && game.ball.y <= game.players[1].y + game.players[1].length   && game.ball.x + game.ball.radius >= game.players[1].x )
	{
		if(game.ball.y  - game.players[1].y - game.players[1].length/2 < 7 && game.ball.y - game.players[1].y - game.players[1].length/2 > -7)
		{
			speedUpBall();

		 }
		else if (game.ball.y - game.ball.radius < game.players[1].y || game.ball.y + game.ball.radius > game.players[1].y + game.players[1].length)
		{
			changeBallReflectionAngle();
		}
		 else
		 {
			resetBall();
		 }
		
		if(game.ball.offsetX > 0){
			game.ball.offsetX = - game.ball.offsetX; 
			game.ball.bounces++;
		}
		
		
  }
}


function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGame();

    if (game.pause) {
        switch(game.state) {
            case 0:
                showIntroduction();
                showInfo('Wciśnij SPACJĘ, aby zacząć grę');
                break;
            case 2:
                resetPlayingField();
                showHeadline('Punkt dla gracza po lewej');
				showScores();
                showInfo('SPACJA - kontynuuj, N - zacznij od nowa');
				if(game.restart) initGame();
                break;
			 case 3:
                resetPlayingField();
                showHeadline('Punkt dla gracza po prawej');
				showScores();
                showInfo('SPACJA - kontynuuj, N - zacznij od nowa');
				if(game.restart) initGame();
                break;
            default:
                showHeadline('Pauza');    
                showInfo('SPACJA - wznów grę, N - zacznij od nowa');
				if(game.restart) initGame();
        }
    } else {
        switch(game.state) {
            case 0:
            case 2:
            case 3: 
                game.state = 1;
				game.restart = false;
				game.ball.bounces = 0;
                break;
            default:
                transformGame();
        }
    }

	requestAnimationFrame(play);
}

initGame();
play();


