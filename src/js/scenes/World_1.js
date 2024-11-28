
// general specs. I want to import this from config.js
const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;
const TILEDIMENSION = 64;

var cheatmode = false;

// bottom nav menu for each world
var hard_mode = true;
var easy_mode = false;

// map reference constants
const TILE_HIDDEN_DOOR = 16;
const TILE_OPEN_DOOR_LEFT = 0;
const TILE_OPEN_DOOR_LEFT_BLOCKED = 21;
const TILE_OPEN_DOOR_BOTTOM_BLOCKED = 22;
const TILE_HIDDEN_DOOR_UP = 17;
const TILE_OPEN_DOOR_UP = 14;
const TILE_NORMAL_FLOOR = 2;
const TILE_DEATH = 3;
const TILE_WALL_UP = 6;
const TILE_WALL_DOWN = 11;
const TILE_WALL_LEFT = 9;
const TILE_WALL_RIGHT = 13;
const TILE_WALL_FIXED = 20;
const TUPAC_SHOW = 19;

export default class World_1 extends Phaser.Scene {

  
  constructor() {
    super('World_1');
  }

  init() {

  }

  preload() {

    this.load.image('tiles', 'assets/img/world_1/world_1_tileset_64.png');

    this.load.tilemapCSV('level1', 'assets/world_maps/world_1_map/level_1.csv');
    this.load.tilemapCSV('level2', 'assets/world_maps/world_1_map/level_2.csv');
    this.load.tilemapCSV('level3', 'assets/world_maps/world_1_map/level_3.csv');

    // Loads nave menu button images (easy mode, hard mode, return to home)
    this.load.image('easy_on', 'assets/img/world_1/easy_on.png');
    this.load.image('easy_off', 'assets/img/world_1/easy_off.png');
    this.load.image('hard_on', 'assets/img/world_1/hard_on.png');
    this.load.image('hard_off', 'assets/img/world_1/hard_off.png');
    this.load.image('nav_home', 'assets/img/nav_home.png');
    this.load.image('nav_home_hover', 'assets/img/nav_home_hover.png');

    this.load.aseprite('paladin', 'assets/img/aseprite/paladin.png', 'assets/img/aseprite/paladin.json');
    this.load.aseprite('machango', 'assets/img/animation/mach_animation_all.png', 'assets/img/animation/mach_animation_all.json');
    
    this.load.atlas('keyTile', 'assets/img/world_1/key_tile_world_1.png', 'assets/img/world_1/key_tile_world_1.json');        
    this.load.atlas('door', 'assets/img/world_1/door.png', 'assets/img/world_1/door.json');
    this.load.atlas('doorUp', 'assets/img/world_1/door_top.png', 'assets/img/world_1/door_top.json');
    this.load.atlas('wall_animation', 'assets/img/world_1/wall_animation.png', 'assets/img/world_1/wall_animation.json');
    this.load.audio('death_fx', 'assets/audio/phaser_death_world_1.mp3');

    // Assets for End Game
    this.load.atlas('tupac_caged', 'assets/img/world_1/tupac_caged.png', 'assets/img/world_1/tupac_caged.json');
    this.load.atlas('tupac_reveal', 'assets/img/world_1/end_dialogue/tupac_reveal.png', 'assets/img/world_1/end_dialogue/tupac_reveal.json');

    // Sprite with one frame per second for final dialogue. ¿SE PUEDE MAS DESPACIO TODAVÍA?
    this.load.atlas('end_game', 'assets/img/world_1/end_dialogue/final_dialogue_animation.png', 'assets/img/world_1/end_dialogue/final_dialogue_animation.json');

    // SI NO SE PUEDE USAMOS LAS IMÁGENES SUELTAS CON setTimeout();
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_1.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_2.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_3.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_4.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_5.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_6.png');
    this.load.image('end_dialogue_1', 'assets/img/world_1/end_dialogue/end_dialogue_7.png');
  }

  create() {

    var map = this.make.tilemap({ key: 'level1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
    var tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 0, 0);       
    var layer = map.createLayer('layer', tileset, 0, 0);

    const HARD_MODE_BTN = this.add.image(64 * 1.5 + 32, 576 - 28, 'hard_on').setInteractive({ useHandCursor: true });
    const EASY_MODE_BTN = this.add.image(64 * 2.5 + 32, 576 - 28, 'easy_off').setInteractive({ useHandCursor: true });
    const HOME_BTN = this.add.image(64 * 4.5 + 32, 576 - 28, 'nav_home').setInteractive({ useHandCursor: true });

    HOME_BTN.on('pointerover', () => {

      HOME_BTN.setTexture('nav_home_hover');
    });

    HOME_BTN.on('pointerout', () => {

      HOME_BTN.setTexture('nav_home');
    });

    HOME_BTN.on('pointerdown', () => {

      this.scene.start('Screen_start');
      this.scene.stop('World_1');
      // map.destroy();
    });

    EASY_MODE_BTN.on('pointerover', () => {

        if (easy_mode === false && hard_mode === true) {

            EASY_MODE_BTN.setTexture('easy_on');
        }
    });

    EASY_MODE_BTN.on('pointerout', () => {

        if (easy_mode === false && hard_mode === true) {

            EASY_MODE_BTN.setTexture('easy_off');
        }
    });

    EASY_MODE_BTN.on('pointerdown', () => {

        if (easy_mode === false && hard_mode === true) {

            EASY_MODE_BTN.setTexture('easy_on');
            HARD_MODE_BTN.setTexture('hard_off');
            easy_mode = true;
            hard_mode = false;
        }
    });

    HARD_MODE_BTN.on('pointerover', () => {

        if (easy_mode === true && hard_mode === false) {

            HARD_MODE_BTN.setTexture('hard_on');
        }
    });

    HARD_MODE_BTN.on('pointerout', () => {

        if (easy_mode === true && hard_mode === false) {

            HARD_MODE_BTN.setTexture('hard_off');
        }
    });

    HARD_MODE_BTN.on('pointerdown', () => {

        if (easy_mode === true && hard_mode === false) {

            HARD_MODE_BTN.setTexture('hard_on');
            EASY_MODE_BTN.setTexture('easy_off');
            easy_mode = false;
            hard_mode = true;
        }
    });

    var numDeaths = 0;
    var isMoving = false;
    var lastDirection = 'right';
    var hasKey = false;
    var isDying = false;
    var doorSprite = null;
    var doorSpriteUp = null;

    const starting_pointX = TILEDIMENSION*7 + TILEDIMENSION/2;
    const starting_pointY = TILEDIMENSION + TILEDIMENSION/2;

    const key_level1X = TILEDIMENSION*5 + TILEDIMENSION/2;
    const key_level1Y = TILEDIMENSION*5 + TILEDIMENSION/2;

    const starting_level2X = TILEDIMENSION*7 + TILEDIMENSION/2;
    const starting_level2Y = TILEDIMENSION*4 + TILEDIMENSION/2;

    const key_level2X = TILEDIMENSION*2 + TILEDIMENSION/2;
    const key_level2Y = TILEDIMENSION*7 + TILEDIMENSION/2;

    const starting_level3X = TILEDIMENSION*4 + TILEDIMENSION/2;
    const starting_level3Y = TILEDIMENSION*7 + TILEDIMENSION/2;

    const key_level3X = TILEDIMENSION*5 + TILEDIMENSION/2;
    const key_level3Y = TILEDIMENSION*2 + TILEDIMENSION/2;

    const tupac_3x = TILEDIMENSION*4 + TILEDIMENSION/2;
    const tupac_3y = TILEDIMENSION*0.5 + TILEDIMENSION/2;

    var current_level = 0;

    const tags = this.anims.createFromAseprite('machango');
    const player = this.add.sprite(starting_pointX, starting_pointY).play({ key: 'idle_front', repeat: -1 }).setScale(1);

    this.death_fx = this.sound.add('death_fx', {
        loop: false,
        volume: 0.5
    })

    this.anims.create({ 
        key: 'keyTile', 
        frames: this.anims.generateFrameNames('keyTile', { prefix: 'keyTile_', end: 23, zeroPad: 4 }), 
        repeat: -1,
        frameRate: 8,
    });

    var keyTile = this.add.sprite(key_level1X, key_level1Y, 'keyTile');
    var keyTileAnim = keyTile.play('keyTile');
    

    // Modified door animation to play once and slower
    this.anims.create({ 
        key: 'door', 
        frames: this.anims.generateFrameNames('door'), 
        repeat: 0,  // 0 means play once
        frameRate: 8  // Lower number = slower animation (default is usually 24)
    });

    this.anims.create({ 
        key: 'doorUp', 
        frames: this.anims.generateFrameNames('doorUp'), 
        repeat: 0,  // 0 means play once
        frameRate: 8  // Lower number = slower animation (default is usually 24)
    });

    this.anims.create({ 
        key: 'wall_animation', 
        frames: this.anims.generateFrameNames('wall_animation'), 
        repeat: 0,  // 0 means play once
        frameRate: 8  // Lower number = slower animation (default is usually 24)
    });

    player.setDepth(1);
    keyTile.setDepth(1);
    layer.setDepth(0);

    function muerte(layer1, layer2) {
        layer.putTileAtWorldXY(TILE_WALL_FIXED, layer1, layer2);            
        numDeaths++;            
    }

    const createDoorAtTile = (tile) => {
        const doorX = tile.pixelX + TILEDIMENSION/2;
        const doorY = tile.pixelY + TILEDIMENSION/2;
        doorSprite = this.add.sprite(doorX, doorY, 'door').play('door');
        doorSprite.setDepth(1);
    }

    const createDoorUpAtTile = (tile) => {
        const doorX = tile.pixelX + TILEDIMENSION/2;
        const doorY = tile.pixelY + TILEDIMENSION/2;
        doorSpriteUp = this.add.sprite(doorX, doorY, 'doorUp').play('doorUp');
        doorSpriteUp.setDepth(1);
    }

    const revealAstro = (astro) => {

        if (astro === 'tupac') {

            this.anims.create({ 
                key: 'tupac_reveal', 
                frames: this.anims.generateFrameNames('tupac_reveal', { prefix: 'tupac_reveal_', end: 11, zeroPad: 4 }), 
                repeat: 0,
                frameRate: 8
            });
            
            var tupac_reveal = this.add.sprite(tupac_3x, tupac_3y, 'tupac_reveal');
            var tupac_revealAnim = tupac_reveal.play('tupac_reveal');

            //tupac_cagedAnim.destroy();
        }
    }

    const endWorld = () => {

        this.anims.create({
            key: 'end_game',
            frames: this.anims.generateFrameNames('end_game', {prefix: 'final_', end: 6, zeroPad: 2}),
            repeat: 0,
            frameRate: 1
        });

        this.add.sprite(300, 300, 'end_game').play('end_game');
    };

    const resetLevel = () => {
        hasKey = false;
        if (current_level === 0)
        {
            keyTile.setX(key_level1X);
            keyTile.setY(key_level1Y);
            keyTile.setVisible(true);
        }
        else if (current_level === 1)
        {
            if (doorSprite) {
                doorSprite.destroy();
                doorSprite = null;
            }
            keyTile.setX(key_level2X);
            keyTile.setY(key_level2Y);
            keyTile.setVisible(true);
        }
        else if (current_level === 2)
        {
            keyTile.setX(key_level3X);
            keyTile.setY(key_level3Y);
        
            if (doorSpriteUp) {
                doorSpriteUp.destroy();
                doorSpriteUp = null;
            }

            keyTile.setVisible(true);

            this.anims.create({ 
                key: 'tupac_caged', 
                frames: this.anims.generateFrameNames('tupac_caged', { prefix: 'tupac_caged_', end: 11, zeroPad: 4 }), 
                repeat: -1,
                frameRate: 18
            });
            
            var tupac_caged = this.add.sprite(tupac_3x, tupac_3y, 'tupac_caged');
            var tupac_cagedAnim = tupac_caged.play('tupac_caged');

        }
    }

    const respawnPlayer = (targetX, targetY) => {
        player.x = targetX;
        player.y = targetY;
        player.flipX = false;
        lastDirection = 'right';
        isDying = false;
        player.play({ key: 'idle_front', repeat: -1 });
    }
    

    const handleDeath = (newX, newY) => {
        if (isDying) return;
        
        isDying = true;
        muerte(newX, newY);
        update_labels(numDeaths, current_level);
    
        this.death_fx.play();
    
        let deathTile = layer.getTileAtWorldXY(newX, newY);
        
        let wallAnimation = this.add.sprite(deathTile.pixelX + TILEDIMENSION/2, deathTile.pixelY + TILEDIMENSION/2, 'wall_animation');
        wallAnimation.play('wall_animation');
        
        let targetX, targetY;
        if (current_level === 0) {
            targetX = starting_pointX;
            targetY = starting_pointY;
        } else if (current_level === 1) {
            targetX = starting_level2X;
            targetY = starting_level2Y;
        } else {
            targetX = starting_level3X;
            targetY = starting_level3Y;
        }
    
        // Choose death animation based on last direction
        let deathAnimation;
        if (lastDirection === 'left') {
            deathAnimation = 'die_left';
        } else if (lastDirection === 'right') {
            deathAnimation = 'die_right';
        } else if (lastDirection === 'up') {
            deathAnimation = 'die_up';
        } else {
            deathAnimation = 'die_down';
        }
    
        player.play({
            key: deathAnimation,
            repeat: 0,
            frameRate: 10,
            onComplete: () => {
                this.time.delayedCall(100, () => {
                    respawnPlayer(targetX, targetY);
                });
            }
        });
    
        this.time.delayedCall(1000, () => {
            if (isDying) {
                respawnPlayer(targetX, targetY);
            }
        });
    
        if (deathTile && deathTile.index === TILE_DEATH) {
            layer.putTileAt(TILE_WALL_FIXED, deathTile.x, deathTile.y);
        }
    };

    this.input.keyboard.on('keydown-A', event => {
        if (!isMoving && !isDying) movePlayer(-TILEDIMENSION, 0, 'left');
    });

    this.input.keyboard.on('keydown-D', event => {
        if (!isMoving && !isDying) movePlayer(TILEDIMENSION, 0, 'right');
    });

    this.input.keyboard.on('keydown-W', event => {
        if (!isMoving && !isDying) movePlayer(0, -TILEDIMENSION, 'up');
    });

    this.input.keyboard.on('keydown-S', event => {
        if (!isMoving && !isDying) movePlayer(0, TILEDIMENSION, 'down');
    });

    this.input.keyboard.on('keydown-O', event => {
        cheatmode = !cheatmode;
    });

    this.input.on('pointerdown', pointer => {
        if (isMoving || isDying) return;
        
        const deltaX = pointer.worldX - player.x;
        const deltaY = pointer.worldY - player.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                movePlayer(TILEDIMENSION, 0, 'right');
            } else {
                movePlayer(-TILEDIMENSION, 0, 'left');
            }
        } else {
            if (deltaY > 0) {
                movePlayer(0, TILEDIMENSION, 'down');
            } else {
                movePlayer(0, -TILEDIMENSION, 'up');
            }
        }
    });

    const movePlayer = (deltaX, deltaY, direction) => {
        const newX = player.x + deltaX;
        const newY = player.y + deltaY;
        const tile = layer.getTileAtWorldXY(newX, newY, true);
    
        if (direction === 'left') {            
            lastDirection = 'left';
            player.play({ key: 'walk_left', repeat: 0 });
        } else if (direction === 'right') {            
            lastDirection = 'right';
            player.play({ key: 'walk_right', repeat: 0 });
        } else if (direction === 'up') {
            lastDirection = 'up';
            player.play({ key: 'walk_up', repeat: 0 });
        } else if (direction === 'down') {
            lastDirection = 'down';
            player.play({ key: 'walk_down', repeat: 0 });
        }
    
        if (!hasKey && newX === keyTile.x && newY === keyTile.y) {
            hasKey = true;
            keyTile.setVisible(false);
            map.forEachTile(tile => {
                if (tile.index === TILE_HIDDEN_DOOR) {
                    createDoorAtTile(tile);
                    tile.index = TILE_OPEN_DOOR_LEFT;
                }
                if (tile.index === TILE_HIDDEN_DOOR_UP) {
                    createDoorUpAtTile(tile);
                    tile.index = TILE_OPEN_DOOR_UP;
                }
                if (current_level === 2) {
                    revealAstro("tupac");
                    endWorld();
                }
            });
        }
    
        if ([TILE_OPEN_DOOR_BOTTOM_BLOCKED,TILE_OPEN_DOOR_LEFT_BLOCKED, TILE_WALL_FIXED, TILE_WALL_DOWN, TILE_WALL_LEFT, TILE_WALL_RIGHT, TILE_WALL_UP, TILE_HIDDEN_DOOR, TILE_HIDDEN_DOOR_UP].includes(tile.index)) 
        {
            return;
        }
          else if (tile.index === TILE_OPEN_DOOR_LEFT || tile.index === TILE_OPEN_DOOR_UP) {
            map.destroy();
            let targetX, targetY;                
            if (current_level === 0) {
                map = this.make.tilemap({ key: 'level2', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                targetX = starting_level2X;
                targetY = starting_level2Y;
                current_level++;
            } else if (current_level === 1) {
                map = this.make.tilemap({ key: 'level3', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                targetX = starting_level3X;
                targetY = starting_level3Y;


                current_level++;
            } else {
                current_level = 0;
                map = this.make.tilemap({ key: 'level1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                targetX = starting_pointX;
                targetY = starting_pointY;
            }
    
            player.x = targetX;
            player.y = targetY;
            player.flipX = false;
            lastDirection = 'right';
            player.play({ key: 'idle_front', repeat: -1 });
    
            tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 0, 0);
            layer = map.createLayer(0, tileset, 0, 0);
            update_labels(numDeaths, current_level);
            resetLevel();


        } else if (tile && tile.index === TILE_DEATH && !cheatmode) {
            handleDeath(tile.pixelX + TILEDIMENSION/2, tile.pixelY + TILEDIMENSION/2);
            layer.putTileAt(TILE_WALL_FIXED, tile.x, tile.y);
            return;
        } else {
            isMoving = true;
            //player.play({ key: 'walk_down', repeat: -1 });

            this.tweens.add({
                targets: player,
                x: newX,
                y: newY,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    isMoving = false;
                    //player.play({ key: 'idle_front', repeat: -1 });
                }
            });
        }
    }
  }

  showChatBubble(text, playerX, playerY) {
    // Create the bubble background
    let bubbleWidth = 200;
    let bubbleHeight = 80;
    let bubblePadding = 10;
    let arrowHeight = bubbleHeight / 4;

    // Position the bubble above the player
    let bubbleX = playerX - bubbleWidth / 2;
    let bubbleY = playerY - bubbleHeight - arrowHeight - 10; // 10 pixels above the player

    let bubble = this.add.graphics({ x: bubbleX, y: bubbleY });

    // Bubble background
    bubble.fillStyle(0xf2f113, 1);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.lineStyle(4, 0x565656, 1);
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    // Bubble arrow
    bubble.fillTriangle(
        bubbleWidth / 2 - arrowHeight, bubbleHeight,
        bubbleWidth / 2 + arrowHeight, bubbleHeight,
        bubbleWidth / 2, bubbleHeight + arrowHeight
    );
    bubble.lineStyle(4, 0x565656, 1);
    bubble.strokeTriangle(
        bubbleWidth / 2 - arrowHeight, bubbleHeight,
        bubbleWidth / 2 + arrowHeight, bubbleHeight,
        bubbleWidth / 2, bubbleHeight + arrowHeight
    );

    // Add text to the bubble
    let bubbleText = this.add.text(0, 0, text, {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#000000',
        align: 'center',
        wordWrap: { width: bubbleWidth - bubblePadding * 2 }
    });

    // Center the text in the bubble
    let b = bubbleText.getBounds();
    bubbleText.setPosition(
        bubble.x + bubbleWidth / 2 - b.width / 2,
        bubble.y + bubbleHeight / 2 - b.height / 2
    );

    // Destroy the bubble and text after 3 seconds
    this.time.delayedCall(1000, () => {
        bubble.destroy();
        bubbleText.destroy();
    });
  }
}

function update_labels(num_deaths, num_level) {
    var temp_level = num_level + 1;    
    const level_label = document.getElementById('level_label');
    level_label.textContent = 'Level ' + temp_level;
    const deaths_label = document.getElementById('deaths_label');
    deaths_label.textContent = 'Deaths: ' + num_deaths;
}