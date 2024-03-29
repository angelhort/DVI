import Bullet from '../objetos/bullet.js';
import Grenade from '../objetos/grenade.js';

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
	constructor(scene, x, y, controls, sprite, spriteBullets, ajusteVelocidad, ajusteCadencia, ajusteAlcance, granada) {
		super(scene, x, y, sprite, spriteBullets, ajusteVelocidad, ajusteCadencia, ajusteAlcance);
		this.speed = 170; // Nuestra velocidad de movimiento
		this.speedX = 170*ajusteVelocidad;
		this.cadencia = 1000*ajusteCadencia; // Cadencia de disparo
		this.controls = controls;
		this.disableJump(); // Por defecto no podemos saltar hasta que estemos en una plataforma del juego
		this.isAttacking = false;
		this.cdDisparo = false;
		this.rotationAux = 0;
		this.jumpBoost = 1;
		this.sprite = sprite;
		this.spriteBullets = spriteBullets;
		this.canShoot = false;   //Impedir disparar al principio de cada ronda antes de tocar el suelo
		this.inmortal = false;
		this.grenade = granada;
		this.ajusteAlcance = ajusteAlcance;
		this.facing = 'right';
		this.touchingPowerUp = false; // Añadir propiedad para detectar si el jugador está en contacto con un powerup
		this.airSpeedMultiplier = 0.6;
		this.isDead = false; // Definimos si el jugador está vivo o muerto

		//Auxiliares para powerups
		const auxSpeed = 170;
		const jumpBoost = 1;

		this.scene.add.existing(this); //Añadimos el jugador a la escena

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
			frameRate: 3,
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
		
		this.body.setOffset(this.bodyOffset, 0);
		this.body.width /= 2;

		this.body.setSize(this.body.width, this.height, true);
	}

	/**
	 * Detecta si el jugador está siendo golpeado por otro jugador
	 */
	
	takeDamage() {
		const otherPlayer = this.scene.playerGroup.getChildren().find(player => player !== this);
		if(!this.inmortal && !otherPlayer.isDead && !this.isDead){
		this.miAudio = this.scene.sound.add('miAudio');
		this.miAudio.play();
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
			const frictionForce = 0.02; // Ajusta este valor para cambiar la fuerza de rozamiento
			this.body.setVelocityX(this.body.velocity.x * (1 - frictionForce));
		}
		
		if(!this.isDead){
			if (this.y > this.scene.game.config.height) {
				this.miAudiom = this.scene.sound.add('miAudio8');
				this.miAudiom.play();
				this.isDead = true;
				this.updateColliderOnDeath();
				this.play('dead'+this.sprite);
				this.emit('died');
				this.destroy();
			}
		}

		// Si el jugador está muerto, no ejecutamos el resto del código
		if(this.isDead) {
			return;
		}

		const otherPlayer = this.scene.playerGroup.getChildren().find(player => player !== this);

		// Si el otro jugador esta muerto
		if (otherPlayer === undefined || otherPlayer.isDead) {
			this.body.setVelocityX(0);
			this.inmortal = true;
			return;
		}
		
		// Mientras pulsemos la tecla 'A' movemos el personaje en la X
		if(this.controls.left.isDown && !this.isAttacking){
			this.facing = 'left';
			this.setFlip(true)
			this.rotationAux = -Math.PI;
			if(this.anims.currentAnim.key !== 'run'+this.sprite){
				this.play('run'+this.sprite);
			}
			
			const speed = this.body.touching.down ? this.speedX : this.speed * this.airSpeedMultiplier;
        	this.body.setVelocityX(-speed);
		}

		// Mientras pulsemos la tecla 'D' movelos el personaje en la X
		if(this.controls.right.isDown && !this.isAttacking){
			this.facing = 'right';
			this.setFlip(false)
			this.rotationAux = 0;
			if(this.anims.currentAnim.key !== 'run'+this.sprite){
				this.play('run'+this.sprite);
			}
			const speed = this.body.touching.down ? this.speedX : this.speed * this.airSpeedMultiplier;
        	this.body.setVelocityX(speed);
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
			this.body.setVelocityY(-this.speed * 1.2 * this.jumpBoost); // Multiplicamos por jumpBoost
			this.miAudio = this.scene.sound.add('miAudio6');
			this.miAudio.play();
		}
		// Si pulsamos 'SPACE' o 'ENTER' atacamos		
		if (Phaser.Input.Keyboard.JustDown(this.controls.fire)) {
			if(!this.cdDisparo){
            	this.shoot();
				if(this.canShoot){
					this.miAudio = this.scene.sound.add('miAudio7');
					this.miAudio.play();
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

	dance(){
		this.play('dance'+this.sprite);
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
			if (!this.grenade){
				console.log("BULLET")
				this.cdDisparo = true;
				this.play('attack'+this.sprite);
				let bullet = new Bullet(this.scene, this.x, this.y, this.spriteBullets, this, this.ajusteAlcance);
				this.scene.add.existing(bullet);
				this.scene.physics.add.existing(bullet);
				this.scene.bullets.add(bullet);		
				bullet.fire(this.x, this.y, this.rotationAux);
				setTimeout(() => {
					this.cdDisparo = false;
				}, this.cadencia);
			}
			else{
				console.log("GRENADE")
				this.cdDisparo = true;
				this.play('attack'+this.sprite);
				let grenade = new Grenade(this.scene, this.x, this.y, this.spriteBullets, this);
				this.scene.add.existing(grenade);
				this.scene.physics.add.existing(grenade);
				this.scene.grenades.add(grenade);		
				grenade.fire(this.x, this.y, this.rotationAux);
				setTimeout(() => {
					this.cdDisparo = false;
				}, this.cadencia);
				setTimeout(() => {
					this.miAudiog = this.scene.sound.add('miAudio11');
					this.miAudiog.play();
				}, 1900);
			}
		}
    }

	applyPowerUpType(typePowerUp){
		if(typePowerUp == "salto"){
			this.jumpAux = this.jumpBoost;
			this.jumpBoost *= 1.25;
			setTimeout(() => {
				this.jumpBoost /= 1.25;
			}, 7000);

		}
		else if(typePowerUp == "velocidad"){
			this.speedAux = this.speedX;
			this.speedX *= 2;
			setTimeout(() => {
				this.speedX /= 2;
			}, 7000);
		}
		else if (typePowerUp == "cadencia"){
			this.cadenciaAux = this.cadencia;
			this.cadencia *= 0.5;
			setTimeout(() => {
				this.cadencia /= 0.5;
			}, 7000);
		}
	}
}
