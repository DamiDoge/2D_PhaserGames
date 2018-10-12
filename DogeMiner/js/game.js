// Initialize Phaser
var game = new Phaser.Game(500, 340);
// Define our global variable
game.global = {
    score: 0,
	death: 0,
    playerx: game.width/3,
    musicStart: false
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('level1', level1State);
game.state.add('level2', level2State);
game.state.add('level3', level3State);
// Start the 'boot' state
game.state.start('boot');