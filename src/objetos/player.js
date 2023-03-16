export default class Player extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de Player, nuestro caballero medieval con espada y escudo
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y, controls) {
		super(scene, x, y, 'player', controls);
		this.speed = 140; // Nuestra velocidad de movimiento será 140
		this.controls = controls;

		this.disableJump(); // Por defecto no podemos saltar hasta que estemos en una plataforma del juego
		this.isAttacking = false;
		this.otherPlayer = null;

		this.hitDelay = 500; // Tiempo mínimo entre cada golpe (en milisegundos)
    	this.lastHitTime = 0; // Tiempo del último golpe (en milisegundos)

		this.scene.add.existing(this); //Añadimos el caballero a la escena

		// Creamos las animaciones de nuestro caballero
		this.scene.anims.create({
			key: 'idle',
			frames: scene.anims.generateFrameNumbers('player', {start:0, end:1}),
			frameRate: 2,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'attack',
			frames: scene.anims.generateFrameNumbers('player', {start:2, end:5}),
			frameRate: 4,
			repeat: 0
		});
		this.scene.anims.create({
			key: 'run',
			frames: scene.anims.generateFrameNumbers('player', {start:2, end:5}),
			frameRate: 4,
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


		// Agregamos el caballero a las físicas para que Phaser lo tenga en cuenta
		scene.physics.add.existing(this);

		// Decimos que el caballero colisiona con los límites del mundo
		this.body.setCollideWorldBounds();

		// Ajustamos el "collider" de nuestro caballero
		this.bodyOffset = this.body.width/4;
		this.bodyWidth = this.body.width/2;
		
		this.body.setOffset(this.bodyOffset, 0);
		this.body.width = this.bodyWidth;

		this.health = 100; // Definimos la vida inicial del jugador como 100
    	this.damage = 10; // Definimos si el jugador está vivo o muerto

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

			this.scene.time.delayedCall(500, () => {
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

		// Mientras pulsemos la tecla 'A' movelos el personaje en la X
		if(this.controls.left.isDown && !this.isAttacking){
			this.setFlip(true, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			
			//this.x -= this.speed*dt / 1000;
			this.body.setVelocityX(-this.speed);
		}

		// Mientras pulsemos la tecla 'D' movelos el personaje en la X
		if(this.controls.right.isDown && !this.isAttacking){
			this.setFlip(false, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			//this.x += this.speed*dt / 1000;
			this.body.setVelocityX(this.speed);
		}

		// Si dejamos de pulsar 'A' o 'D' volvemos al estado de animación'idle'
		// Phaser.Input.Keyboard.JustUp y Phaser.Input.Keyboard.JustDown nos aseguran detectar la tecla una sola vez (evitamos repeticiones)
		if(Phaser.Input.Keyboard.JustUp(this.controls.left) || Phaser.Input.Keyboard.JustUp(this.controls.right)){
			if(this.anims.currentAnim.key !== 'attack' && this.anims.isPlaying === true){
				this.play('idle');
			}
			this.body.setVelocityX(0);
		}
		
		// Si pulsado 'S' detendremos o reanudaremos la animación de 'idle' según su estado actual
		if(Phaser.Input.Keyboard.JustDown(this.controls.down)){
			if(this.anims.currentAnim.key === 'idle' && this.anims.isPlaying === true){
				this.stop();
			} else {
				this.play('idle');
			}			
		}

		// Si pulsamos 'W' haremos que el personaje salte
		// Mientras saltamos no podremos volver a saltar ni atacar
		if(Phaser.Input.Keyboard.JustDown(this.controls.up) && !this.jumpDisabled){
			this.disableJump();
			this.disa
			this.isAttacking = false;
			this.body.setVelocityY(-this.speed*2);
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
		// Ajustamos el "collider" de nuestro caballero según hacia donde miremos
		this.body.width = this.bodyWidth*2;
		if(this.flipX){
			this.body.setOffset(-this.bodyOffset, 0);
		} 
	}

	/**
	 * Terminamos el ataque
	 */
	stopAttack(){
		this.stop()
		this.play('idle');
		this.isAttacking = false;
		// Ajustamos el "collider" de nuestro caballero según hacia donde miremos		
		this.resetCollider()
	}

	isAttackInProcess(){
		return this.isAttacking;
	}

	resetCollider(){
		this.body.width = this.bodyWidth;
		this.body.setOffset(this.bodyOffset, 0);
	}

}