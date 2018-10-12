var SpaceHipster = SpaceHipster || {};

SpaceHipster.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

SpaceHipster.global = {
	skillLevel : 'EASY',
	asteroidSize : 0
}

SpaceHipster.game.state.add('Boot', bootState);
SpaceHipster.game.state.add('Preload', loadState);
SpaceHipster.game.state.add('MainMenu', menuState);
SpaceHipster.game.state.add('Game', gameState);

SpaceHipster.game.state.start('Boot');