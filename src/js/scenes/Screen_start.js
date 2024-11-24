//import { SPECS } from '../config.js'

/* const TILE_SIZE = 64;
const NUM_TILES = 9;
const GAME_WIDTH = TILE_SIZE * NUM_TILES;
const GAME_HEIGHT = TILE_SIZE * NUM_TILES;
const TILEDIMENSION = 64; */

const BACKGROUND_X = 576 / 2;
const BACKGORUND_Y = 576 / 2;

const WORLD_1_BTN_X = 64 * 2 + 32;
const WORLD_1_BTN_Y = 64 * 6 + 32;

const WORLD_2_BTN_X = 64 * 6 + 32;
const WORLD_2_BTN_Y = 64 * 6 + 32;


export default class Screen_start extends Phaser.Scene {

  constructor() {
    super('Screen_start');
  }

  init() {

  }

  preload() {
    this.load.image('main_screen_start', 'assets/img/screen_start/main_screen_start.png');

    this.load.atlas('worlds_animation', 'assets/img/screen_start/world_animations.png', 'assets/img/screen_start/world_animations.json');
    this.load.image('tupac_complete', 'assets/img/screen_start/tupac_complete.png');

    this.load.image('world_1_button', 'assets/img/screen_start/world_1_button.png');
    this.load.image('world_2_button', 'assets/img/screen_start/world_2_button.png');

    this.load.audio('main_screen_audio', 'assets/audio/space-266642.mp3')
  }

  create() {

    var tupac = true;
    this.add.image(BACKGROUND_X, BACKGORUND_Y, 'main_screen_start');
    this.anims.create({
      key: 'worlds_animation',
      frames: this.anims.generateFrameNames('worlds_animation', { prefix: 'worlds_', end: 11, zeroPad: 2}),
      repeat: -1,
      frameRate: 8,
    });

    this.main_screen_music = this.sound.add('main_screen_audio', {
      loop: true,
      volume: 0.5
    });

    this.main_screen_music.play();

    var worlds = this.add.sprite(576/2, 576/2, 'worlds_animation');
    var worldsAnim = worlds.play('worlds_animation');

    if (tupac === true) {

      this.add.image(576/2 - 126, 576/2, 'tupac_complete');
    }
    
    const BTN_WORLD_1 = this.add.image(WORLD_1_BTN_X, WORLD_1_BTN_Y, 'world_1_button').setInteractive({ useHandCursor: true });


    const BTN_WORLD_2 = this.add.image(WORLD_2_BTN_X, WORLD_2_BTN_Y, 'world_2_button').setInteractive({ useHandCursor: true });

    BTN_WORLD_1.on('pointerdown', () => {

      console.log('Starting World 1');
      this.scene.start('World_1');
      this.scene.stop('Screen_start');
    })

    BTN_WORLD_2.on('pointerdown', () => {

      console.log('Starting World 2');
      this.scene.start('World_2');
      this.scene.stop('Screen_start');
    })

    this.events.on('shutdown', () => {

      console.log("cleaning up buttons");
      this.anims.remove('worlds_animation');
      BTN_WORLD_1.off('pointerdown');
      BTN_WORLD_2.off('pointerdown');
    })
  }
}