var canvas = document.getElementById('pingpong');
var ctx = canvas.getContext('2d');

class Paddle
{
	x         	= 0;
	y      	= 0;
	points 	= 0;
	offset  	= 6;
	length	= 80;
	width 	= 15;
	Up		= false;
	Down	= false;
	
	constructor (name, color, keyUpAsciiCode, keyDownAsciiCode) {
		this.name     					= name;
		this.color     					= color;
		this.keyUpAsciiCode 		= keyUpAsciiCode;
		this.keyDownAsciiCode 	= keyDownAsciiCode;
	}
	
	setX(x){
		this.x = x;
	}
	
	setY(y){
		this.y = y;
	}
	
	getX(){
		return this.x;
	}
	
	getY(){
		return this.y;
	}
	
	getWidth(){
		return this.width;
	}
	
	getLength(){
		return this.length;
	}
	
	draw(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.length);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
	
	moveUp() {
		this.y  -= this.offset;
	}
	
	moveDown() {
		this.y  += this.offset;
	}
	
	increaseNumberOfPoints() {
		this.points++;
	}
	
	resetPoints(){
		this.points = 0;
	}
	
	keyDownHandler(e) {
		if(e.keyCode == this.keyUpAsciiCode){
			this.Up = true;
		}
		else if(e.keyCode == this.keyDownAsciiCode){
			this.Down = true;
		}
	}

	keyUpHandler(e) {
		if(e.keyCode == this.keyUpAsciiCode){ 
			this.Up = false;
		}
		else if(e.keyCode == this.keyDownAsciiCode){ 
			this.Down = false;
		}
	}
	
	listenForPressedKeys() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this));
    document.addEventListener("keyup", this.keyUpHandler.bind(this));
	}
}

class Ball 
{
	x 				= 0;
	y 				= 0;
	offsetX 	= 0;
	offsetY		= 0;
	bounces 	= 0;
	
	constructor(radius, color){
		this.radius 		= radius;
		this.color		= color;
	}
	
	draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
	
	setX (x){
		this.x = x;
	}
	
	setY (y){
		this.y = y;
	}

	getX (){
		return this.x;
	}
	
	getY (){
		return this.y;
	}
	
	setOffsetX (offsetX){
		this.offsetX = offsetX;
	}
	
	setOffsetY (offsetY){
		this.offsetY = offsetY;
	}
	
	getOffsetX (){
		return this.offsetX;
	}
	
	getOffsetY (){
		return this.offsetY;
	}
	
	getRadius(){
		return this.radius;
	}
	
	move(){
		this.x += this.offsetX;
		this.y += this.offsetY;
		
		//ball bouncing off the top/bottom 
		 if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height)
			this.changeVerticalDirectionToOpposite();
	}
	
	changeVerticalDirectionToOpposite(){
		this.offsetY *= -1; 
	}
	
	changeHorizontalDirectionToOpposite(){
		this.offsetX *= -1; 
	}
	
	increaseNumberOfBounces(){
		this.bounces++;
	}
	
	speedUp(){
		this.offsetX *= 1.5;
		this.color = "orange";
	}
	
	changeReflectionAngle(){
		this.offsetY *= 1.3;
	}
	
	reset(){
	this.color 	= "blue";
	this.offsetX = (this.offsetX >= 0) ? 6 : -6; 
	this.offsetY = (this.offsetY >= 0) ? 3 : -3; 
	}
	
	resetBounces(){
		this.bounces = 0;
	}
}

class Game
{
	players = [];
	state 								= 0;
	pause 								= true;
	restart								= false;
	pauseKeyAsciiCode			= 32;
	newGameKeyAsciiCode	= 78;
	
	constructor(ball, paddle1, paddle2){
		this.ball 			 			= ball; 
		this.players[0] 			= paddle1;
		this.players[1]			= paddle2;
		this.resetPlayingField();
		this.showIntroduction();
	}
	
	setState(state){
		this.state = state;
	}
	
	resetPlayingField(){
		this.pause = true;
		this.players[0].setX	 (15);
		this.players[1].setX (canvas.width - this.players[1].getWidth() - 15);
		this.players[0].setY (canvas.height/2 - this.players[0].getLength()/2);
		this.players[1].setY (this.players[0].getY());
	
		if(this.state != 2){
			this.ball.setX (this.players[0].getX() + this.players[0].getWidth() + 12);
			this.ball.setY (canvas.height/2);
			this.ball.setOffsetX (6);
			this.ball.setOffsetY (3);
		}
		else{
			this.ball.setX (this.players[1].getX() - 12);
			this.ball.setY (canvas.height/2);
			this.ball.setOffsetX (-6);
			this.ball.setOffsetY (-3);
		}
	}
	
	resetGame(){
		this.setState(0);
		this.players[0].resetPoints();
		this.players[1].resetPoints();
		this.resetPlayingField();	
		this.showIntroduction();
	}
	
	draw () {
		this.players[0].draw();
		this.players[1].draw();
		if(this.state == 1){
			this.ball.draw();
		}
	}
	
	keyDownHandler(e) {
		
		if (e.keyCode == this.pauseKeyAsciiCode){ 
				this.pause = !this.pause;
		}
		else if (e.keyCode == this.newGameKeyAsciiCode && this.pause){ 
			this.restart = true;
		}
	}
	
	listenForPressedKeys() {
		this.players[0].listenForPressedKeys();
		this.players[1].listenForPressedKeys();
		document.addEventListener("keydown", this.keyDownHandler.bind(this));
	}
	
	changePaddlesPositions(){
		for (var i = 0; i < this.players.length; i++) {
			if(this.players[i].Up && this.players[i].getY() > 6){
				this.players[i].moveUp();
			}
			if(this.players[i].Down && this.players[i].getY() + this.players[i].getLength() < canvas.height - 6){
				this.players[i].moveDown();
			}
		}
	}
	
	transformGame(){
		
		this.ball.move();
		this.changePaddlesPositions();
		
	//getting a point or ball bouncing off the paddles
	
		//check if player1 gets a point
		if(this.ball.getX() > this.players[1].getX() + this.players[1].getWidth()){
			this.players[0].increaseNumberOfPoints();
			this.setState(3);
			this.pause = true;
			this.ball.reset();
		}
		//check if player2 bounces the ball
		else if(this.ball.getY() >= this.players[1].getY() && this.ball.getY() <= this.players[1].getY() + this.players[1].getLength() && this.ball.getX() + this.ball.getRadius() >= this.players[1].getX() ){
			//player2 bounces the ball
			if(this.ball.getOffsetX () > 0){
				this.ball.changeHorizontalDirectionToOpposite();
				this.ball.increaseNumberOfBounces();
			}	
			//check if speed up the ball
			if(this.ball.getY()  - this.players[1].getY() - this.players[1].getLength()/2 < 7 && this.ball.getY() - this.players[1].getY() - this.players[1].getLength()/2 > -7){
				this.ball.speedUp();
			 }
			//check if change reflection angle of the ball
			else if (this.ball.getY() - this.ball.getRadius() < this.players[1].getY() || this.ball.getY() + this.ball.getRadius() > this.players[1].getY() + this.players[1].getLength()){
				this.ball.changeReflectionAngle();
			}
			 else{
				this.ball.reset();
			 }	
		}
	  
	  //check if player2 gets a point
	  if(this.ball.getX() < this.players[0].getX()){						
			this.players[1].increaseNumberOfPoints();
			this.setState(2);
			this.pause = true;
			this.ball.reset();
		}
		//check if player1 bounces the ball
		else if(this.ball.getY() >= this.players[0].getY() && this.ball.getY()  <= this.players[0].getY() + this.players[0].getLength() && this.ball.getX()  - this.ball.getRadius() <= this.players[0].getX() + this.players[0].getWidth())
		{
			if(this.ball.getOffsetX() < 0){
				this.ball.changeHorizontalDirectionToOpposite();
				this.ball.increaseNumberOfBounces();
			}
			//check if speed up the ball
			if(this.ball.getY() - this.players[0].getY() - this.players[0].getLength()/2 < 7 && this.ball.getY() - this.players[0].getY() - this.players[0].getLength()/2 > -7)
			{
				this.ball.speedUp();
			 }
			 //check if change reflection angle of the ball
			else if (this.ball.getY() - this.ball.getRadius() < this.players[0].getY() || this.ball.getY() + this.ball.getRadius() > this.players[0].getY() + this.players[0].getLength())
			{
				this.ball.changeReflectionAngle();
			}
			 else
			 {
				this.ball.reset();
			 }
		}
	}
	
	play(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.draw();

		if (this.pause){
			switch(this.state) {
				case 0:
					this.showInfo('Wciśnij SPACJĘ, aby zacząć grę');
					break;
				case 2:
					this.resetPlayingField();
					this.showHeadline('Punkt dla gracza po prawej');
					this.showScores();
					this.showInfo('SPACJA - kontynuuj, N - zacznij od nowa');
					if(this.restart){ this.resetGame(); }
					break;
				case 3:
					this.resetPlayingField();
					this.showHeadline('Punkt dla gracza po lewej');
					this.showScores();
					this.showInfo('SPACJA - kontynuuj, N - zacznij od nowa');
					if(this.restart){ this.resetGame(); }
					break;
				default:
					this.showHeadline('Pauza');    
					this.showInfo('SPACJA - wznów grę, N - zacznij od nowa');
					if(this.restart){ this.resetGame(); }
			}
		} else {
			switch(this.state) {
				case 0:
				case 2:
				case 3: 
					this.setState(1);
					this.restart = false;
					this.ball.resetBounces();
					break;
				default:
					this.transformGame();
			}
		}
		requestAnimationFrame(this.play.bind(this));
	}
	
	showIntroduction(){
		alert("Gra Ping Pong,\n Zieloną paletką steruje się za pomocą klawiszy A oraz Z, natomiast czerwoną za pomocą K oraz M.\nGdy odbijesz piłkę na skraju paletki to zmieni kąt odbicia. \nGdy odbijesz piłkę środkiem paletki to piłka przyśpieszy. \nGdy odbijesz piłkę przyśpieszoną środkiem paletki, piłka dodatkowo przyśpieszy lub gdy odbijesz ją na skraju paletki dodatkowo zmieni kąt odbicia.");
	}
	
	showHeadline(message){
		ctx.font = '28px Helvetica';
		ctx.fillStyle = 'yellow';
		ctx.textAlign = 'center';
		ctx.fillText(message, canvas.width/2, 120);
	}

	showInfo(message){
		ctx.font = '16px Helvetica';
		ctx.fillStyle = 'blue';
		ctx.textAlign = 'center';
		ctx.fillText(message, canvas.width/2, 180);
	}

	showScores(){
		ctx.font = '48px Helvetica';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(this.players[0].points + " : " + this.players[1].points, canvas.width/2, 260);
		ctx.font = '22px Helvetica';
		ctx.fillStyle = '#ddd';
		ctx.fillText("Odbicia: " + this.ball.bounces, canvas.width/2, 300);
	}
}

function startNewGame(){

	game = new Game(new Ball(10, 'blue'), 
									new Paddle('Player 1', 'green', 65, 90), 
									new Paddle('Player 2', 'red', 75, 77)
									);
	game.listenForPressedKeys();
	game.play();
}

startNewGame();