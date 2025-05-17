let config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [
        LoadingScene,
        MenuScene,
        Level1,
        Level2,
        Level3,
        GameOverScene,
        WinScene,
    ]
};

let game = new Phaser.Game(config);
