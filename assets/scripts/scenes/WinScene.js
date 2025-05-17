class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene');
  }

  create() {
    this.bgm = this.sound.add('grats', { loop: true, volume: 1});
    this.bgm.play();
    this.add.image(250, 250, 'win').setScale(.8);

    this.add.text(40, 150, '\t\t\t\tCongratulations!\nYou caught all the stars!', {
      fontSize: '28px',
      fill: '#ffff00'
    });

    const menuButton = this.add.text(160, 270, 'Main Menu', {
      fontSize: '24px',
      fill: '#0f0'
    }).setInteractive().on('pointerdown', () => {
      this.bgm.stop();
      this.scene.start('MenuScene');
    });
  }
}
