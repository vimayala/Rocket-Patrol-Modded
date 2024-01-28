// Name: Victoria Ayala
// Title: Rocket Patrol Mini Game
// Time: ~8 hours (including time I took to mess up and take unsuccessful mods out)
// Modification 
// (detailed descriptions in  README.md):
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
// Implement mouse control for player movement and left mouse click to fire (5)
// Display the time remaining (in seconds) on the screen (3)
// Allow the player to control the Rocket after it's fired (1)
// Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)
// Music file source: https://opengameart.org/content/8-bit-epic-space-shooter-music



let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene : [ Menu, Play ]
}
let game = new Phaser.Game(config)
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, mouseInput, timedEvent, emitter, scoreConfig


let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3