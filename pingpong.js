var canvas = document.getElementById('pingpong');
var ctx = canvas.getContext('2d');

class Paddle
{
	constructor (name, length, width, color, offset) {
		this.x         		= 0;
		this.y         		= 0;
		this.points     	= 0;
		this.name     	= name;
		this.length   	= length;
		this.width 		= width;
		this.color     	= color;
		this.offset  		= offset;
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
		this.x 			= 0;
		this.y 			= 0;
		this.offsetX = 0;
		this.offsetY = 0;
		this.radius 	= radius;
		this.color	= color;
		this.draw     = function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}
}
