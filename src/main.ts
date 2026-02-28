import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  player: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  bg: Phaser.GameObjects.Image;
  shark: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  sharks: Phaser.Physics.Arcade.Group;
  constructor() {
    super({ key: "GameSchene" });
  }
  preload() {
    this.load.spritesheet("player", "player.png", {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.image("background", "atlantis.png");
    this.load.spritesheet("shark", "shark.png", {
      frameWidth: 320,
      frameHeight: 160,
    });
  }
  create() {
    this.bg = this.add
      .tileSprite(0, 0, 3000, 600, "background")
      .setOrigin(0, 0);
    this.player = this.physics.add.sprite(0, 350, "player").setOrigin(0, 0);
    this.sharks = this.physics.add.group();
    this.shark = this.physics.add.sprite(1000, 300, "shark").setOrigin(0, 0);
    this.time.addEvent({
      delay: 4000,
      callback: this.spawnShark,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.player,
      this.sharks,
      this.hitShark,
      null,
      this,
    );
    const floorGraphic = this.add.rectangle(400, 500, 800, 20, 0x000000);
    this.physics.add.existing(floorGraphic, true);

    this.physics.add.collider(this.player, floorGraphic);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.setScale(0.2);

    this.shark.body.setAllowGravity(false);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 41,
        end: 49,
      }),
      frameRate: 40,
      repeat: -1,
    });
  }
  update(_time: number, _delta: number): void {
    this.bg.tilePositionX += 20;
    this.player.anims.play("idle", true);

    // this.shark.x -= 5;

    if (this.cursors.space.isDown) {
      this.player.body.setVelocityY(-300);
    }
  }
  spawnShark() {
    const shark = this.sharks.create(600, 300, "shark").setOrigin(0, 0);
    this.sharks.setVelocityX(-200);
    shark.body.setAllowGravity(false);
  }
  hitShark(
    player: Phaser.GameObjects.GameObject,
    shark: Phaser.GameObjects.GameObject,
  ) {
    this.scene.restart();
  }
}

new Phaser.Game({
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  backgroundColor: "#78ddf4",
  physics: {
    default: "arcade",
    arcade: { gravity: { x: 0, y: 400 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene],
});
