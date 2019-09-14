var canvas = document.getElementById('pingpong');
var ctx = canvas.getContext('2d');

var game = {};

class Paddle
{
	constructor (name, length, width, color) {
		this.x         		= 0;
		this.y         		= 0;
		this.points     	= 0;
		this.offset  		= 6;
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
	game.ball.offsetX *= 1.5;
	game.ball.color = "orange";
}

function changeBallReflectionAngle(){
	game.ball.offsetY *= 1.3;
}

function resetBall(){
	game.ball.color 	= "blue";
	game.ball.offsetX = (game.ball.offsetX > 0) ? 6 : -6; 
	game.ball.offsetY = (game.ball.offsetY > 0) ? 3 : -3; 
}

function initGame(){
	game.players 		= [];
	game.players[0]	= new Paddle('Player 1', 80, 15, 'green');
	game.players[1]	= new Paddle('Player 2', 80, 15, 'red');
	game.ball 			= new Ball(10, 'blue');
	
	game.state 			= 0; 
	game.pause 		= true;
	game.restart		= false;

	resetPlayingField();
	showIntroduction();
}

function resetPlayingField(){
	game.pause       	 	= true;
	
	game.players[0].x     = 15;
    game.players[1].x     = canvas.width - game.players[1].width - 15;
    game.players[0].y     = canvas.height/2 - game.players[0].length/2;
    game.players[1].y     = game.players[0].y;
	
	if(game.state != 2){
		game.ball.x          	= game.players[0].x + game.players[0].width + 12;
		game.ball.y          	= canvas.height/2;
		game.ball.offsetX  	= 6;
		game.ball.offsetY  	= 3;
	}
	else{
		game.ball.x          	= game.players[1].x - 12;
		game.ball.y          	= canvas.height/2;
		game.ball.offsetX  	= -6;
		game.ball.offsetY  	= -3;
	}
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
    game.players[0].draw();
    game.players[1].draw();
	if(game.state == 1)
	game.ball.draw();
}

function showIntroduction(){
	alert("Witaj w Grze Ping Pong,\n Zieloną paletką steruje się za pomocą klawiszy A oraz Z, natomiast czerwoną za pomocą K oraz M.\nGdy odbijesz piłkę na skraju paletki to zmieni kąt odbicia. \nGdy odbijesz piłkę środkiem paletki to piłka przyśpieszy. \nGdy odbijesz piłkę przyśpieszoną środkiem paletki, piłka dodatkowo przyśpieszy lub gdy odbijesz ją na skraju paletki dodatkowo zmieni kąt odbicia.");
}

function showHeadline(message){
	ctx.font = '28px Helvetica';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width/2, 120);
}

function showInfo(message){
	ctx.font = '16px Helvetica';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width/2, 180);
}

function showScores(){
	ctx.font = '48px Helvetica';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(game.players[0].points+" : "+game.players[1].points, canvas.width/2, 260);
	ctx.font = '22px Helvetica';
	ctx.fillStyle = '#ddd';
	ctx.fillText("Odbicia: " + game.ball.bounces, canvas.width/2, 300);
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


