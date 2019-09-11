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

function initGame(){
	game.players 		= [];
	game.players[0]	= new Paddle('Player 1', 30, 3, 'green');
	game.players[1]	= new Paddle('Player 2', 30, 3, 'red');
	game.ball 			= new Ball(3, 'blue');
	
	game.state 			= 0; 
	game.pause 		= true;
	game.restart		= false;
	
	resetPlayingField();
}

function resetPlayingField(){
	game.pause       	 	= true;
	game.restart			= false;
	game.ball.x          	= canvas.width/2;
    game.ball.y          	= canvas.height/2;
    game.ball.offsetX  	= 5;
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
			game.players[0].Down = true;
			break;
		case 90: 
			game.players[1].Up = true;
			break;
		case 77: 
			game.players[1].Down = true;
			break;
		case 78: 
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
			game.players[0].Down = false;
			break;
		case 90: 
			game.players[1].Up = false;
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

function showInfo(message){
	//Wyświetl info
}

function showHeadline(message){
	//Wyświetl nagłówek
}

function showScores(){
	//Wyświetlenie wyniku
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
                break;
            default:
                transformGame();
        }
    }

	requestAnimationFrame(play);
}


