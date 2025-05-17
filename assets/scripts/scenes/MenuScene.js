class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.bgm = this.sound.add('menu', { loop: true, volume: 1});
    this.bgm.play();
    this.add.image(300, 200, 'pixel').setScale(.5);
    
    this.add.text(80, 80, 'Star Catcher: \nRobot Legacy', {
      fontSize: '32px',
      fill: '#fff',
      fontStyle: 'bold'
    });

    const playButton = this.add.text(100, 180, 'Play', {
      fontSize: '24px',
      fontStyle: 'bold',
      fill: '#0f0'
    }).setInteractive().on('pointerdown', () => {
      this.bgm.stop();
      this.scene.start('Level1');
    });

    const quitButton = this.add.text(100, 220, 'Quit', {
      fontSize: '24px',
      fontStyle: 'bold',
      fill: '#0f0'
    }).setInteractive().on('pointerdown', () => {
      window.close();
    });
  }
}