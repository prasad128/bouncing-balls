// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var para = document.querySelector('.cnt');
var count = 25;



// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// parent class

class Shape{
  constructor(x, y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

// sub-class of Shape

class EvilCircle extends Shape{
  constructor(x, y, velX, velY, exists, color, size){
    super(x, y, 20, 20, exists);
  
    this.color = color;
    this.size = size;
  }
  // method to draw evil circle

  draw(){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  };
  
  // method to keep evil circle on the screen

  checkBounds(){
    if ((this.x + this.size) >= width) {
      this.x -= this.size;
    }
  
    if ((this.x - this.size) <= 0) {
      this.x += this.size;
    }
  
    if ((this.y + this.size) >= height) {
      this.y -= this.size;
    }
  
    if ((this.y - this.size) <= 0) {
      this.y += this.size;
    }
  
  };
  
  // method to move evil circle around the screen

  setControl(){
    var _this = this;
window.onkeydown = function(e) {
    if (e.keyCode === 37) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 39) {
      _this.x += _this.velX;
    } else if (e.keyCode === 38) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 40) {
      _this.y += _this.velY;
    }
  }
  };
  
  // method to eat existing balls

  collisionDetector(){
    for (var j = 0; j < balls.length; j++) {
      if (balls[j].exists === true) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.size + balls[j].size) {
          balls[j].exists = false;
          
          count--;
        }
      }
      if(count === 0){
        para.textContent = "Refresh to display balls";
      }
      else{
        para.textContent = "Balls count: " + count;
      }
    }
  };
}

// sub-class of class Shape

class Ball extends Shape{
  constructor(x, y , velX, velY, exists, color, size){
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }
  
  // method to draw balls on the screen

  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };
  
  // method to detect wall collisions

  update(){
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY
  };

  // method to detect ball collisions

  collisionDetect(){
    for (var j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
  };

}

// object instantiation of the EvilCircle class

var circleN = new EvilCircle(300,300,20,20,true,"white", 10);
circleN.setControl(); // method call

var balls = [];  // container to handle balls

// balls instantiation

while (balls.length < 25) {
  var size = random(10,20);
  var ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );

  balls.push(ball);
}

// loop to trigger method calls continously 

function loop() {
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);  // background color
  
  // loop for animation of balls

  for (var i = 0; i < balls.length; i++) {
    if(balls[i].exists === true){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
      
    }
    
  }
  
  // method calls to activate the evil circle

  circleN.draw();
  circleN.checkBounds();
  circleN.collisionDetector();

  requestAnimationFrame(loop);
}

loop();  // method call