var menuState = {
	create: function () {
		game.music = game.add.audio('music'); // Add the music
		game.music.loop = true; // Make it loop
		game.music.volume = 0.6;// Set the volume
		if (!game.global.musicStart) {
			//Play the music when the play state starts
			game.music.play();
			game.global.musicStart = true;
			console.log("here");
		}
		// Add a background image
		game.add.image(0, 0, 'background');
		// Display the name of the game. Change the y position to -50 so we don't see the label initially
		var nameLabel = game.add.text(game.width / 2, -50, 'Super Coin Box', { font: '50px Arial', fill: '#ffffff' });
		nameLabel.anchor.setTo(0.5, 0.5);

		// If 'bestScore' is not defined. It means that this is the first time the game is played
		if (!localStorage.getItem('bestScore')) {
			// Then set the best score to 0
			localStorage.setItem('bestScore', 0);
		}
		// If the score is higher than the best score
		if (game.global.score > localStorage.getItem('bestScore')) {
			// Then update the best score
			localStorage.setItem('bestScore', game.global.score);
		}

		if (!localStorage.getItem('totalDeaths')) {
			localStorage.setItem('totalDeaths', 0);
		}
		else {
			// Then update the best score
			localStorage.setItem('totalDeaths', game.global.score);
		}
		//Tween the title.
		game.add.tween(nameLabel).to({ y: 80 }, 1000).start();
		game.add.tween(nameLabel).to({ y: 80 }, 1000).easing(Phaser.Easing.Bounce.Out).start();

		// Show the score at the center of the screen
		var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
		var scoreLabel = game.add.text(game.width / 2, game.height / 2, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
		scoreLabel.anchor.setTo(0.5, 0.5);

		// Store the relevant text based on the device used
		var text;
		if (game.device.desktop) {
			text = 'press the up arrow key to start';
		}
		else {
			text = 'touch the screen to start';
		}
		// Display the text variable
		var startLabel = game.add.text(game.width / 2, game.height - 80, text, { font: '25px Arial', fill: '#ffffff' });

		startLabel.anchor.setTo(0.5, 0.5);

		// Add the button that calls the 'toggleSound' function when pressed
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		// If the game is already muted, display the speaker with no sound
		this.muteButton.frame = game.sound.mute ? 1 : 0;

		game.add.tween(startLabel).to({ angle: -2 }, 500).to({ angle: 2 }, 1000).to({ angle: 0 }, 500).loop().start();

		// Create a new Phaser keyboard variable: the up arrow key
		// When pressed, call the 'start' function once
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.add(this.start, this);

		if (!game.device.desktop) {
			game.input.onDown.add(this.start, this);
		}
	},
	start: function () {
		// If we tap in the top left corner of the game on mobile
		if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
			// It means we want to mute the game, so we don't start the game
			return;
		}
		// Start the actual game
		game.global.score = 0;
		game.state.start('level1');
	},
	// Function called when the 'muteButton' is pressed
	toggleSound: function () {
		// Switch the variable from true to false, or false to true
		// When 'game.sound.mute = true', Phaser will mute the game
		game.sound.mute = !game.sound.mute;
		// Change the frame of the button
		this.muteButton.frame = game.sound.mute ? 1 : 0;
	},
};