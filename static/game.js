const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'static/assets/sky.png');
    this.load.image('star', 'static/assets/star.png');
    this.load.image('ground', 'static/assets/platform.png');
    this.load.image('bomb', 'static/assets/bomb.png');
    this.load.spritesheet('dude', 'static/assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;

let left = false;
let right = false;
let jump = false;

function create() {
    this.socket = io();
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    // keyboard
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

    // m5
    this.socket.on('jump', info => {
      jump = true;
    });

    this.socket.on('left', info => {
      left = true;
      right = false;
    });

    this.socket.on('right', info => {
      right = true;
      left = false;
    });

    this.socket.on('stop', () => {
        left = false;
        right = false;
    })

    if (left) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
      console.log('left');
    }
    if (right) {
      player.setVelocityX(160);
      player.anims.play('right', true);
      console.log('right');
    }
    if (jump) {
      if (player.body.touching.down) {
        player.setVelocityY(-330);
        console.log('jumped');
      }
    }
    jump = false;
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
    this.socket.emit('gameover');
}
