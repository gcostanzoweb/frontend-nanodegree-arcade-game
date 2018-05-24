var score = 0;

function addScore(sum){
  if(score+sum<0) score = 0;
  else if(score+sum>99999) score = 99999;
  else score+=sum;
}

// Credits for the audio files to http://freesound.org/
var audioFiles = {
  move: new Audio('audio/move.ogg'), // https://freesound.org/people/CommanderRobot/sounds/264828/
  damage: new Audio('audio/damage.wav'), // https://freesound.org/people/OwlStorm/sounds/404747/
  pick: new Audio('audio/pick.wav'), // https://freesound.org/people/sharesynth/sounds/341663/
  victory: new Audio('audio/victory.wav') // https://freesound.org/people/Chilljeremy/sounds/395482/
}
// Volume normalization, with 'damage's volume being the 'normal'
audioFiles['pick'].volume = 0.3;
audioFiles['move'].volume = 0.6;
audioFiles['victory'].volume = 0.3;

function sound(string){
  audioFiles[string].currentTime = 0;
  audioFiles[string].play();
}

// Enemies our player must avoid
var Enemy = function(sp=1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -101;
    this.y = Math.floor(Math.random()*3+1)*83;
    this.speed = Math.floor(sp)*101/2;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x>=505){
        this.x = -101;
        this.y = Math.floor(Math.random()*3+1)*83;
    }else this.x += this.speed*dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-18);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
  this.x = 101*2;
  this.y = 83*5;
  this.sprite = 'images/char-boy.png';
}

Player.prototype.handleInput = function(move){
  var hor = 0, ver = 0;
  switch(move){
    case 'left':
      hor = -1; break;
    case 'up':
      ver = -1; break;
    case 'right':
      hor = 1; break;
    case 'down':
      ver = 1; break;
  }
  this.update(hor,ver);
}

Player.prototype.update = function(hor=0,ver=0){
  var newX = this.x+(101*hor), newY = this.y+(83*ver);
  if(newX!=this.x && newX>=0 && newX<=101*4){
     this.x = newX;
     sound('move');
   }
  if(newY<=0) {
    this.y = 83*5;
    sound('victory');
    if(treasure.hidden) treasure = new Treasure();
    addScore(500);
  }
  else if(newY != this.y && newY<=83*5){
    this.y = newY;
    sound('move');
  }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y-18);
};

var Treasure = function(){
  this.hidden = false;
  this.x = Math.floor(Math.random()*4)*101;
  this.y = Math.floor(Math.random()*3+1)*83;
  switch(Math.floor(Math.random()*4)){
    case 0:
      this.sprite = 'images/GemBlue.png';
      this.prize = 100;
      break;
    case 1:
      this.sprite = 'images/GemGreen.png';
      this.prize = 200;
      break;
    case 2:
      this.sprite = 'images/GemOrange.png';
      this.prize = 300;
      break;
    case 3: case 4:
      this.sprite = 'images/Star.png';
      this.prize = 500;
      break;
  }
}

Treasure.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y-18);
};

Treasure.prototype.hide = function(){
  this.hidden = true;
  this.x = this.y = -200;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var treasure = new Treasure();
var allEnemies = [new Enemy(), new Enemy(2), new Enemy(3), new Enemy(4)];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
