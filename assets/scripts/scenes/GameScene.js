class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    this.bgm.play();

    this.add.image(400, 300, 'background');

    this.colors = ['0xff0000', '0xffa500', '0xffff00', '0x008000', '0x0000ff', '0x4b0082', '0xee82ee'];
    this.colorIndex = 0;
    this.starCount = 0;

    this.player = this.physics.add.sprite(100, 380, 'player');
    this.player.setSize(15,20);
    this.player.setOffset(8, 12);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 5 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'starSpin',
      frames: this.anims.generateFrameNumbers('star', { start: 0, end: 12}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 4}),
      frameRate: 10,
      repeat: -1
    })

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group();
    this.spawnStar();

    this.bombs = this.physics.add.group();
    this.spawnBomb();

    this.time.addEvent({
    delay: 5000,
    callback: () => {
      if (this.stars.getChildren().length < 10) {
        this.spawnStar();
      }
    },
    callbackScope: this,
    loop: true
  });

  this.bombTimer = this.time.addEvent({
  delay: 2000,
  callback: () => {
    this.spawnBomb();
  },
  callbackScope: this,
  loop: true
});

  this.platforms = this.physics.add.staticGroup();

  this.platforms.create(100, 565, 'ground').setScale(2).refreshBody();
  this.platforms.create(50,350, 'platform').setScale(2).refreshBody();
  this.platforms.create(500,220, 'platform').setScale(2).refreshBody();


    this.scoreText = this.add.text(350, 16, 'Stars: 0', {
      fontSize: '20px',
      fontStyle: 'bold',
      fill: '#fff',
    });

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
  }

  update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-180);
    this.player.anims.play('right', true);
    this.player.setFlipX(true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(180);
    this.player.anims.play('right', true);
    this.player.setFlipX(false);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }
  if (this.cursors.up.isDown && this.player.body.blocked.down) {
  this.player.setVelocityY(-370);
  this.player.anims.play('jump', true);
}
}
  collectStar(player, star) {
    star.destroy();
    this.starCount++;
    this.scoreText.setText('Stars: ' + this.starCount);

    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    player.setTint(this.colors[this.colorIndex]);

    if (this.starCount % 5 === 0) {
      const newScale = this.player.scale + 0.1;
      this.player.setScale(newScale);
    }

    this.spawnStar();
  }

  spawnStar() {
  let x;
  const y = -50;
  const minDistance = 80;
  let attempts = 0;
  const maxAttempts = 20;

  do {
    x = Phaser.Math.Between(50, 750);
    const tooClose = this.stars.getChildren().some(star => {
      return Math.abs(star.x - x) < minDistance;
    });
    if (!tooClose) break;
    attempts++;
  } while (attempts < maxAttempts);

  const star = this.stars.create(x, y, 'star');
  star.anims.play('starSpin');
  star.setCollideWorldBounds(true);
  star.setVelocityY(50);
}



  spawnBomb() {
  const x = Phaser.Math.Between(0, 500);
  const y = Phaser.Math.Between(0, 500);

  const bomb = this.bombs.create(x, y, 'bomb');
  bomb.setScale(0.15);
  bomb.setCollideWorldBounds(true);
  bomb.body.allowGravity = false;
  bomb.setVelocity(0); 

  this.time.delayedCall(6000, () => {
    if (!this.bomb && bomb.active) {
      bomb.destroy();
    }
  });
}



  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.setVisible(false);

    if (this.bgm) {
    this.bgm.stop();
  }

    this.bombTimer.remove();
    this.add.text(130, 150, 'GAME OVER', {
      fontSize: '40px',
      fill: '#ff0000',
    });

    const restartButton = this.add.text(170, 230, 'Restart', {
    fontSize: '32px',
    fill: '#00ff00',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 },
    borderRadius: 5,
  })
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => {
    this.scene.restart();
  });
  }
}
