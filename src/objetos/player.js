export default class Player extends Phaser.GameObjects.Sprite {

	updateColliderOnDeath() {
		const deadBodyWidth = this.body.width * 2;
		const deadBodyHeight = this.body.height / 2;
		const deadBodyOffsetX = 0;
		const deadBodyOffsetY = this.body.height / 2;

		this.body.setSize(deadBodyWidth, deadBodyHeight);
		this.body.setOffset(deadBodyOffsetX, deadBodyOffsetY);
	}
	
	/**
	 * Constructor de Player, nuestro jugador
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y, controls) {
		super(scene, x, y, 'player', controls);
		this.speed = 170; // Nuestra velocidad de movimiento
		this.controls = controls;

		this.disableJump(); // Por defecto no podemos saltar hasta que estemos en una plataforma del juego
		this.isAttacking = false;
		this.otherPlayer = null;

		this.hitDelay = 500; // Tiempo mínimo entre cada golpe (en milisegundos)
  		this.lastHitTime = 0; // Tiempo del último golpe (en milisegundos)

		this.scene.add.existing(this); //Añadimos el jugador a la escena

		// Añadir propiedad para detectar si el jugador está en contacto con una caja
  		this.touchingPowerUp = false;

		this.airSpeedMultiplier = 0.6; // Ajusta este valor para cambiar la velocidad en el aire

		// Creamos las animaciones de nuestro jugador
		this.scene.anims.create({
			key: 'idle',
			frames: scene.anims.generateFrameNumbers('player', {start:0, end:1}),
			frameRate: 2,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'attack',
			frames: scene.anims.generateFrameNumbers('player', {start:7, end:10}),
			frameRate: 12,
			repeat: 0
		});
		this.scene.anims.create({
			key: 'run',
			frames: scene.anims.generateFrameNumbers('player', {start:2, end:5}),
			frameRate: 12,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'dead',
			frames: scene.anims.generateFrameNumbers('player', {start:6, end:6}),
			frameRate: 1,
			repeat: -1
		});

		// Si la animación de ataque se completa pasamos a ejecutar la animación 'idle'
		this.on('animationcomplete', end => {
			if (this.anims.currentAnim.key === 'attack'){
				this.stopAttack()
			}
		})

		// La animación a ejecutar según se genere el personaje será 'idle'
		this.play('idle');

		// Agregamos el jugador a las físicas para que Phaser lo tenga en cuenta
		scene.physics.add.existing(this);

		// Decimos que el jugador colisiona con los límites del mundo
		this.body.setCollideWorldBounds();

		// Ajustamos el "collider" de nuestro jugador
		this.bodyOffset = this.body.width/3;
		this.bodyWidth = this.body.width*2/3.5;
		
		this.body.setOffset(this.bodyOffset, 0);
		this.body.width = this.bodyWidth;

		this.health = 100; // Definimos la vida inicial del jugador como 100
  		this.damage = 10;
		this.isDead = false; // Definimos si el jugador está vivo o muerto

	}

	/**
	 * Detecta si el jugador está siendo golpeado por otro jugador y resta vida en consecuencia
	 * @param {Player} otherPlayer - el otro jugador que está golpeando a este jugador
	 */
	takeDamage(otherPlayer) {
		if (this.health > 0 && otherPlayer.isAttacking && Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), otherPlayer.getBounds())) {
			const currentTime = this.scene.time.now;
			if (currentTime - this.lastHitTime > this.hitDelay) { // Verificar si ha pasado suficiente tiempo
				this.health -= otherPlayer.damage;
				console.log(`Jugador ${this.controls.playerNumber} ha sido golpeado y tiene ${this.health} puntos de vida`);
				this.lastHitTime = currentTime; // Establecer el tiempo del último golpe
				if (this.health <= 0) {
					console.log(`Jugador ${this.controls.playerNumber} ha muerto.`);
					this.play('dead');
					this.isDead = true;
					this.updateColliderOnDeath();
				}
			}
		}
	}

	/**
	 * Hace que el jugador ataque a otro jugador y le reste vida
	 * @param {Player} otherPlayer - el otro jugador al que se va a atacar
	 */
	attack(otherPlayer) {
		if (!this.isAttacking) {
			this.isAttacking = true;
			this.play('attack');

			this.scene.time.delayedCall(300, () => {
				this.isAttacking = false;
				this.play('idle');
			});

			otherPlayer.takeDamage(this);
		}
	}

	/**
	 * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
	 * @param {number} t - Tiempo total
	 * @param {number} dt - Tiempo entre frames
	 */
	preUpdate(t, dt) {
		// Es muy imporante llamar al preUpdate del padre (Sprite), sino no se ejecutará la animación
		super.preUpdate(t, dt);

		// Aplicar fuerza de rozamiento si el jugador está en contacto con una caja
		if (this.touchingPowerUp) {
			const frictionForce = 0.1; // Ajusta este valor para cambiar la fuerza de rozamiento
			this.body.setVelocityX(this.body.velocity.x * (1 - frictionForce));
		}

		if (this.y > this.scene.game.config.height) {
    this.health = 0;
			 this.isDead = true;
    this.updateColliderOnDeath();
				this.play('dead');
}

		if(this.isDead) {
			return;
		}
		
		// Mientras pulsemos la tecla 'A' movelos el personaje en la X
		if(this.controls.left.isDown && !this.isAttacking){
			this.setFlip(true, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			
			const speed = this.body.touching.down ? this.speed : this.speed * this.airSpeedMultiplier;
   			this.body.setVelocityX(-speed);

			// Ajustar el "collider" cuando el jugador se mueve hacia la izquierda
			this.body.setOffset(this.bodyOffset - this.bodyWidth/2.5, 0);
		}

		// Mientras pulsemos la tecla 'D' movelos el personaje en la X
		if(this.controls.right.isDown && !this.isAttacking){
			this.setFlip(false, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			const speed = this.body.touching.down ? this.speed : this.speed * this.airSpeedMultiplier;
   			this.body.setVelocityX(speed);
			
			// Restablecer el "collider" a su posición original
			this.body.setOffset(this.bodyOffset, 0);
		}

		// Si dejamos de pulsar 'A' o 'D' volvemos al estado de animación'idle'
		// Phaser.Input.Keyboard.JustUp y Phaser.Input.Keyboard.JustDown nos aseguran detectar la tecla una sola vez (evitamos repeticiones)
		if(Phaser.Input.Keyboard.JustUp(this.controls.left) || Phaser.Input.Keyboard.JustUp(this.controls.right)){
			if(this.anims.currentAnim.key !== 'attack' && this.anims.isPlaying === true){
				this.play('idle');
			}
			this.body.setVelocityX(0);
		}
		
		// Si pulsado 'S' o la flecha hacia abajo, y el personaje está saltando, aumentamos la velocidad de caída
		if(Phaser.Input.Keyboard.JustDown(this.controls.down)){
			this.body.setVelocityY(this.speed);		
		}

		// Si pulsamos 'W' haremos que el personaje salte
		// Mientras saltamos no podremos volver a saltar ni atacar
		if(Phaser.Input.Keyboard.JustDown(this.controls.up) && !this.jumpDisabled && this.body.touching.down){
			this.disableJump();
			this.body.setVelocityY(-this.speed*1.2);
		}

		// Si pulsamos 'CTRL' atacamos
		if(Phaser.Input.Keyboard.JustDown(this.controls.fire)){
			this.attack(this.otherPlayer);
		}
		
	}

	/**
	 * Cambiamos la propiedad jumpDisabled a true para indicar que el personaje no puede saltar
	 */
	disableJump(){
		this.jumpDisabled = true;
	}

	/**
	 * Cambiamos la propiedad jumpDisabled a true para indicar que el personaje puede volver a ejecutar un salto
	 */
	enableJump(){
		this.jumpDisabled = false;
	}

	/**
	 * EjecutrunDisabledamos un ataque
	 */
	attack(){
		this.isAttacking = true;
		this.play('attack');
	}

	/**
	 * Terminamos el ataque
	 */
	stopAttack(){
		this.stop()
		this.play('idle');
		this.isAttacking = false;
	}

	isAttackInProcess(){
		return this.isAttacking;
	}

}
