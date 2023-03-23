export default class PowerUp extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de PowerUp, nuestras powerUps destructibles
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y, colliderGroup) {
		super(scene, x, y, 'powerup');
		this.setScale(0.5,.5);
		scene.add.existing(this); //Añadimos el powerUp a la escena

		// Creamos las animaciones de nuestro powerUp
		this.scene.anims.create({
			key: 'none',
			frames: scene.anims.generateFrameNumbers('powerup', {start:0, end:0}),
			frameRate: 5,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'hit',
			frames: scene.anims.generateFrameNumbers('powerup', {start:1, end:3}),
			frameRate: 18,
			repeat: 0
		});
		this.scene.anims.create({
			key: 'roll',
			frames: scene.anims.generateFrameNumbers('powerup', {start:4, end:7}),
			frameRate: 8,
			repeat: -1
		});


		// Si la animación de ataque se completa
		this.on('animationcomplete', end => {
			if (this.anims.currentAnim.key === 'hit'){
				this.setActive(false).setVisible(false);
				this.toDestroy = true;
			}
		})

		this.play('none');

		// Agregamos el powerUp a las físicas para que Phaser lo tenga en cuenta
		scene.physics.add.existing(this);

		// Decimos que el powerUp colisiona con los límites del mundo
		this.body.setCollideWorldBounds();

		colliderGroup.add(this);
	}

	/**
	 * Bucle principal del powerUp, comprobamos la velocidad para reducirla y setearla a 0 en ciertos umbrales
	 * Así no se movera de manera infinita cuando la golpeemos
	 * @param {number} t - Tiempo total
	 * @param {number} dt - Tiempo entre frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

		// Comprobar si el powerup ha caído por debajo de la pantalla
  if (this.y > this.scene.game.config.height) {
    this.destroy();
			return;
  }
		
		if(this.body.velocity.x > 5){
			this.body.velocity.x -= 5;
		} else if(this.body.velocity.x < -5){
			this.body.velocity.x += 5;
		}

		if(this.body.velocity.x <= 5 && this.body.velocity.x > 0 || this.body.velocity.x >= -5 && this.body.velocity.x < 0){
			 this.body.velocity.x = 0;
		}

		// Si la animación actual no es 'hit', entonces cambiamos la animación a 'roll' o 'none' según la velocidad
    if (this.anims.currentAnim.key !== 'hit') {
        if (this.body.velocity.x !== 0) {
            this.play('roll', true);
        } else {
            this.play('none', true);
        }
    }

		// Si es necesario, lo destruimos al final del update para evitar errores
		if(this.toDestroy){
			this.destroy();
		}

	}

	/**
	 * Cambiamos la propiedad jumpDisabled a true para indicar que el personaje no puede saltar
	 */
	destroyMe(){
		this.play('hit');
	}
}