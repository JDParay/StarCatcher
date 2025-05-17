let config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: [
        LoadingScene,
        GameScene
    ]
};

let game = new Phaser.Game(config);
