class Example extends Phaser.Scene {
    preload() {
        this.load.image('tiles', 'assets/img/64x64/map_tileset_64.png');        
        this.load.image('machango', 'assets/img/64x64/knight_64.png');
        this.load.tilemapCSV('level1', 'assets/level_1.csv');
        this.load.tilemapCSV('level2', 'assets/level_2.csv');
        this.load.tilemapCSV('level3', 'assets/level_3.csv');
        this.load.aseprite('paladin', 'assets/img/aseprite/paladin.png', 'assets/img/aseprite/paladin.json');
        this.load.atlas('keyTile', 'assets/img/animation/key_tile_animation_imgset.png', 'assets/img/animation/key_animation.json');
    }

    create() {
        const TILEDIMENSION = 64;
        var cheatmode = false;
        var map = this.make.tilemap({ key: 'level1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 0, 0);
        var layer = map.createLayer('layer', tileset, 0, 0);
    
        var numDeaths = 0;
        var isMoving = false;
        var lastDirection = 'right';
        var hasKey = false;
        var isDying = false;
    
        const starting_pointX = TILEDIMENSION + TILEDIMENSION/2;
        const starting_pointY = TILEDIMENSION + TILEDIMENSION/2;

        const key_level1X = TILEDIMENSION*5 + TILEDIMENSION/2;
        const key_level1Y = TILEDIMENSION*5 + TILEDIMENSION/2;

        const starting_level2X = TILEDIMENSION*7 + TILEDIMENSION/2;
        const starting_level2Y = TILEDIMENSION*4 + TILEDIMENSION/2;

        const key_level2X = TILEDIMENSION*2 + TILEDIMENSION/2;
        const key_level2Y = TILEDIMENSION*7 + TILEDIMENSION/2;

        const starting_level3X = TILEDIMENSION*4 + TILEDIMENSION/2;
        const starting_level3Y = TILEDIMENSION*6 + TILEDIMENSION/2;

        const key_level3X = TILEDIMENSION*5 + TILEDIMENSION/2;
        const key_level3Y = TILEDIMENSION*5 + TILEDIMENSION/2;

        var current_level = 0;
    
        const tags = this.anims.createFromAseprite('paladin');
        const player = this.add.sprite(starting_pointX, starting_pointY).play({ key: 'Idle fight', repeat: -1 }).setScale(1);

        this.anims.create({ key: 'keyTile', frames: this.anims.generateFrameNames('keyTile', { prefix: 'keyTile_', end: 11, zeroPad: 4 }), repeat: -1 });
        var keyTile = this.add.sprite(key_level1X, key_level1Y, 'gems').play('keyTile');

        player.setDepth(1);
        keyTile.setDepth(1);
        layer.setDepth(0);
    
        function muerte(layer1, layer2) {
            layer.putTileAtWorldXY(2, layer1, layer2);            
            numDeaths++;
            text_deaths.setText('Deaths: ' + numDeaths);
        }

        const resetLevel = () => {
            hasKey = false;
            if (current_level === 0)
            {
                keyTile.setX(key_level1X);
                keyTile.setY(key_level1Y);
            }
            else if (current_level === 1)
            {
                keyTile.setX(key_level2X);
                keyTile.setY(key_level2Y);
            }
            else if (current_level === 2)
            {
                keyTile.setX(key_level3X);
                keyTile.setY(key_level3Y);
            }            
            keyTile.setVisible(true);
        }

        const respawnPlayer = (targetX, targetY) => {
            player.x = targetX;
            player.y = targetY;
            player.flipX = false;
            lastDirection = 'right';
            isDying = false;
            player.play({ key: 'Idle fight', repeat: -1 });
            //resetLevel();
        }

        const handleDeath = (newX, newY) => {
            if (isDying) return;
            
            isDying = true;
            muerte(newX, newY);
            update_labels(numDeaths, current_level);
            
            // Calculate respawn position
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
        
            // Play death animation
            player.play({
                key: 'morte',
                repeat: 0,
                frameRate: 10,
                onComplete: () => {
                    // Use a small delay to ensure animation completes
                    this.time.delayedCall(100, () => {
                        respawnPlayer(targetX, targetY);
                    });
                }
            });
        
            // Failsafe: ensure player respawns even if animation fails
            this.time.delayedCall(1000, () => {
                if (isDying) {
                    respawnPlayer(targetX, targetY);
                }
            });
        }
    
        this.input.keyboard.on('keydown-A', event => {
            if (!isMoving && !isDying) movePlayer(-TILEDIMENSION, 0, 'left');
        });
    
        this.input.keyboard.on('keydown-D', event => {
            if (!isMoving && !isDying) movePlayer(TILEDIMENSION, 0, 'right');
        });
    
        this.input.keyboard.on('keydown-W', event => {
            if (!isMoving && !isDying) movePlayer(0, -TILEDIMENSION, lastDirection);
        });
    
        this.input.keyboard.on('keydown-S', event => {
            if (!isMoving && !isDying) movePlayer(0, TILEDIMENSION, lastDirection);
        });

        this.input.keyboard.on('keydown-O', event => {
            if (cheatmode)
            {
                cheatmode = false;
            }
            else
            {
                cheatmode = true;
            }
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
                    movePlayer(0, TILEDIMENSION, lastDirection);
                } else {
                    movePlayer(0, -TILEDIMENSION, lastDirection);
                }
            }
        });
    
        const movePlayer = (deltaX, deltaY, direction) => {
            const newX = player.x + deltaX;
            const newY = player.y + deltaY;
            const tile = layer.getTileAtWorldXY(newX, newY, true);
        
            if (direction === 'left') {
                player.flipX = true;
                lastDirection = 'left';
            } else if (direction === 'right') {
                player.flipX = false;
                lastDirection = 'right';
            }
        
            if (!hasKey && newX === keyTile.x && newY === keyTile.y) {
                hasKey = true;
                keyTile.setVisible(false);
                map.forEachTile(tile => {
                    if (tile.index === 4) {
                        tile.index = 3;
                    }
                });
            }
        
            if (tile.index === 2) {
                return;
            } else if (tile.index === 4) {
                return;
            } else if (tile.index === 3) {
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
                player.play({ key: 'Idle fight', repeat: -1 });
        
                tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 1, 2);
                layer = map.createLayer(0, tileset, 0, 0);
                update_labels(numDeaths, current_level);
                resetLevel();
            } else {
                isMoving = true;
                player.play({ key: 'run front', repeat: -1 });
                
                this.tweens.add({
                    targets: player,
                    x: newX,
                    y: newY,
                    duration: 200,
                    ease: 'Power2',
                    onComplete: () => {
                        isMoving = false;
                        if (tile.index === 1 && !cheatmode) {
                            handleDeath(newX, newY);
                        } else {
                            player.play({ key: 'Idle fight', repeat: -1 });
                        }
                    }
                });
            }
        }
    
        this.add.text(8, 8, 'Move with WASD or click', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setDepth(1);
    
        var text_deaths = this.add.text(400, 8, 'Deaths: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setDepth(1);
    }  
}

const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: Example,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    }
};

const game = new Phaser.Game(config);

function update_labels(num_deaths, num_level) {
    var temp_level = num_level + 1;    
    const level_label = document.getElementById('level_label');
    level_label.textContent = 'Level ' + temp_level;
    const deaths_label = document.getElementById('deaths_label');
    deaths_label.textContent = 'Deaths: ' + num_deaths;
}