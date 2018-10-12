var gameState = {
    create: function () {

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            fire: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        };

        this.map = this.game.add.tilemap('level1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('tiles', 'gameTiles');

        //create layer
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        this.Perimeter = this.map.createLayer('Perimeter');

        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
        this.map.setCollisionBetween(1, 2000, true, 'Perimeter');


        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();

        this.createItems();
        this.createDoors();

        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.spawnPlayer();
        this.player.scale.setTo(0.80, 0.80);
        this.game.physics.arcade.enable(this.player);

        //  Creates 10 bullets, using the 'bullet' graphic
        weapon = game.add.weapon(10, 'bullets');

        //  The bullet will be automatically killed when it leaves the world bounds
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        //  The speed at which the bullet is fired
        weapon.bulletSpeed = 400;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.fireRate = 460;

        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        weapon.trackSprite(this.player, (this.player.height / 2), (this.player.width / 2));

        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.map.removeTile(1, 1, 1);
        this.carveMaze(1, 1);
        this.rooms = this.game.rnd.integerInRange(20, 40);
        for (i = 0; i < this.rooms; i++) {
            this.carveRoom();
        }
        if (!game.device.desktop) {
            this.addMobileInputs();
        }

        if (!game.device.desktop) {
            // Call 'orientationChange' when the device is rotated
            game.scale.onOrientationChange.add(this.orientationChange, this);

            // Create an empty label to write the error message if needed
            this.rotateLabel = game.add.text(game.width / 2, game.height / 2, '',
                { font: '30px Arial', fill: '#fff', backgroundColor: '#000000' });
            this.rotateLabel.anchor.setTo(0.5, 0.5);

            // Call the function at least once
            this.orientationChange();
        }
    },
    update: function () {
        //collision
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.player, this.Perimeter);
        this.game.physics.arcade.collide(weapon.bullets, this.blockedLayer, this.destroyBullet, null, this);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        this.movePlayer();
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.fireWeapon();
        }
    },
    orientationChange: function() {
		// If the game is in portrait (wrong orientation)
		if (game.scale.isPortrait) {
			// Pause the game and add a text explanation
			game.paused = true;
			this.rotateLabel.text = 'rotate your device in landscape';
		}
		// If the game is in landscape (good orientation)
		else {
			// Resume the game and remove the text
			game.paused = false;
			this.rotateLabel.text = '';
		}
	},
    addMobileInputs: function () {
        var xScale = game.width;
        var yScale = game.height;

        // Movement variables
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        var upButton = game.add.sprite(64, yScale - 128, 'upButton');
        upButton.fixedToCamera = true;
        upButton.scale.x = 0.25;
        upButton.scale.y = 0.25;
        upButton.inputEnabled = true;
        upButton.alpha = 0.8;
        upButton.events.onInputOver.add(this.setUpTrue, this);
        upButton.events.onInputOut.add(this.setUpFalse, this);
        upButton.events.onInputDown.add(this.setUpTrue, this);
        upButton.events.onInputUp.add(this.setUpFalse, this);

        var downButton = game.add.sprite(64, yScale - 64, 'downButton');
        downButton.fixedToCamera = true;
        downButton.scale.x = 0.25;
        downButton.scale.y = 0.25;
        downButton.inputEnabled = true;
        downButton.alpha = 0.8;
        downButton.events.onInputOver.add(this.setDownTrue, this);
        downButton.events.onInputOut.add(this.setDownFalse, this);
        downButton.events.onInputDown.add(this.setDownTrue, this);
        downButton.events.onInputUp.add(this.setDownFalse, this);

        // Add the move left button
        var leftButton = game.add.sprite(0, yScale - 64, 'leftButton');
        leftButton.fixedToCamera = true;
        leftButton.scale.x = 0.25;
        leftButton.scale.y = 0.25;
        leftButton.inputEnabled = true;
        leftButton.alpha = 0.8;
        leftButton.events.onInputOver.add(this.setLeftTrue, this);
        leftButton.events.onInputOut.add(this.setLeftFalse, this);
        leftButton.events.onInputDown.add(this.setLeftTrue, this);
        leftButton.events.onInputUp.add(this.setLeftFalse, this);

        // Add the move right button
        var rightButton = game.add.sprite(128, yScale - 64, 'rightButton');
        rightButton.fixedToCamera = true;
        rightButton.scale.x = 0.25;
        rightButton.scale.y = 0.25;
        rightButton.inputEnabled = true;
        rightButton.alpha = 0.8;
        rightButton.events.onInputOver.add(this.setRightTrue, this);
        rightButton.events.onInputOut.add(this.setRightFalse, this);
        rightButton.events.onInputDown.add(this.setRightTrue, this);
        rightButton.events.onInputUp.add(this.setRightFalse, this);

        var fireButton = game.add.sprite(xScale - 64, yScale - 64, 'fireButton');
        fireButton.fixedToCamera = true;
        fireButton.scale.x = 0.25;
        fireButton.scale.y = 0.25;
        fireButton.alpha = 0.8;
        fireButton.inputEnabled = true;
        fireButton.events.onInputOver.add(this.fireWeapon, this);
        fireButton.events.onInputDown.add(this.fireWeapon, this);
    },
    setLeftTrue: function () {
        this.moveLeft = true;
    },
    setLeftFalse: function () {
        this.moveLeft = false;
    },
    setRightTrue: function () {
        this.moveRight = true;
    },
    setRightFalse: function () {
        this.moveRight = false;
    },
    setUpTrue: function () {
        this.moveUp = true;
    },
    setUpFalse: function () {
        this.moveUp = false;
    },
    setDownTrue: function () {
        this.moveDown = true;
    },
    setDownFalse: function () {
        this.moveDown = false;
    },
    spawnPlayer: function () {
        var x = this.game.rnd.integerInRange(1, this.map.width - 1);
        while (this.game.math.isEven(x)) {
            x = this.game.rnd.integerInRange(1, this.map.width - 1);
        }
        var y = this.game.rnd.integerInRange(1, this.map.height - 1);
        while (this.game.math.isEven(y)) {
            y = this.game.rnd.integerInRange(1, this.map.height - 1);
        }
        var spawn = this.map.getTile(x, y);
        this.player = this.game.add.sprite(spawn.worldX, spawn.worldY, 'player');
        this.game.physics.arcade.overlap(this.player, this.blockedLayer, this.spawnPlayer, null, this);
    },
    carveMaze: function (x, y) {
        walk = this.game.rnd.integerInRange(1, 4);
        //go down
        if (walk == 1 && y - 2 > 0 && this.map.getTile(x, y - 2, 1) != null) {
            this.map.removeTile(x, y - 1, 1);
            this.map.removeTile(x, y - 2, 1);
            this.carveMaze(x, y - 2);
        }
        //go up
        if (walk == 2 && y + 2 < this.map.height && this.map.getTile(x, y + 2, 1) != null) {
            this.map.removeTile(x, y + 1, 1);
            this.map.removeTile(x, y + 2, 1);
            this.carveMaze(x, y + 2);
        }
        if (walk == 3 && x - 2 > 0 && this.map.getTile(x - 2, y, 1) != null) {
            this.map.removeTile(x - 1, y, 1);
            this.map.removeTile(x - 2, y, 1);
            this.carveMaze(x - 2, y);
        }
        if (walk == 4 && x + 2 < this.game.width && this.map.getTile(x + 2, y, 1) != null) {
            this.map.removeTile(x + 1, y, 1);
            this.map.removeTile(x + 2, y, 1);
            this.carveMaze(x + 2, y);
        }
        if (x - 2 > 0 && this.map.getTile(x - 2, y, 1) != null) {
            this.map.removeTile(x - 1, y, 1);
            this.map.removeTile(x - 2, y, 1);
            this.carveMaze(x - 2, y);
        }
        if (x + 2 < this.game.width && this.map.getTile(x + 2, y, 1) != null) {
            this.map.removeTile(x + 1, y, 1);
            this.map.removeTile(x + 2, y, 1);
            this.carveMaze(x + 2, y);
        }
        //if we cannot move in a random direction then go where able.
        if (y - 2 > 0 && this.map.getTile(x, y - 2, 1) != null) {
            this.map.removeTile(x, y - 1, 1);
            this.map.removeTile(x, y - 2, 1);
            this.carveMaze(x, y - 2);
        }
        //go up
        if (y + 2 < this.map.height && this.map.getTile(x, y + 2, 1) != null) {
            this.map.removeTile(x, y + 1, 1);
            this.map.removeTile(x, y + 2, 1);
            this.carveMaze(x, y + 2);
        }
    },
    carveRoom: function () {
        roomLocationX = this.game.rnd.integerInRange(1, this.map.width - 1);
        roomLocationY = this.game.rnd.integerInRange(1, this.map.height - 1);
        roomWidth = this.game.rnd.integerInRange(5, 10);
        roomHeight = this.game.rnd.integerInRange(5, 10);
        var x = 0;
        var y = 0;
        while (x < roomWidth && x + roomLocationX < this.map.width - 2) {
            while (y < roomHeight && roomLocationY + y < this.map.height - 2) {
                this.map.removeTile(roomLocationX + x, roomLocationY + y, 1);
                y++;
            }
            this.map.removeTile(roomLocationX + x, roomLocationY + y, 1);
            x++;
        }
    },
    createItems: function () {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },
    createDoors: function () {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    },

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function (type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    //create a sprite from an object
    createFromTiledObject: function (element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    },
    destroyBullet: function (bullet, wall) {
        bullet.kill();
        if (wall.alpha > 0) {
            wall.alpha = wall.alpha - 0.5;
            if (wall.alpha <= 0) {
                this.map.removeTile(wall.x, wall.y, 1);
            }
        }
        else {
            this.map.removeTile(wall.x, wall.y, 1);
        }
        console.log("bullet destroy");
    },
    fireWeapon: function () {
    {
            if (this.player.frame == 3) {
                weapon.fireAngle = 270;
                weapon.fire();
            }

            if (this.player.frame == 1) {
                weapon.fireAngle = 90;
                weapon.fire();
            }

            if (this.player.frame == 0) {
                weapon.fireAngle = 0;
                weapon.fire();
            }
            if (this.player.frame == 2) {
                weapon.fireAngle = 180;
                weapon.fire();
            }
        }
    },
    movePlayer: function () {
        //player movement
        this.player.body.velocity.x = 0;
        // If 0 finger are touching the screen
        if (game.input.totalActivePointers == 0) {
            // Make sure the player is not moving
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;
        }
        if (this.cursors.up.isDown || this.wasd.up.isDown || this.moveUp) {
            if (this.player.body.velocity.y == 0) {
                this.player.body.velocity.y -= 200;
                this.player.frame = 3;
            }
        }
        else if (this.cursors.down.isDown || this.wasd.down.isDown || this.moveDown) {
            if (this.player.body.velocity.y == 0) {
                this.player.body.velocity.y += 200;
                this.player.frame = 1;
            }
        }
        else {
            this.player.body.velocity.y = 0;
        }
        if (this.cursors.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.body.velocity.x -= 200;
            this.player.frame = 2;
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.player.body.velocity.x += 200;
            this.player.frame = 0;
        }
    }
};