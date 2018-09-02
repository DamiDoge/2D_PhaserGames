var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tiles.png');
    this.load.image('greencup', 'assets/greencup.png');
    this.load.image('bluecup', 'assets/bluecup.png');
    this.load.spritesheet('player', 'assets/player.png', 16, 16, 4);
    this.load.image('browndoor', 'assets/browndoor.png');
	this.load.image('bullets', 'assets/bullets.png');
    
  },
  create: function() {
    this.state.start('Game');
  }
};