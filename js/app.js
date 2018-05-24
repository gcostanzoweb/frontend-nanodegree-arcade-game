/* SCORE:
 * a global score is rendered on the game's canvas;
 * it's updated every time the player:
 * - hits an enemy
 * - reaches the water
 * - picks up a treasure
 * minimum and maximum values are 0 and 99,999.
 */

var score = 0;

// addScore increments / decrements the score
function addScore(sum) {
  if (score + sum < 0) score = 0;
  else if (score + sum > 99999) score = 99999;
  else score += sum;
}

/* AUDIO FILES:
 * a sound is played for specific events, such as when the player:
 * - moves
 * - hits an enemy
 * - reaches the water
 * - picks up a treasure
 */
// Credits for the audio files to http://freesound.org/
var audioFiles = {
  move: new Audio("audio/move.ogg"), // https://freesound.org/people/CommanderRobot/sounds/264828/
  damage: new Audio("audio/damage.wav"), // https://freesound.org/people/OwlStorm/sounds/404747/
  pick: new Audio("audio/pick.wav"), // https://freesound.org/people/sharesynth/sounds/341663/
  victory: new Audio("audio/victory.wav") // https://freesound.org/people/Chilljeremy/sounds/395482/
};
// Volume normalization, with 'damage's volume being the 'normal'
audioFiles["pick"].volume = 0.3;
audioFiles["move"].volume = 0.6;
audioFiles["victory"].volume = 0.3;

// sound plays the given audio file, resetting it if it was already playing
function sound(string) {
  audioFiles[string].currentTime = 0;
  audioFiles[string].play();
}

// Enemies our player must avoid
var Enemy = function(sp = 1) {
  /* speed is the amount of movement on the x axis over the interval,
		 * calculated on multiples of 50.
		 */
  this.speed = Math.floor(sp) * 50;
  // Enemies can start from either one side of the screen
  switch (Math.floor(Math.random() * 2)) {
    case 0:
      // starts from the left side (default behaviour)
      this.x = -101;
      // sets the sprite
      this.sprite = "images/enemy-bug.png";
      break;
    case 1:
    case 2:
      // starts from the right side
      this.x = 505;
      // set the inverted sprite if it starts from the right side
      this.sprite = "images/enemy-bug-rev.png";
      // invert the speed's direction if it starts from the right side
      this.speed *= -1;
      break;
  }
  // Pick a casual y value among the ones of the stone-block tiles
  this.y = Math.floor(Math.random() * 3 + 1) * 83;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  /* switch the sprite and the speed's direction when enemy gets
		 * to the other side of the screen, opposite to where it started from.
		 * Resets y to a casual valid value in that case.
		 */
  if (this.x > 505) {
    this.speed *= -1;
    this.x = 505;
    this.y = Math.floor(Math.random() * 3 + 1) * 83;
    this.sprite = "images/enemy-bug-rev.png";
  } else if (this.x < -101) {
    this.speed *= -1;
    this.x = -101;
    this.y = Math.floor(Math.random() * 3 + 1) * 83;
    this.sprite = "images/enemy-bug.png";
  }
  // otherwise, move position correctly
  else this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  // render slightly above position for aesthetic reasons
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 18);
};

// the player, takes input from the user
var Player = function() {
  // initial position
  this.x = 101 * 2;
  this.y = 83 * 5;
  this.sprite = "images/char-boy.png";
};

Player.prototype.handleInput = function(move) {
  // takes the key input from the eventListener
  var hor = 0,
    ver = 0;
  switch (move) {
    case "left":
      hor = -1;
      break;
    case "up":
      ver = -1;
      break;
    case "right":
      hor = 1;
      break;
    case "down":
      ver = 1;
      break;
  }
  // give horizontal / vertical movement to update player's position
  this.update(hor, ver);
};

Player.prototype.update = function(hor = 0, ver = 0) {
  // calculate new X and Y position
  var newX = this.x + 101 * hor,
    newY = this.y + 83 * ver;
  // checks for a valid horizontal movement
  if (newX != this.x && newX >= 0 && newX <= 101 * 4) {
    this.x = newX;
    // play a 'moving' sound
    sound("move");
  }
  // checks for reaching the water
  if (newY <= 0) {
    this.y = 83 * 5;
    // play a 'victory' sound
    sound("victory");
    // resets the treasure if it was hidden
    if (treasure.hidden) treasure = new Treasure();
    // increments the score of a fixed quantity
    addScore(500);
  }
  // checks for a valid vertical movement
  else if (newY != this.y && newY <= 83 * 5) {
    this.y = newY;
    // play a 'moving' sound
    sound("move");
  }
};

Player.prototype.render = function() {
  // render slightly above position for aesthetic reasons
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 18);
};

// TREASURE: a random treasure, can be picked up by player to increment the score
var Treasure = function() {
  // 'hidden' checks if the treasure has been taken
  this.hidden = false;
  // casual initial position
  this.x = Math.floor(Math.random() * 4) * 101;
  this.y = Math.floor(Math.random() * 3 + 1) * 83;
  switch (Math.floor(Math.random() * 4)) {
    // choose a random sprite and relative 'prize' value
    case 0:
      this.sprite = "images/GemBlue.png";
      this.prize = 100;
      break;
    case 1:
      this.sprite = "images/GemGreen.png";
      this.prize = 200;
      break;
    case 2:
      this.sprite = "images/GemOrange.png";
      this.prize = 300;
      break;
    case 3:
    case 4:
      this.sprite = "images/Star.png";
      this.prize = 500;
      break;
  }
};

Treasure.prototype.render = function() {
  // render slightly above position for aesthetic reasons
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 18);
};

// 'hide' hides the treasure to signal that it has been taken
Treasure.prototype.hide = function() {
  this.hidden = true;
  this.x = this.y = -200;
};

// instantiating a treasure, 4 enemies and a player
var treasure = new Treasure();
var allEnemies = [new Enemy(), new Enemy(2), new Enemy(3), new Enemy(4)];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
