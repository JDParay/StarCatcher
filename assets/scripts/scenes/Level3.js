class Level3 extends Phaser.Scene {
  constructor() {
    super('Level3');
  }

  create() {
    this.bgm = this.sound.add('bgm3', { loop: true, volume: 1});
    this.bgm.play();

    this.add.image(300, 200, 'background3').setScale(1.5);
    

    this.colors = ['0xff0000', '0xffa500', '0xffff00', '0x008000', '0x0000ff', '0x4b0082', '0xee82ee'];
    this.colorIndex = 0;
    this.starCount = 0;

    this.player = this.physics.add.sprite(100, 280, 'player');
    this.player.setSize(15,20);
    this.player.setOffset(8, 12);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);

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
  delay: 800,
  callback: () => {
    this.spawnBomb();
  },
  callbackScope: this,
  loop: true
});

  this.platforms = this.physics.add.staticGroup();

  this.platforms.create(140, 410, 'platform3').setScale(2).refreshBody();
  this.platforms.create(460, 470, 'platform3').setScale(2).refreshBody();
  this.platforms.create(300,270, 'platform3_small').setScale(2).refreshBody();
  this.platforms.create(510,160, 'platform3').setScale(2).refreshBody();
  this.platforms.create(150,130, 'platform3_small').setScale(2).refreshBody();

  this.scoreText = this.add.text(350, 16, 'Stars: 0', {
    fontSize: '20px',
    fontStyle: 'bold',
    fill: '#fff',
    });

this.Caution = this.add.text(13, 320, 'it`s illegal fishing season!\n\t(faster bomb spawn rate!)', {
    fontSize: '16px',
    fontStyle: 'bold',
    fill: '#fff',
  })

  this.time.delayedCall(4000, () => {
  this.Caution.destroy();
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
if (this.player.getBounds().bottom >= 478) {
  this.handleFall();
}
this.stars.getChildren().forEach(star => {
  if (star.y >= 478) {
    star.destroy();
  }
});
if (this.Skip.Q.isDown) {
    this.bgm.stop();
    this.scene.start('WinScene'); 
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
    this.scene.start('WinScene'); 
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

  do {
    x = Phaser.Math.Between(-10, 450);
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

handleFall() {
  if (this.starCount > 0) {
    this.starCount--;
    this.scoreText.setText('Stars: ' + this.starCount);
  }

  this.player.setX(100);
  this.player.setY(280);
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

  this.time.delayedCall(7000, () => {
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
