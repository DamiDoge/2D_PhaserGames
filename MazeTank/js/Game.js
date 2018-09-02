var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
  create: function() {
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
	this.player.scale.setTo(0.80,0.80);
    this.game.physics.arcade.enable(this.player);
	
	//  Creates 10 bullets, using the 'bullet' graphic
    weapon = this.game.add.weapon(10, 'bullets');
      
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;
      
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 460;
      
    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(this.player, (this.player.height/2), (this.player.width/2));

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
	this.map.removeTile(1,1, 1);
	this.carveMaze(1,1);
	this.rooms = this.game.rnd.integerInRange(20, 40);
	for(i = 0; i < this.rooms; i++){
		this.carveRoom();	
	}
  },
  spawnPlayer: function(){
	var x = this.game.rnd.integerInRange(1, this.map.width - 1);
	while(this.game.math.isEven(x)){
		x = this.game.rnd.integerInRange(1, this.map.width - 1);
	}
	var y = this.game.rnd.integerInRange(1, this.map.height- 1);
	while(this.game.math.isEven(y)){
		y = this.game.rnd.integerInRange(1, this.map.height - 1);
	}
	var spawn = this.map.getTile(x,y);
    this.player = this.game.add.sprite(spawn.worldX, spawn.worldY, 'player');
	this.game.physics.arcade.overlap(this.player, this.blockedLayer, this.spawnPlayer, null, this);
  },
  carveMaze: function(x,y){
	  walk = this.game.rnd.integerInRange(1,4);
	  //go down
	  if(walk == 1 && y - 2 > 0 && this.map.getTile(x, y-2, 1) != null){
		  this.map.removeTile(x, y - 1, 1);
		  this.map.removeTile(x, y - 2, 1);
		  this.carveMaze(x, y - 2);
	  }
	  //go up
	  if(walk == 2 && y + 2 < this.map.height && this.map.getTile(x, y+2, 1) != null){
		  this.map.removeTile(x, y + 1, 1);
		  this.map.removeTile(x, y + 2, 1);
		  this.carveMaze(x, y + 2);
	  }
	  if(walk == 3 && x - 2 > 0 && this.map.getTile(x - 2,y, 1) != null){
		  this.map.removeTile(x - 1, y, 1);
		  this.map.removeTile(x - 2, y, 1);
		  this.carveMaze(x - 2, y);
	  }
	  if(walk == 4 && x + 2 < this.game.width && this.map.getTile(x + 2,y, 1) != null){
		  this.map.removeTile(x + 1, y, 1);
		  this.map.removeTile(x + 2, y, 1);
		  this.carveMaze(x + 2, y);
	  }
	  if(x - 2 > 0 && this.map.getTile(x - 2,y, 1) != null){
		  this.map.removeTile(x - 1, y, 1);
		  this.map.removeTile(x - 2, y, 1);
		  this.carveMaze(x - 2, y);
	  }
	  if(x + 2 < this.game.width && this.map.getTile(x + 2,y, 1) != null){
		  this.map.removeTile(x + 1, y, 1);
		  this.map.removeTile(x + 2, y, 1);
		  this.carveMaze(x + 2, y);
	  }
	  //if we cannot move in a random direction then go where able.
	  if(y - 2 > 0 && this.map.getTile(x, y-2, 1) != null){
		  this.map.removeTile(x, y - 1, 1);
		  this.map.removeTile(x, y - 2, 1);
		  this.carveMaze(x, y - 2);
	  }
	  //go up
	  if(y + 2 < this.map.height && this.map.getTile(x, y+2, 1) != null){
		  this.map.removeTile(x, y + 1, 1);
		  this.map.removeTile(x, y + 2, 1);
		  this.carveMaze(x, y + 2);
	  }
  },
  carveRoom: function(){
	roomLocationX = this.game.rnd.integerInRange(1, this.map.width-1);
	roomLocationY = this.game.rnd.integerInRange(1, this.map.height-1);
	roomWidth = this.game.rnd.integerInRange(5, 10);
	roomHeight = this.game.rnd.integerInRange(5, 10);
	var x = 0;
	var y = 0;
	while(x < roomWidth && x + roomLocationX < this.map.width - 2){
		while(y < roomHeight && roomLocationY + y < this.map.height - 2){
			this.map.removeTile(roomLocationX + x, roomLocationY + y, 1);
			y++;
		}
		this.map.removeTile(roomLocationX + x, roomLocationY + y, 1);
		x++;
	}
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createDoors: function() {
    //create doors
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    result = this.findObjectsByType('door', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.doors);
    }, this);
  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
        if(element.properties.type === type) {
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
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
    },
    destroyBullet: function(bullet, wall){
        bullet.kill();
        if(wall.alpha > 0)
        {
            wall.alpha = wall.alpha - 0.5;
            if(wall.alpha <= 0)
                {
                    this.map.removeTile(wall.x, wall.y, 1);
                }
        }
        else
        {
            this.map.removeTile(wall.x, wall.y, 1);
        }
        console.log("bullet destroy");
    },
    update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
	this.game.physics.arcade.collide(this.player, this.Perimeter);
    this.game.physics.arcade.collide(weapon.bullets, this.blockedLayer, this.destroyBullet, null, this);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

    //player movement
    this.player.body.velocity.x = 0;

    if (this.cursors.up.isDown) {
        if (this.player.body.velocity.y == 0)
            {
                this.player.body.velocity.y -= 200;
                this.player.frame = 3;
            } 
    } else if (this.cursors.down.isDown) {
        if (this.player.body.velocity.y == 0)
            {
                this.player.body.velocity.y += 200;
                this.player.frame = 1;
            }
    } else {
        this.player.body.velocity.y = 0;
    }
    if (this.cursors.left.isDown) {
        this.player.body.velocity.x -= 200;
        this.player.frame = 2;
    } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x += 200;
        this.player.frame = 0;
    }
	if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
       if (this.player.frame == 3){
           weapon.fireAngle = 270;
           weapon.fire();
       }
        
        if (this.player.frame == 1){
           weapon.fireAngle = 90;
           weapon.fire();
       }
       
        if (this.player.frame == 0){
           weapon.fireAngle = 0;
           weapon.fire();
       }
       
        if (this.player.frame == 2){
           weapon.fireAngle = 180;
           weapon.fire();
       }
	}
  },
};