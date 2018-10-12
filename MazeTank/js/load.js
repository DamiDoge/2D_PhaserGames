var loadState = {
    preload: function() 
    {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#0' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        //load game assets
        game.load.tilemap('level1', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'assets/tiles.png');
        game.load.image('greencup', 'assets/greencup.png');
        game.load.image('bluecup', 'assets/bluecup.png');
        game.load.spritesheet('player', 'assets/player.png', 16, 16, 4);
        game.load.image('browndoor', 'assets/browndoor.png');
	    game.load.image('bullets', 'assets/bullets.png');
        game.load.image('upButton', 'assets/upButton.png');
		game.load.image('rightButton', 'assets/rightButton.png');
		game.load.image('leftButton', 'assets/leftButton.png');
        game.load.image('downButton', 'assets/downButton.png');
        game.load.image('fireButton', 'assets/fireButton.png');
    },
    create: function() 
    {
        game.state.start('Game');
    }
};