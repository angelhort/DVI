import Bullet from '../objetos/bullet.js';

export default class Player extends Phaser.GameObjects.Sprite {

	updateColliderOnDeath() {
		const deadBodyWidth = this.body.width * 2;
		const deadBodyHeight = this.body.height / 2;
		const deadBodyOffsetX = 0;
		const deadBodyOffsetY = this.body.height / 2;

		this.body.setSize(deadBodyWidth, deadBodyHeight);
		this.body.setOffset(deadBodyOffsetX, deadBodyOffsetY);
		this.setPosition(this.controls.x, this.controls.y);
	}
	
	/**
	 * Constructor de Player, nuestro jugador
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y, controls, sprite, spriteBullets) {
		super(scene, x, y, sprite, spriteBullets);
		this.speed = 170; // Nuestra velocidad de movimiento
		this.controls = controls;
		this.disableJump(); // Por defecto no podemos saltar hasta que estemos en una plataforma del juego
		this.isAttacking = false;
		this.cdDisparo = false;
		this.rotationAux = 0;
		this.sprite = sprite;
		this.spriteBullets = spriteBullets;
		this.canShoot = false;   //Impedir disparar al principio de cada ronda antes de tocar el suelo
		this.inmortal = false;

		this.scene.add.existing(this); //Añadimos el jugador a la escena

		// Añadir propiedad para detectar si el jugador está en contacto con un powerup
  		this.touchingPowerUp = false;

		this.airSpeedMultiplier = 0.6; // Ajusta este valor para cambiar la velocidad en el aire

		// Creamos las animaciones de nuestro jugador
		this.scene.anims.create({
			key: 'idle'+this.sprite,
			frames: scene.anims.generateFrameNumbers(sprite, {start:0, end:1}),
			frameRate: 2,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'attack'+this.sprite,
			frames: scene.anims.generateFrameNumbers(sprite, {start:7, end:10}),
			frameRate: 12,
			repeat: 0
		});
		this.scene.anims.create({
			key: 'run'+this.sprite,
			frames: scene.anims.generateFrameNumbers(sprite, {start:2, end:5}),
			frameRate: 12,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'dead'+this.sprite,
			frames: scene.anims.generateFrameNumbers(sprite, {start:6, end:6}),
			frameRate: 1,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'dance'+this.sprite,
			frames: scene.anims.generateFrameNumbers(sprite, {start:11, end:12}),
			frameRate: 2,
			repeat: -1
		});

		// Si la animación de ataque se completa pasamos a ejecutar la animación 'idle'
		this.on('animationcomplete', end => {
			if (this.anims.currentAnim.key === 'attack'+this.sprite){
				this.stopAttack()
			}
		})

		// La animación a ejecutar según se genere el personaje será 'idle'
		this.play('idle'+this.sprite);

		// Agregamos el jugador a las físicas para que Phaser lo tenga en cuenta
		scene.physics.add.existing(this);

		// Decimos que el jugador colisiona con los límites del mundo
		this.body.setCollideWorldBounds();

		// Ajustamos el "collider" de nuestro jugador
		this.bodyOffset = this.body.width/3;
		this.bodyWidth = this.body.width*2/3.5;
		
		this.body.setOffset(this.bodyOffset, 0);
		this.body.width = this.bodyWidth;

		this.isDead = false; // Definimos si el jugador está vivo o muerto

	}

	/**
	 * Detecta si el jugador está siendo golpeado por otro jugador
	 */

	cargarSonido = function (fuente) {
		const sonido = document.createElement("audio");
		sonido.src = fuente;
		sonido.setAttribute("preload", "auto");
		sonido.setAttribute("controls", "none");
		sonido.style.display = "none"; // <-- oculto
		document.body.appendChild(sonido);
		return sonido;
	};

	takeDamage() {
		if(!this.inmortal){
		const miAudio3 = this.cargarSonido("./assets/sonidos/muerte.mp3");
		miAudio3.play();
		console.log(`Jugador ${this.controls.playerNumber} ha muerto.`);
		this.play('dead'+this.sprite);
		this.isDead = true;
		this.emit('died');
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
		
		if(!this.isDead){
			if (this.y > this.scene.game.config.height) {
				this.isDead = true;
				this.updateColliderOnDeath();
				this.play('dead'+this.sprite);
				this.emit('died');
				this.destroy();
			}
		}


		if(this.isDead) {
			return;
		}



		const otherPlayer = this.scene.playerGroup.getChildren().find(player => player !== this);

		// Si el otro jugador esta muerto
		if (otherPlayer === undefined || otherPlayer.isDead) {
			this.body.setVelocityX(0);
			this.inmortal = true;
			this.play('dance'+this.sprite);
			return;
			
		}
		
		// Mientras pulsemos la tecla 'A' movelos el personaje en la X
		if(this.controls.left.isDown && !this.isAttacking){
			this.setFlip(true, false)
			this.rotationAux = -Math.PI;
			if(this.anims.currentAnim.key !== 'run'+this.sprite){
				this.play('run'+this.sprite);
			}
			
			const speed = this.body.touching.down ? this.speed : this.speed * this.airSpeedMultiplier;
   			this.body.setVelocityX(-speed);

			// Ajustar el "collider" cuando el jugador se mueve hacia la izquierda
			this.body.setOffset(this.bodyOffset - this.bodyWidth/2.5, 0);
		}

		// Mientras pulsemos la tecla 'D' movelos el personaje en la X
		if(this.controls.right.isDown && !this.isAttacking){
			this.rotationAux = 0;
			this.setFlip(false, false)
			if(this.anims.currentAnim.key !== 'run'+this.sprite){
				this.play('run'+this.sprite);
			}
			const speed = this.body.touching.down ? this.speed : this.speed * this.airSpeedMultiplier;
   			this.body.setVelocityX(speed);
			
			// Restablecer el "collider" a su posición original
			this.body.setOffset(this.bodyOffset, 0);
		}

		// Si dejamos de pulsar 'A' o 'D' volvemos al estado de animación'idle'
		// Phaser.Input.Keyboard.JustUp y Phaser.Input.Keyboard.JustDown nos aseguran detectar la tecla una sola vez (evitamos repeticiones)
		if(Phaser.Input.Keyboard.JustUp(this.controls.left) || Phaser.Input.Keyboard.JustUp(this.controls.right)){
			if(this.anims.currentAnim.key !== 'attack'+this.sprite && this.anims.isPlaying === true){
				this.play('idle'+this.sprite);
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
			const miAudio = this.cargarSonido("./assets/sonidos/jump.mp3");
			miAudio.play();
		}
		// Si pulsamos 'SPACE' o 'ENTER' atacamos		
		if (Phaser.Input.Keyboard.JustDown(this.controls.fire)) {
			const miAudio2 = this.cargarSonido("./assets/sonidos/lanzar1.mp3");
			if(!this.cdDisparo){
            	this.shoot();
				if(this.canShoot){
					miAudio2.play();
				}
			}
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
	 * Terminamos el ataque
	 */
	stopAttack(){
		this.stop()
		this.play('idle'+this.sprite);
		this.isAttacking = false;
	}
	
	shoot() {
		if(this.canShoot){
			this.cdDisparo = true;
            // Dispara la bala desde la posición del personaje
			console.log("la rotacion: " + this.rotationAux)
			this.play('attack'+this.sprite);
			let bullet = new Bullet(this.scene, this.x, this.y, this.spriteBullets, this.controls.playerNumber);
            this.scene.add.existing(bullet);
		    this.scene.physics.add.existing(bullet);
			this.scene.bullets.add(bullet);		
			bullet.fire(this.x, this.y, this.rotationAux);
			setTimeout(() => {
				this.cdDisparo = false;
			}, 1000);
		}
    }
}
