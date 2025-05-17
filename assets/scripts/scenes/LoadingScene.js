class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

preload() {
    this.load.image('background1', '../assets/images/background.png');
    this.load.image('background2', '../assets/images/background2.png');
    this.load.image('background3', '../assets/images/background3.png');
    this.load.image('pixel', '../assets/images/pixel.png');
    this.load.image('LoseBG', '../assets/images/LoseBG.png');
    this.load.image('win', '../assets/images/win.png');
    this.load.image('ground', '../assets/images/land.png');
    this.load.image('platform', '../assets/images/platform.png');
    this.load.image('platform2', '../assets/images/platform2.png');
    this.load.image('platform3', '../assets/images/platform3.png');
    this.load.image('platform3_small', '../assets/images/platform3_small.png');
    this.load.spritesheet('star', '../assets/images/Star_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('bomb', '../assets/images/bomb.png');
    this.load.spritesheet('player', '../assets/images/Robot_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('playerJump', '../assets/images/Jump_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio('bgm', '../assets/audio/bgm.mp3');
    this.load.audio('bgm2', '../assets/audio/bgm2.mp3');
    this.load.audio('bgm3', '../assets/audio/bgm3.mp3');
    this.load.audio('menu', '../assets/audio/menu.mp3');
    this.load.audio('retry', '../assets/audio/retry.mp3');
    this.load.audio('grats', '../assets/audio/grats.mp3');
      }

    create() {
        this.scene.start('MenuScene');
    }
}
