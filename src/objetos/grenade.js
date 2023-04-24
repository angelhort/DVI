export default class Grenade extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, player) {
        super(scene, x, y, sprite, player);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
        this.setCollideWorldBounds(true);

        this.sprite = sprite;
        this.destruido = false;
        this.player = player;
        this.exploded = false;
        this.explosionRadius = 100; // Puedes ajustar el radio de la explosión aquí
        this.explosionDelay = 2000; // Tiempo que tarda en explotar la granada (en milisegundos)

        this.scene.anims.create({
            key: this.sprite,
            frames: scene.anims.generateFrameNumbers(this.sprite, {start:0, end:2}),
            frameRate: 3,
            repeat: -1
        });
    }

    setDestruido(){
        this.destruido = true;
    }

    fire(x, y, angle) {
        this.play(this.sprite);
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.setRotation(angle);

        this.scene.physics.velocityFromRotation(angle, 600, this.body.velocity);

        this.scene.time.delayedCall(this.explosionDelay, () => {
            this.explode();
        }, null, this);
    }

    explode() {
        if (!this.exploded && !this.destruido) {
            this.exploded = true;
    
            const enemies = this.scene.playerGroup.getChildren();
            const explosionDamage = 100; // Puedes ajustar el daño de la explosión aquí
    
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
    
                // Calcula la distancia entre la granada y el enemigo
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                // Si el enemigo está dentro del radio de la explosión, inflige daño
                if (distance <= this.explosionRadius) {
                    enemy.takeDamage(explosionDamage);
                }
            }
    
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }

    update() {
        if (this.body.blocked.down) {
            this.body.velocity.y = 0;
            this.body.velocity.x *= 0.95; // Simula fricción al deslizarse en el suelo
        }

        if (this.y < 0 || this.y > this.scene.scale.height || this.x < 0 || this.x > this.scene.scale.width) {
            this.setActive(false);
            this.setVisible(false);
            this.setDestruido();
            this.destroy();
        }

    }
    
}
