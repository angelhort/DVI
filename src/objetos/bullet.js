export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);

        this.scene.anims.create({
			key: 'bullet',
			frames: scene.anims.generateFrameNumbers('bullet', {start:0, end:2}),
			frameRate: 2,
			repeat: -1
		});
    }

    fire(x, y, angle) {
        this.play('bullet');
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setRotation(angle);

        this.scene.physics.velocityFromRotation(angle, 600, this.body.velocity);
    }

    update() {
        if (this.y < 0 || this.y > this.scene.scale.height || this.x < 0 || this.x > this.scene.scale.width) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
