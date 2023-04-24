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

        this.scene.physics.velocityFromRotation(angle, 400, this.body.velocity);

        this.scene.time.delayedCall(this.explosionDelay, () => {
            this.explode();
        }, null, this);
    }

    explode() {
        if (!this.exploded && !this.destruido) {
            this.exploded = true;
    
            // Agrega el sprite de la explosión
            this.explosionSprite = this.scene.add.sprite(this.x, this.y-40, 'explosion');
            this.explosionSprite.setDisplaySize(this.explosionRadius, this.explosionRadius); // Ajusta el tamaño del sprite al radio de la explosión
            this.explosionSprite.setDepth(10); // Ajusta la profundidad para que aparezca sobre otros objetos
            this.explosionSprite.play('explode'); // Reproduce la animación de la explosión
    
            const enemies = this.scene.playerGroup.getChildren();
            const explosionDamage = 100;
    
            for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
    
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance <= this.explosionRadius) {
                    enemy.takeDamage(explosionDamage);
                }
            }
    
            // Oculta y destruye el sprite de la explosión después de que la animación termine
            this.explosionSprite.on('animationcomplete', () => {
                this.explosionSprite.setVisible(false);
                this.explosionSprite.destroy();
            });
    
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
