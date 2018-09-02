var loadState = {
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        // Load all our assets
        game.load.spritesheet('player', 'assets/player2.png', 20, 20);
        game.load.image('enemy', 'assets/downvote.png');
        game.load.image('coin', 'assets/dogecoin.png');
		game.load.image('jumpButton', 'assets/jumpButton.png');
		game.load.image('rightButton', 'assets/rightButton.png');
		game.load.image('leftButton', 'assets/leftButton.png');
        // Load the tileset information
		game.load.image('tileset', 'assets/tileset.png');
		game.load.tilemap('level1', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/map3.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('pixel', 'assets/pixel.png');
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        // Load a new asset that we will use in the menu state
        game.load.image('background', 'assets/background.png');
		// Sound when the player jumps
		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
		// Sound when the player takes a coin
		game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
		// Sound when the player dies
		game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
		// Game background music
		game.load.audio('music', ['assets/music.ogg', 'assets/music.mp3']);
		game.load.audio('music', ['assets/music.ogg', 'assets/music.ogg']);
    },
    create: function() {
        // Go to the menu state
        game.state.start('menu');
    }
};