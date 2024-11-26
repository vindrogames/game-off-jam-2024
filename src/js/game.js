import Screen_start from "./scenes/Screen_start.js";
import World_1 from "./scenes/World_1.js";
import World_2 from "./scenes/World_2.js";

// general specs. I want to import this from config.js
const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;
const TILEDIMENSION = 64;

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'phaser-example',
    //pixelArt: true,
    backgroundColor: '#1a1a2d',
    scene: [Screen_start, World_1, World_2],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    }
};

const game = new Phaser.Game(config);