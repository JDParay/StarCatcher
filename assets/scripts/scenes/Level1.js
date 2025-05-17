class Level1 extends Phaser.Scene {
  constructor() {
    super('Level1');
  }

  create() {
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 });
    this.bgm.play();

    this.add.image(400, 300, 'background1');

    this.colors = ['0xff0000', '0xffa500', '0xffff00', '0x008000', '0x0000ff', '0x4b0082', '0xee82ee'];
    this.colorIndex = 0;
    this.starCount = 0;
    this.lastStarX = 0;

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
    this.Skip = this.input.keyboard.addKeys({
      Q: Phaser.Input.Keyboard.KeyCodes.Q
    });

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

    this.Tutorial = this.add.text(14, 400, '- Catch 20 falling stars\n\t to complete the level!\n- Avoid the bombs!', {
    fontSize: '16px',
    fontStyle: 'bold',
    fill: '#fff',
  })

  this.time.delayedCall(5000, () => {
  this.Tutorial.destroy();
}, [], this);

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
  this.player.setVelocityY(-390);
  this.player.anims.play('jump', true);
  }
  if (this.Skip.Q.isDown) {
    this.bgm.stop();
    this.scene.start('Level2'); 
    return;
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

    if (this.starCount >= 20) {
    this.bgm.stop();
    this.scene.start('Level2'); 
    return;
  }
    this.spawnStar();
  }

  spawnStar() {
  let x;
  const y = -50;
  const minDistance = 80;
  let attempts = 0;
  const maxAttempts = 20;

  if (this.lastStarX === undefined) this.lastStarX = 0;

  do {
    x = Phaser.Math.Between(-10, 450);
    const tooClose = this.stars.getChildren().some(star => {
      return Math.abs(star.x - x) < minDistance;
    });
    if (!tooClose) break;
    attempts++;
  } while (attempts < maxAttempts);

  this.lastStarX = x;

  const star = this.stars.create(x, y, 'star');
  star.anims.play('starSpin');
  star.setCollideWorldBounds(true);
  star.setVelocityY(50);

  console.log("Spawning star at x =", x);
}

spawnBomb() {
  const safeDistance = 50;
  let x, y;
  let attempts = 0;
  const maxAttempts = 20;

  do {
    x = Phaser.Math.Between(0, 750);
    y = Phaser.Math.Between(0, 550);
    const dx = this.player.x - x;
    const dy = this.player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > safeDistance) break;
    attempts++;
  } while (attempts < maxAttempts);

  const bomb = this.bombs.create(x, y, 'bomb');
  bomb.setScale(0.15);
  bomb.setSize(100, 100);
  bomb.setCollideWorldBounds(true);
  bomb.body.allowGravity = false;
  bomb.setVelocity(0);

  this.time.delayedCall(6000, () => {
    if (bomb && bomb.active) {
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

  this.scene.start('GameOverScene', { from: this.scene.key });
  }
}
