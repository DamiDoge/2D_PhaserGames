var gameState = {
	create: function () {
		//set world dimensions
		this.game.world.setBounds(0, 0, 1920, 1920);

		//background
		this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

		//create player
		this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
		this.player.scale.setTo(2);
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
		this.player.animations.play('fly');

		//  Our ships bullets
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		//  All 40 of them
		this.bullets.createMultiple(40, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);

		//player initial score of zero
		this.playerScore = 0;

		//enable player physics
		this.game.physics.arcade.enable(this.player);
		this.playerSpeed = 120;
		this.player.body.drag.set = 200;
		this.player.body.maxVelocity.set = 100;

		//the camera will follow the player in the world
		this.game.camera.follow(this.player);

		//generate game elements
		this.generateCollectables();
		this.generateAsteriods();

		//show score
		this.showLabels();

		//sounds
		this.explosionSound = this.game.add.audio('explosion');
		console.log(this.explosionSound);
		this.collectSound = this.game.add.audio('collect');

		SpaceHipster.global.asteroidSize = this.game.rnd.integerInRange(0, 100);
		//  Game input
		cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
		this.bulletTime = 0;

		if (!SpaceHipster.game.device.desktop) {
            this.addMobileInputs();
        }

        if (!SpaceHipster.game.device.desktop) {
            // Call 'orientationChange' when the device is rotated
            SpaceHipster.game.scale.onOrientationChange.add(this.orientationChange, this);

            // Create an empty label to write the error message if needed
            this.rotateLabel = SpaceHipster.game.add.text(SpaceHipster.game.width / 2, SpaceHipster.game.height / 2, '',
                { font: '30px Arial', fill: '#fff', backgroundColor: '#000000' });
            this.rotateLabel.anchor.setTo(0.5, 0.5);

            // Call the function at least once
            this.orientationChange();
        }
	},
	update: function () {
		//collision between player and asteroids
		this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
		//collision between bullet and asteroids
		this.game.physics.arcade.overlap(this.bullet, this.asteroids, this.destroyAsteroid, null, this);
		this.game.physics.arcade.collide(this.asteroids);

		if(SpaceHipster.game.device.desktop)
		{
			this.movePlayer();
		}

		this.screenWrap(this.player);
		this.bullets.forEachExists(this.screenWrap, this);
	
		//overlapping between player and collectables
		this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
	},
	destroyAsteroid(bullet, asteroid) {
		//play explosion sound
		this.explosionSound.play();

		//make the asteroid explode
		var emitter = this.game.add.emitter(asteroid.x, asteroid.y, 100);
		emitter.makeParticles('playerParticle');
		emitter.minParticleSpeed.setTo(-200, -200);
		emitter.maxParticleSpeed.setTo(200, 200);
		emitter.gravity = 0;
		emitter.start(true, 1000, null, 100);
		//Destroy the bullet and the asteroid.
		asteroid.kill();
		bullet.kill();
		//Create a new asteroid to replace the previous.
		this.generateAsteroid(asteroid);
	},
	orientationChange: function() {
		// If the game is in portrait (wrong orientation)
		if (SpaceHipster.game.scale.isPortrait) {
			// Pause the game and add a text explanation
			SpaceHipster.game.paused = true;
			this.rotateLabel.text = 'rotate your device in landscape';
		}
		// If the game is in landscape (good orientation)
		else {
			// Resume the game and remove the text
			SpaceHipster.game.paused = false;
			this.rotateLabel.text = '';
		}
	},
	addMobileInputs: function () {
        var xScale = SpaceHipster.game.width;
        var yScale = SpaceHipster.game.height;

        var upButton = SpaceHipster.game.add.sprite(64, yScale - 64, 'upButton');
        upButton.fixedToCamera = true;
        upButton.scale.x = 0.25;
        upButton.scale.y = 0.25;
        upButton.inputEnabled = true;
        upButton.alpha = 0.8;
        upButton.events.onInputOver.add(this.accelerate, this);
        upButton.events.onInputOut.add(this.decelerate, this);
        upButton.events.onInputDown.add(this.accelerate, this);
        upButton.events.onInputUp.add(this.decelerate, this);

        // Add the move left button
        var leftButton = SpaceHipster.game.add.sprite(0, yScale - 64, 'leftButton');
        leftButton.fixedToCamera = true;
        leftButton.scale.x = 0.25;
        leftButton.scale.y = 0.25;
        leftButton.inputEnabled = true;
        leftButton.alpha = 0.8;
        leftButton.events.onInputOver.add(this.turnLeft, this);
        leftButton.events.onInputOut.add(this.noTurn, this);
        leftButton.events.onInputDown.add(this.turnLeft, this);
        leftButton.events.onInputUp.add(this.noTurn, this);

        // Add the move right button
        var rightButton = SpaceHipster.game.add.sprite(128, yScale - 64, 'rightButton');
        rightButton.fixedToCamera = true;
        rightButton.scale.x = 0.25;
        rightButton.scale.y = 0.25;
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.8;
        rightButton.events.onInputOver.add(this.turnRight, this);
        rightButton.events.onInputOut.add(this.noTurn, this);
        rightButton.events.onInputDown.add(this.turnRight, this);
        rightButton.events.onInputUp.add(this.noTurn, this);

        var fireButton = SpaceHipster.game.add.sprite(xScale - 64, yScale - 64, 'fireButton');
        fireButton.fixedToCamera = true;
        fireButton.scale.x = 0.25;
        fireButton.scale.y = 0.25;
        fireButton.alpha = 0.8;
        fireButton.inputEnabled = true;
        fireButton.events.onInputOver.add(this.fireBullet, this);
        fireButton.events.onInputDown.add(this.fireBullet, this);
    },
	movePlayer: function () {
		if (cursors.up.isDown) {
			this.accelerate();
		}
		else {
			this.player.body.acceleration.set(0);
		}

		if (cursors.left.isDown) {
			this.turnLeft();
		}
		else if (cursors.right.isDown) {
			this.turnRight();
		}
		else {
			this.player.body.angularVelocity = 0;
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			this.fireBullet();
		}
	},
	accelerate: function () {
		this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 200, this.player.body.acceleration);
	},
	decelerate: function () {
		this.player.body.acceleration.set(0);
	},
	turnLeft: function () {
		this.player.body.angularVelocity = -300;
	},
	turnRight: function () {
		this.player.body.angularVelocity = 300;
	},
	noTurn: function () {
		this.player.body.angularVelocity = 0;
	},

	fireBullet: function () {
		//Check current time to the next time the bullet may be fired
		if (this.game.time.now > this.bulletTime) {
			this.bullet = this.bullets.getFirstExists(false);

			if (this.bullet) {
				//Place the bullet to the center of the player
				this.bullet.reset(this.player.body.x + this.player.width / 2, this.player.body.y + this.player.height / 2);
				this.bullet.lifespan = 2000;
				//with the same location.
				this.bullet.rotation = this.player.rotation;
				this.game.physics.arcade.velocityFromRotation(this.player.rotation, 400, this.bullet.body.velocity);
				this.bulletTime = this.game.time.now + 500;
			}
		}
	},

	screenWrap: function (sprite) {
		if (sprite.x < 0) {
			sprite.x = this.game.world.width;
		}
		else if (sprite.x > this.game.world.width) {
			sprite.x = 0;
		}

		if (sprite.y < 0) {
			sprite.y = this.game.world.height;
		}
		else if (sprite.y > this.game.world.height) {
			sprite.y = 0;
		}
	},

	generateCollectables: function () {
		this.collectables = this.game.add.group();

		//enable physics in them
		this.collectables.enableBody = true;
		this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

		//phaser's random number generator
		var numCollectables = this.game.rnd.integerInRange(100, 150)
		var collectable;

		for (var i = 0; i < numCollectables; i++) {
			//add sprite
			collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
			collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
			collectable.animations.play('fly');
		}
	},

	generateAsteriods: function () {
		this.asteroids = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		//enable physics in them
		this.asteroids.enableBody = true;
		var numAsteroids = 0;

		//phaser's random number generator
		if (SpaceHipster.global.skillLevel == 'EASY') {
			numAsteroids = this.game.rnd.integerInRange(50, 75);
		}
		if (SpaceHipster.global.skillLevel == 'MEDIUM') {
			numAsteroids = this.game.rnd.integerInRange(76, 100);
		}
		if (SpaceHipster.global.skillLevel == 'HARD') {
			numAsteroids = this.game.rnd.integerInRange(101, 125);
		}
		var asteroid;

		for (var i = 0; i < numAsteroids; i++) {
			this.generateAsteroid(asteroid);
		}
	},
	generateAsteroid: function (asteroid) {
		//create scale max and min for scale.
		var floor = 1;
		var ceiling = 1;
		//From 0 to 50% size create more small than big asteroids.
		if (SpaceHipster.global.asteroidSize <= 50) {
			ceiling += SpaceHipster.global.asteroidSize / 15;
		}
		//after 50% asteroid size bring up the minimum size an asteroid can be
		else {
			ceiling = 50 / 15;
			floor += (SpaceHipster.global.asteroidSize - 50) / 15;
		}
		asScale = this.game.rnd.integerInRange(floor, ceiling);
		//add sprite
		asteroid = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
		asteroid.scale.setTo(asScale);
		//physics properties. Decrease speed if the asteroid was scaled up.
		asteroid.body.velocity.x = this.game.rnd.integerInRange(-30, 30) / asScale;
		asteroid.body.velocity.y = this.game.rnd.integerInRange(-30, 30) / asScale;
		asteroid.body.bounce.x = 1;
		asteroid.body.bounce.y = 1;
		asteroid.body.immovable = false;
		asteroid.body.collideWorldBounds = true;
	},
	hitAsteroid: function (player, asteroid) {
		//play explosion sound
		this.explosionSound.play();

		//make the player explode
		var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
		emitter.makeParticles('playerParticle');
		emitter.minParticleSpeed.setTo(-200, -200);
		emitter.maxParticleSpeed.setTo(200, 200);
		emitter.gravity = 0;
		emitter.start(true, 1000, null, 100);
		this.player.kill();

		this.game.time.events.add(800, this.gameOver, this);
	},
	gameOver: function () {
		//pass it the score as a parameter 
		this.game.state.start('MainMenu', true, false, this.playerScore);
	},
	collect: function (player, collectable) {
		//play collect sound
		this.collectSound.play();

		//update score
		this.playerScore++;
		this.scoreLabel.text = this.playerScore;

		//remove sprite
		collectable.destroy();
	},
	showLabels: function () {
		//score text
		var text = "0";
		var style = { font: "20px Arial", fill: "#fff", align: "center" };
		this.scoreLabel = this.game.add.text(this.game.width - 50, this.game.height - 50, text, style);
		this.scoreLabel.fixedToCamera = true;
	}
};

/*
TODO

-audio
-asteriod bounch
*/
