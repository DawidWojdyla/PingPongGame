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
	game.players 					= [];
	game.players[0]				= new Paddle('Player 1', 30, 3, 'green');
	game.players[1]				= new Paddle('Player 2', 30, 3, 'red');
	game.ball 						= new Ball(3, 'blue');
	
	setPlayingField();

}

function setPlayingField(){
	game.ball.x          		= canvas.width/2;
    game.ball.y          		= canvas.height/2;
    game.ball.offsetX    		= 5;
    game.ball.offsetY  		= 3;
    game.ball.bounces  	= 0;
	
    game.players[0].x      	= 0;
    game.players[1].x     	= canvas.width - game.players[1].width;
    game.players[0].y      	= canvas.height/2 - game.players[0].length/2;
    game.players[1].y      	= game.players[0].y;
}


function drawGame() {
    game.ball.draw();
    game.players[0].draw();
    game.players[1].draw();
   // showScores
}
//initGame();
//drawGame();


