class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

preload() {
    this.load.image('background', '../assets/images/background.png');
    this.load.image('ground', '../assets/images/land.png');
    this.load.image('platform', '../assets/images/platform.png');
    this.load.spritesheet('star', '../assets/images/Star_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('bomb', '../assets/images/bomb.png');
    this.load.spritesheet('player', '../assets/images/Robot_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 34,
    });
    this.load.spritesheet('playerJump', '../assets/images/Jump_Spritesheet.png', {
      frameWidth: 32,
      frameHeight: 34,
    });

    this.load.audio('bgm', '../assets/audio/bgm.mp3');
      }

    create() {
        this.scene.start('GameScene');
    }
}
