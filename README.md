# Frogger 2: The Treasure Hunt

###A Udacity FEND Google Developer Nanodegree Project

This game was developed as a required project for the 2018 FEND Google Developer Nanodegree program from Udacity.

The game is a copy of the famous game Frogger, including basic game concepts such as:
- moving a player on the screen from the bottom to the top side to increase the score
- moving enemies on the screen, with random positions, directions, and speeds
- collision with enemies resets the player's position and decreases the score

This version also includes extra features such as:
- the aforementioned global score for the game
- treasures, to increase the score further before reaching the top side
- sounds playing during the base game events

Credits for files or lines of codes taken from other websites are written in the JS files where needed.

### How to start the game

There are two supported options as of now.
1. Download the project's folder and run the `index.html` file in your browser.
or
2. Play the game at the following link: [click](https://gcostanzoweb.github.io/udacity-google/fend/frontend-nanodegree-arcade-game/http:// "click")

### How to play the game

The game is controlled via the directional arrows keys. The player moves instantaneously to an adjacent square.

Getting too close to an enemy will cause a collision to happen: this will reset the player's position and decrease the score.

The main way to increase the score is to reach the top side of the screen (water row) without colliding with an enemy.

Additionally, a treasure will be available on the screen to be picked up to further increment the score. Once picked, the treasure will be resetted on the field once the player either reaches the water or collides with an enemy.

The game is in an endless mode, with maximum score setted at 99,999.
