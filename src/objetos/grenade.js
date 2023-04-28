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
        this.gravity = 3000;

        this.body.setGravityY(this.gravity);
    }

    setDestruido(){
        this.destruido = true;
    }

    fire(x, y, angle) {
        this.play(this.sprite);
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
    
        // Convierte el ángulo en radianes
        const angleInRadians = Phaser.Math.DegToRad(angle);
    
        // Agrega una pequeña cantidad al ángulo en radianes para disparar un poco hacia arriba
        const adjustedAngle = angleInRadians - Math.PI / 6; // Puedes ajustar este valor según la inclinación que desees
        console.log("facing: " + this.player.facing)
        // Si el personaje está mirando a la izquierda, ajusta el ángulo final
        const finalAngle = this.player.facing === 'right' ? adjustedAngle : Math.PI - adjustedAngle;
    
        // Establece la rotación del sprite de la granada
        this.setRotation(finalAngle);
    
        // Aumenta la velocidad inicial si lo deseas
        const initialVelocity = 400; // Puedes ajustar este valor según la velocidad que desees
    
        // Asigna la velocidad inicial ajustada al cuerpo de la granada
        this.scene.physics.velocityFromRotation(finalAngle, initialVelocity, this.body.velocity);
    
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

        if (this.y > this.scene.scale.height || this.x < 0 || this.x > this.scene.scale.width) {
            this.setActive(false);
            this.setVisible(false);
            this.setDestruido();
            this.destroy();
        }

    }
    
}
