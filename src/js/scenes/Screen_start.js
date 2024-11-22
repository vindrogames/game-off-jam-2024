//import { SPECS } from '../config.js'

const BACKGROUND_X = 0 + 576 / 2;
const BACKGORUND_Y = 0 + 576 / 2;

const WORLD_1_BTN_X = 64 * 2 + 576 / 2;
const WORLD_1_BTN_Y = 64 * 7.5 + 576 / 2;

const WORLD_2_BTN_X = 64 * 2 + 576 / 2;
const WORLD_2_BTN_Y = 64 * 7.5 + 576 / 2;


export default class Screen_start extends Phaser.Scene {

  constructor() {
    super('Screen_start');
  }

  preload() {
    this.load.image('main_screen_start', 'assets/img/screen_start/main_screen_start.png');

    this.load.atlas('worlds_animation', 'assets/img/screen_start/world_animations.png', 'assets/img/screen_start/world_animations.json');

    this.load.image('world_1_button', 'assets/img/screen_start/world_1_button.png');
    this.load.image('world_2_button', 'assets/img/screen_start/world_2_button.png');
  }

  create() {

    this.add.image(BACKGROUND_X, BACKGORUND_Y, 'main_screen_start');
    this.anims.create({
      key: 'worlds_animation',
      frames: this.anims.generateFrameNames('worlds_animation', { prefix: 'worlds_', end: 11, zeroPad: 2}),
      repeat: -1,
      frameRate: 8,
    });

    var worlds = this.add.sprite(290, 300, 'worlds_animation');
    var worldsAnim = worlds.play('worlds_animation');
    
    const BTN_WORLD_1 = this.add.image(WORLD_1_BTN_X, WORLD_1_BTN_Y, 'world_1_button').setInteractive().setDepth(1);


    const BTN_WORLD_2 = this.add.image(WORLD_2_BTN_X, WORLD_2_BTN_Y, 'world_2_button').setInteractive();

    BTN_WORLD_1.on('pointerdown', () => {

      this.scene.start('World_1');
    })
  }
}