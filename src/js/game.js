class Example extends Phaser.Scene
{
    preload ()
    {
        
        this.load.image('tiles', 'assets/img/draw_tiles_void.png');
        this.load.image('tiles-cheat', 'assets/img/drawtiles-spaced.png');
        this.load.image('machango', 'assets/img/knight.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');
    }

    create() {
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        var layer = map.createLayer('layer', tileset, 0, 0);
    
        var numDeaths = 0;
    
        const starting_pointX = 32 + 16;
        const starting_pointY = 32 + 16;
    
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
            movePlayer(-32, 0);
        });
    
        this.input.keyboard.on('keydown-D', event => {
            movePlayer(32, 0);
        });
    
        this.input.keyboard.on('keydown-W', event => {
            movePlayer(0, -32);
        });
    
        this.input.keyboard.on('keydown-S', event => {
            movePlayer(0, 32);
        });
    
        this.input.keyboard.on('keydown-F', event => {
            this.layer.destroy();
            var tilesetdos = map.addTilesetImage('tiles-cheat', null, 32, 32, 1, 2);
            this.layer = map.createLayer('layer', tilesetdos, 0, 0);
        });
    
        this.input.on('pointerdown', pointer => {
            const deltaX = pointer.worldX - player.x;
            const deltaY = pointer.worldY - player.y;
    
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    movePlayer(32, 0); // Move right
                } else {
                    movePlayer(-32, 0); // Move left
                }
            } else {
                if (deltaY > 0) {
                    movePlayer(0, 32); // Move down
                } else {
                    movePlayer(0, -32); // Move up
                }
            }
        });
    
        function movePlayer(deltaX, deltaY) {
            const newX = player.x + deltaX;
            const newY = player.y + deltaY;
            const tile = layer.getTileAtWorldXY(newX, newY, true);
            if (tile.index === 2) {
                // Blocked, we can't move
            } else if (tile.index === 1) {
                // Death, go to the beginning
                muerte(newX, newY);
            } else {
                player.x = newX;
                player.y = newY;
            }
        }
    
        this.add.text(8, 8, 'Move with WASD or click', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        });
    
        var text_deaths = this.add.text(400, 8, 'Deaths: 0', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        });
    }

    
}



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: Example
};

const game = new Phaser.Game(config);