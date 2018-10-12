var loadState = {
  preload: function () {
    // Add a 'loading...' label on the screen
    var loadingLabel = SpaceHipster.game.add.text(SpaceHipster.game.width / 2, 150, 'loading...', { font: '30px Arial', fill: '#0' });
    loadingLabel.anchor.setTo(0.5, 0.5);
    // Display the progress bar
    var progressBar = SpaceHipster.game.add.sprite(SpaceHipster.game.width / 2, 200, 'preloadbar');
    progressBar.anchor.setTo(0.5, 0.5);
    SpaceHipster.game.load.setPreloadSprite(progressBar);

    //load game assets
    SpaceHipster.game.load.image('easyButton', 'assets/images/easyButton.png');
    SpaceHipster.game.load.image('mediumButton', 'assets/images/mediumButton.png');
    SpaceHipster.game.load.image('hardButton', 'assets/images/hardButton.png');
    SpaceHipster.game.load.image('space', 'assets/images/space.png');
    SpaceHipster.game.load.image('rock', 'assets/images/rock1.png');
    SpaceHipster.game.load.image('bullet', 'assets/images/bullets1.png');
    SpaceHipster.game.load.spritesheet('playership', 'assets/images/ship.png');
    SpaceHipster.game.load.spritesheet('power', 'assets/images/power.png', 12, 12);
    SpaceHipster.game.load.image('playerParticle', 'assets/images/player-particle.png');
    SpaceHipster.game.load.audio('collect', 'assets/audio/collect.ogg');
    SpaceHipster.game.load.audio('explosion', 'assets/audio/explosion.ogg');
    SpaceHipster.game.load.image('upButton', 'assets/images/upButton.png');
    SpaceHipster.game.load.image('rightButton', 'assets/images/rightButton.png');
    SpaceHipster.game.load.image('leftButton', 'assets/images/leftButton.png');
    SpaceHipster.game.load.image('downButton', 'assets/images/downButton.png');
    SpaceHipster.game.load.image('fireButton', 'assets/images/fireButton.png');
  },
  create: function () {
    SpaceHipster.game.state.start('MainMenu');
  }
};