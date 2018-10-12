// Initialize Phaser
var game = new Phaser.Game(400, 220, Phaser.AUTO, '');
// Define our global variable
game.global = {
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('Game', gameState);
// Start the 'boot' state
game.state.start('boot');