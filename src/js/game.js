class Example extends Phaser.Scene
{
    preload ()
    {
        
        this.load.image('tiles', 'assets/img/64x64/draw_tiles_void_64.png');
        this.load.image('tiles-cheat', 'assets/img/drawtiles-spaced.png');
        this.load.image('machango', 'assets/img/64x64/knight_64.png');
        this.load.tilemapCSV('level1', 'assets/level_1.csv');
        this.load.tilemapCSV('level2', 'assets/level_2.csv');
        this.load.tilemapCSV('level3', 'assets/level_3.csv');
    }

    create() {
        const TILEDIMENSION = 64;
        var map = this.make.tilemap({ key: 'level1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
        var tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 1, 2);
        var layer = map.createLayer('layer', tileset, 0, 0);
    
        var numDeaths = 0;
    
        const starting_pointX = TILEDIMENSION + TILEDIMENSION/2;
        const starting_pointY = TILEDIMENSION + TILEDIMENSION/2;

        const starting_level2X = TILEDIMENSION*7 + TILEDIMENSION/2;
        const starting_level2Y = TILEDIMENSION*4 + TILEDIMENSION/2;

        const starting_level3X = TILEDIMENSION*4 + TILEDIMENSION/2;
        const starting_level3Y = TILEDIMENSION*6 + TILEDIMENSION/2;

        var current_level = 0;
    
        const player = this.add.image(starting_pointX, starting_pointY, 'machango');
    
        function muerte(layer1, layer2) {
            layer.putTileAtWorldXY(2, layer1, layer2);
            player.x = starting_pointX;
            player.y = starting_pointY;
            player.angle = 0;
            numDeaths++;
            text_deaths.setText('Deaths: ' + numDeaths);
        }
    
        this.input.keyboard.on('keydown-A', event => {
            movePlayer(-TILEDIMENSION, 0);
        });
    
        this.input.keyboard.on('keydown-D', event => {
            movePlayer(TILEDIMENSION, 0);
        });
    
        this.input.keyboard.on('keydown-W', event => {
            movePlayer(0, -TILEDIMENSION);
        });
    
        this.input.keyboard.on('keydown-S', event => {
            movePlayer(0, TILEDIMENSION);
        });
    
        this.input.on('pointerdown', pointer => {
            const deltaX = pointer.worldX - player.x;
            const deltaY = pointer.worldY - player.y;
    
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    movePlayer(TILEDIMENSION, 0); // Move right
                } else {
                    movePlayer(-TILEDIMENSION, 0); // Move left
                }
            } else {
                if (deltaY > 0) {
                    movePlayer(0, TILEDIMENSION); // Move down
                } else {
                    movePlayer(0, -TILEDIMENSION); // Move up
                }
            }
        });
    
        const movePlayer = (deltaX, deltaY) => {
            const newX = player.x + deltaX;
            const newY = player.y + deltaY;
            const tile = layer.getTileAtWorldXY(newX, newY, true);
            if (tile.index === 2) {
                // Blocked, we can't move
            } else if (tile.index === 1) {
                // Death, go to the beginning
                muerte(newX, newY);
            } else if (tile.index === 3) {
                // Victory, load next level                
                map.destroy();
                if (current_level === 0)
                {
                    map = this.make.tilemap({ key: 'level2', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                    player.x = starting_level2X;
                    player.y = starting_level2Y;
                    current_level++;
                }
                else if (current_level === 1)                
                {
                    map = this.make.tilemap({ key: 'level3', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                    player.x = starting_level3X;
                    player.y = starting_level3Y;
                    current_level++;
                }
                else
                {
                    current_level = 0;
                    map = this.make.tilemap({ key: 'level1', tileWidth: TILEDIMENSION, tileHeight: TILEDIMENSION });
                    player.x = starting_pointX;
                    player.y = starting_pointY;
                }
                tileset = map.addTilesetImage('tiles', null, TILEDIMENSION, TILEDIMENSION, 1, 2);
                layer = map.createLayer(0, tileset, 0, 0);
            } 
            else {
                player.x = newX;
                player.y = newY;
            }
            console.log('Level: '+current_level);
        }
    
        this.add.text(8, 8, 'Move with WASD or click', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setDepth(1);;
    
        var text_deaths = this.add.text(400, 8, 'Deaths: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setDepth(1);;
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
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);



