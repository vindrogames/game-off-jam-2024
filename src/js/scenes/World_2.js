// general specs. I want to import this from config.js
const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;
const TILEDIMENSION = 64;

var cheatmode = false;

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

// bottom nav menu for each world
var hard_mode = true;
var easy_mode = false;

export default class World_2 extends Phaser.Scene {

  constructor() {
    super('World_2');
  }

  init() {

  }

  preload() {

    // Loads world_2 tile set and map csv
    this.load.image('tiles', 'assets/img/world_2/world_2_tileset_64.png');
    this.load.tilemapCSV('level1', 'assets/world_maps/world_2_map/level_1.csv');
    this.load.tilemapCSV('level2', 'assets/world_maps/world_2_map/level_2.csv');
    this.load.tilemapCSV('level3', 'assets/world_maps/world_2_map/level_3.csv');

    // Loads nave menu button images (easy mode, hard mode, return to home)
    this.load.image('easy_on', 'assets/img/world_2/easy_on.png');
    this.load.image('easy_off', 'assets/img/world_2/easy_off.png');
    this.load.image('hard_on', 'assets/img/world_2/hard_on.png');
    this.load.image('hard_off', 'assets/img/world_2/hard_off.png');
    this.load.image('nav_home', 'assets/img/nav_home.png');
    this.load.image('nav_home_hover', 'assets/img/nav_home_hover.png');


    this.load.aseprite('paladin', 'assets/img/aseprite/paladin.png', 'assets/img/aseprite/paladin.json');
    this.load.atlas('keyTile', 'assets/img/world_2/key_tile_world_2.png', 'assets/img/world_2/key_tile_world_2.json');

    //this.load.atlas('door', 'assets/img/world_1/door.png', 'assets/img/world_1/door.json');
    //this.load.atlas('doorUp', 'assets/img/world_1/door_top.png', 'assets/img/world_1/door_top.json');

    this.load.atlas('tupac_caged', 'assets/img/world_1/tupac_caged.png', 'assets/img/world_1/tupac_caged.json');
    this.load.atlas('tupac_reveal', 'assets/img/world_1/tupac_reveal.png', 'assets/img/world_1/tupac_reveal.json');

    //this.load.atlas('wall_animation', 'assets/img/world_1/wall_animation.png', 'assets/img/world_1/wall_animation.json');
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
      this.scene.stop('World_2');
    });

    if (hard_mode === true && easy_mode === false) {

      EASY_MODE_BTN.on('pointerover', () => {

        EASY_MODE_BTN.setTexture('easy_on');

      });

      EASY_MODE_BTN.on('pointerout', () => {

        EASY_MODE_BTN.setTexture('easy_off');
      })

      EASY_MODE_BTN.on('pointerdown', () => {

        
        EASY_MODE_BTN.setTexture('easy_on');
        HARD_MODE_BTN.setTexture('hard_off');
        easy_mode = true;
        hard_mode = false;

        console.log("easy mode " + easy_mode);
        console.log("hard mode " + hard_mode);
      })
    }
    
    if (easy_mode === true && hard_mode === false) {

      EASY_MODE_BTN.setTexture('easy_on');
      EASY_MODE_BTN.on('pointerover', () => {

        EASY_MODE_BTN.setTexture('easy_on');
      });
      HARD_MODE_BTN.on('pointerover', () => {

        HARD_MODE_BTN.setTexture('hard_on');

      });

      HARD_MODE_BTN.on('pointerout', () => {

        HARD_MODE_BTN.setTexture('hard_off');
      })

      HARD_MODE_BTN.on('pointerdown', () => {

        HARD_MODE_BTN.setTexture('hard_on');
        easy_mode = false;
        hard_mode = true;
      })
    }

    const starting_pointX = TILEDIMENSION + TILEDIMENSION / 2;
    const starting_pointY = TILEDIMENSION + TILEDIMENSION / 2;

    const starting_level2X = TILEDIMENSION * 5 + TILEDIMENSION / 2;
    const starting_level2Y = TILEDIMENSION * 7 + TILEDIMENSION / 2;

    const starting_level3X = TILEDIMENSION * 4 + TILEDIMENSION / 2;
    const starting_level3Y = TILEDIMENSION * 7 + TILEDIMENSION / 2;

    const key_level3X = TILEDIMENSION + TILEDIMENSION / 2;
    const key_level3Y = TILEDIMENSION * 6 + TILEDIMENSION / 2;

    const tupac_3x = TILEDIMENSION * 4 + TILEDIMENSION / 2;
    const tupac_3y = TILEDIMENSION * 0.5 + TILEDIMENSION / 2;

    var current_level = 0;
  }
}