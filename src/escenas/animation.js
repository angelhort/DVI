import Player from '../objetos/player.js';
import PowerUp from '../objetos/powerUp.js';
import Platform from '../objetos/platform.js';
import Bullet from '../objetos/bullet.js';
/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */
export default class Animation extends Phaser.Scene {
	
	constructor() {
		super({ key: 'animation' });
		// Variable para llevar la cuenta de powerUps en el juego
  		this.powerUpCount = 0;
	}

	loadFont(name, url){
		let newFont = new FontFace(name, `url(${url})`);
		newFont.load().then(function (loaded){
			document.fonts.add(loaded);
		}).catch(function (error){
			return error;
		});
	}

	preload(){
		// Cargar imágenes y spritesheets
		this.load.image('fondo', 'assets/backgroundPlataformas.png');
		this.load.spritesheet('player', 'assets/Player/amancioAnimaciones.png', {frameWidth: 48, frameHeight: 48})
		this.load.spritesheet('powerup', 'assets/PowerUp/powerUpAnimacion.png', {frameWidth: 44, frameHeight: 44})
		this.load.spritesheet('bullet', 'PixelArt/billete.png', {frameWidth: 15, frameHeight: 9});
		// Cargar fuente personalizada
  		this.loadFont('font', 'assets/webfonts/NightmareCodehack.otf');
	}
	
	// Función para generar un objeto de control para cada jugador
	createPlayerControls(keys, playerNumber) {
		const controls = {};
		for (const key in keys) {
			controls[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[key]]);
		}
		controls.playerNumber = playerNumber;
		return controls;
	};

	// Función para manejar colisiones entre jugadores y plataformas
	handlePlayerPlatformCollision(player, platform) {
		if (player.body.touching.down && platform.body.touching.up) {
			player.enableJump(); // Hemos tocado el suelo o una plataforma por encima, permitimos volver a saltar
		}
	};

	// Función para manejar colisiones entre jugadores y powerUps
	handlePlayerPowerUpCollision(player, powerUp) {
		// Verificar si el jugador está tocando un powerup por arriba
		if (player.body.touching.down && powerUp.body.touching.up) {
			player.enableJump();
		}
		if(player.isAttacking){
			powerUp.destroyMe();
   this.powerUpCount--;
			player.isAttacking = false;
		}
	}

	//Función para generar los powerUps
	spawnPowerUps(powerUps) {
		if (this.powerUpCount < 4) {
      let powerUp = new PowerUp(this, Phaser.Math.Between(100, 600), 0, powerUps);
      this.powerUpCount++;
    }
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		//Imagen de fondo
		this.add.image(0, 0, 'fondo').setOrigin(0, 0);

		// Crear grupo de cajas
		let powerUps = this.physics.add.group();

		// Añadir temporizador para generar una nueva caja cada 30 segundos
		this.time.addEvent({
			delay: 10000, // 10 segundos en milisegundos
			callback: () => this.spawnPowerUps(powerUps),
			loop: true
		});

		// Bala
		this.bullets = this.physics.add.group({
			classType: Bullet,
			maxSize: 10,
			runChildUpdate: true
		});

		// Crear grupo de jugadores y habilitar actualización de hijos
		this.playerGroup = this.physics.add.group({
			classType: Player,
			runChildUpdate: true
		});

		// Crear controles para los jugadores
		const player1Controls = this.createPlayerControls.call(this, {
			left: 'A',
			right: 'D',
			up: 'W',
			down: 'S',
			fire: 'SPACE'
		}, 1);
		
		const player2Controls = this.createPlayerControls.call(this, {
			left: 'LEFT',
			right: 'RIGHT',
			up: 'UP',
			down: 'DOWN',
			fire: 'ENTER'
		}, 2);
		
		// Crear jugadores y establecer su propiedad otherPlayer
		let player1 = new Player(this, 200, 0, player1Controls, this.bullets);
		let player2 = new Player(this, 500, 0, player2Controls, this.bullets);
		player1.otherPlayer = player2;
		player2.otherPlayer = player1;

		// Añadir jugadores al grupo de jugadores
		this.playerGroup.add(player1);
		this.playerGroup.add(player2);

		// Crear suelo y plataformas
		let floor = new Platform(this, 97, 391, 533);

		let platform1 = new Platform(this, 140, 289, 153);
		let platform2 = new Platform(this, 561, 316, 141);
		let platform3 = new Platform(this, 370, 227, 160);
		let platform4 = new Platform(this, 45, 196, 143);
		let platform5 = new Platform(this, 589, 175, 121);		
		
		// Habilitar colisiones en los cuerpos de los jugadores
		player1.body.onCollide = true;
		player2.body.onCollide = true;

		// Añadir colisiones entre jugadores y plataformas usando un bucle
		const platforms = [floor, platform1, platform2, platform3, platform4, platform5];
		for (const player of this.playerGroup.getChildren()) {
			for (const platform of platforms) {
				this.physics.add.collider(player, platform, () => this.handlePlayerPlatformCollision(player, platform));
			}
		}

		this.physics.add.collider(player1, powerUps, (player, powerUp) => {
			this.handlePlayerPowerUpCollision(player, powerUp);
			player.touchingPowerUp = true;
		});

		// Añadir colisiones entre suelo, cajas y jugadores
		this.physics.add.collider(floor, powerUps);
		this.physics.add.collider(player1, powerUps, (player, powerUp) => {
			this.handlePlayerPowerUpCollision(player, powerUp);
			player.touchingPowerUp = true;
		});
		this.physics.add.collider(player2, powerUps, (player, powerUp) => {
			this.handlePlayerPowerUpCollision(player, powerUp);
			player.touchingPowerUp = true;
		});


		// Añadir colisiones entre cajas y plataformas
		this.physics.add.collider(powerUps, platform1);
		this.physics.add.collider(powerUps, platform2);
		this.physics.add.collider(powerUps, platform3);
		this.physics.add.collider(powerUps, platform4);
		this.physics.add.collider(powerUps, platform5);

		//Añadir colisiones entre bala y plataformas
		this.physics.add.collider(this.bullets, floor, (f, b)=>{
			b.destroy();
		});
		this.physics.add.collider(this.bullets, platform1, (f, b)=>{
			b.destroy();
		});
		this.physics.add.collider(this.bullets, platform2, (f, b)=>{
			b.destroy();
		});
		this.physics.add.collider(this.bullets, platform3, (f, b)=>{
			b.destroy();
		});
		this.physics.add.collider(this.bullets, platform4, (f, b)=>{
			b.destroy();
		});
		this.physics.add.collider(this.bullets, platform5, (f, b)=>{
			b.destroy();
		});

		this.physics.add.collider(this.bullets, powerUps, (f, b)=>{
			f.play('hit')
			b.destroy();
		});

		//añadir colisiones entre bala y jugadores
		this.physics.add.collider(this.playerGroup, this.bullets, (player, bullet) => {
			if (bullet.playerNumber !== player.controls.playerNumber) {
				player.takeDamage();
				bullet.destroy();
			}
		});



		// Escuchar eventos de colisión en el mundo
		this.physics.world.on('collide', (gameObject1, gameObject2, body1, body2) => {
			for (const player of this.playerGroup.getChildren()) {
				if ((gameObject1 === player && gameObject2 === floor) || (gameObject1 === floor && gameObject2 === player)) {
					player.enableJump();
				}

				if (gameObject1 === player && powerUps.contains(gameObject2)) {
					if (gameObject1.isAttackInProcess()) {
						gameObject2.destroyMe();
					}
				}
			}
		});

		// Añadir evento para mostrar texto cuando un jugador muere		
		this.playerGroup.getChildren().forEach(player => {
			player.on('died', () => {
				const winnerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Jugador ${player.otherPlayer.controls.playerNumber} ha ganado`, { fontSize: '68px', fill: '#ff0000', fontFamily: 'font' });
				winnerText.setOrigin(0.5);
				this.powerUpCount = 0;
				setTimeout(() => {
					this.scene.restart();
				}, 3000);
			});
		});

	}
}
