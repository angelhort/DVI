export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, player, ajusteAlcance) {
        super(scene, x, y, sprite, player);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);

        this.sprite = sprite;
        this.player = player;
        this.ajusteAlcance = ajusteAlcance;

        this.scene.anims.create({
			key: this.sprite,
			frames: scene.anims.generateFrameNumbers(this.sprite, {start:0, end:2}),
			frameRate: 3,
			repeat: -1
		});
    }

    fire(x, y, angle) {
        this.play(this.sprite);
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setRotation(angle);

        this.scene.physics.velocityFromRotation(angle, 600*this.ajusteAlcance, this.body.velocity);
    }

    update() {
        if (this.y < 0 || this.y > this.scene.scale.height || this.x < 0 || this.x > this.scene.scale.width) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}
