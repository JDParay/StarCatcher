class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.lastScene = data.from || 'Level1';
  }

  create() {
    this.bgm = this.sound.add('retry', { loop: true, volume: 1});
    this.bgm.play();
    this.add.image(300, 200, 'LoseBG').setScale(1.5);

    this.add.text(140, 150, 'GAME OVER', {
        fontSize: '40px',
        fill: '#ff0000',
    });

    this.add.text(120, 190, 'You`ve been abandoned.', {
        fontSize: '20px',
        fontStyle: 'bold',
        fill: '#ff0000',
    });


    const retryButton = this.add.text(180, 230, 'Retry', {
      fontSize: '32px',
      fill: '#00ff00',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.bgm.stop();
      this.scene.start(this.lastScene);
    });

    const mainMenuButton = this.add.text(150, 300, 'Main Menu', {
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#333',
      padding: { x: 10, y: 5 },
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.bgm.stop();
      this.scene.start('MenuScene');
    });
  }
}
