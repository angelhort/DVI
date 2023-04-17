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
		this.load.image('catedral', 'assets/PixelArt/backgroundPlataformas.png');
		this.load.image('velocidad', 'assets/PixelArt/velocidad.png');
		this.load.image('salto', 'assets/PixelArt/salto.png');
		this.load.image('cadencia', 'assets/PixelArt/cadencia.png');
		this.load.image('velocidadColor', 'assets/PixelArt/velocidadColor.png');
		this.load.image('saltoColor', 'assets/PixelArt/saltoColor.png');
		this.load.image('cadenciaColor', 'assets/PixelArt/cadenciaColor.png');
		this.load.spritesheet('amancio', 'assets/PixelArt/amancioAnimaciones.png', {frameWidth: 48, frameHeight: 48})
		this.load.spritesheet('rajoy', 'assets/PixelArt/rajoyAnimaciones.png', {frameWidth: 48, frameHeight: 48})
		this.load.spritesheet('powerup', 'assets/PixelArt/powerUpAnimacion.png', {frameWidth: 44, frameHeight: 44})
		this.load.spritesheet('billete', 'assets/PixelArt/billete.png', {frameWidth: 15, frameHeight: 9});
		this.load.spritesheet('pp', 'assets/PixelArt/pp.png', {frameWidth: 15, frameHeight: 15});
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
		if(player.body.touching.down && platform.body.touching.up){
			player.enableJump(); // Hemos tocado el suelo o una plataforma por encima, permitimos volver a saltar
			player.canShoot =  true; // Permitimos atacar al principio de ronda al caer
		}
	};

	// Función para manejar colisiones entre jugadores y powerUps
	handlePlayerPowerUpCollision(player, powerUp) {
		// Verificar si el jugador está tocando un powerup por arriba
		if (player.body.touching.down && powerUp.body.touching.up) {
			player.enableJump();
		}
	}

	//Función para generar los powerUps
	spawnPowerUps(powerUps) {
		if (this.powerUpCount < 4) {
			let powerUp = new PowerUp(this, Phaser.Math.Between(100, 600), 0, powerUps);
			this.powerUpCount++;
    	}
	}

	getRandomPowerUpType() {
		const powerUpTypes = ["salto", "velocidad", "cadencia"];
		const randomIndex = Math.floor(Math.random() * powerUpTypes.length);
		return powerUpTypes[randomIndex];
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {

		// Recogemos datos de personajes
		const player1Character = data.player1Character;
    	const player2Character = data.player2Character;
		const player1Bullets = data.player1Bullets;
    	const player2Bullets = data.player2Bullets;

		//Imagenes de los powerUps

		//Imagenes de los powerUps
		



		// Recogemos los datos de la escena
		const fondo = data.fondo;
		const plataformas = data.plataformas;

		this.powerUpText = this.add.text(10, 10, "", { fontSize: "32px", fill: "#ffffff" });
		//Imagen de fondo
		this.add.image(0, 0, fondo).setOrigin(0, 0);

		// Imágenes de los power-ups
		var imagenPUVelocidadJugador1 = this.add.image(30, 0, 'velocidad').setOrigin(0, 0).setScale(0.2); // Esquina superior izquierda
		var imagenPUCadenciaJugador1 = this.add.image(70, 0, 'cadencia').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUVelocidad
		var imagenPUSaltoJugador1 = this.add.image(110, 0, 'salto').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUCadencia

		var imagenPUVelocidadJugador2 = this.add.image(560, 0, 'velocidad').setOrigin(0, 0).setScale(0.2); // Esquina superior izquierda
		var imagenPUCadenciaJugador2 = this.add.image(600, 0, 'cadencia').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUVelocidad
		var imagenPUSaltoJugador2 = this.add.image(640, 0, 'salto').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUCadencia

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

		// Crear grupo de plataformas
		const platforms = [];

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
		let player1 = new Player(this, 200, 0, player1Controls, player1Character, player1Bullets);
		let player2 = new Player(this, 500, 0, player2Controls, player2Character, player2Bullets);

		// Añadir jugadores al grupo de jugadores
		this.playerGroup.add(player1);
		this.playerGroup.add(player2);

		// Crear plataformas
		for (const plataforma of Object.values(plataformas)) {
			let { x, y, width, height } = plataforma;
			let platform = new Platform(this, x, y, width, height);
			platforms.push(platform);
		}
		
		// Habilitar colisiones entre jugadores y plataformas
		this.playerGroup.getChildren().forEach(player => {
			platforms.forEach(platform => {
				this.physics.add.collider(player, platform, (player, platform) => {
					this.handlePlayerPlatformCollision(player, platform);
				});
			});
		});

		// Habilitar colisiones entre jugadores y powerUps
		this.playerGroup.getChildren().forEach(player => {
			this.physics.add.collider(player, powerUps, (player, powerUp) => {
				this.handlePlayerPowerUpCollision(player, powerUp);
				player.touchingPowerUp = true;
			});
		});


		// Añadir colisiones entre powerUps y plataformas
		this.physics.add.collider(powerUps, platforms);

		// Añadir colisiones entre bala y plataformas
		this.physics.add.collider(this.bullets, platforms, (f, b)=>{
			b.destroy();
		});

		// Añadir colisiones entre bala y jugadores
		this.physics.add.collider(this.playerGroup, this.bullets, (player, bullet) => {
			if (bullet.playerNumber !== player.controls.playerNumber) {
				player.takeDamage();
				bullet.destroy();
			}
		});

		

		// Añadir colisiones entre balas y powerUps
		this.physics.add.collider(this.bullets, powerUps, (bullet, powerUp) => {
			const player = bullet.player;
			const randomPowerUpType = this.getRandomPowerUpType();
			console.log(randomPowerUpType);
			player.applyPowerUpType(randomPowerUpType);
			bullet.destroy();
			powerUp.destroyMe();
			this.powerUpCount--;
			const playerNumber = player.controls.playerNumber;
			var powerUpText = this.add.text("");
			if(playerNumber == "1"){
				if(randomPowerUpType == "velocidad"){
					var imagenPUVelocidadColorJugador1 = this.add.image(30, 0, 'velocidadColor').setOrigin(0, 0).setScale(0.2); // Esquina superior izquierda
					setTimeout(() => {
						imagenPUVelocidadColorJugador1.destroy()
					}, 7000);
				}
				else if(randomPowerUpType == "cadencia"){
					var imagenPUCadenciaColorJugador1 = this.add.image(70, 0, 'cadenciaColor').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUVelocidad
					setTimeout(() => {
						imagenPUCadenciaColorJugador1.destroy()
					}, 7000);
				}
				else{
					var imagenPUSaltoColorJugador1 = this.add.image(110, 0, 'saltoColor').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUCadencia
					setTimeout(() => {
						imagenPUSaltoColorJugador1.destroy()
					}, 7000);
				}
			}
			else{
				if(randomPowerUpType == "velocidad"){
					var imagenPUVelocidadColorJugador2 = this.add.image(560, 0, 'velocidadColor').setOrigin(0, 0).setScale(0.2); // Esquina superior izquierda
					setTimeout(() => {
						imagenPUVelocidadColorJugador2.destroy()
					}, 7000);
				}
				else if(randomPowerUpType == "cadencia"){
					var imagenPUCadenciaColorJugador2 = this.add.image(600, 0, 'cadenciaColor').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUVelocidad
					setTimeout(() => {
						imagenPUCadenciaColorJugador2.destroy()
					}, 7000);
				}
				else{
					var imagenPUSaltoColorJugador2 = this.add.image(640, 0, 'saltoColor').setOrigin(0, 0).setScale(0.2); // A la derecha de imagenPUCadencia
					setTimeout(() => {
						imagenPUSaltoColorJugador2.destroy()
					}, 7000);
				}
			}

			setTimeout(() => {
				powerUpText.destroy()
			}, 7000);
		});


		// Escuchar eventos de colisión en el mundo
		this.physics.world.on('collide', (gameObject1, gameObject2, body1, body2) => {
			for (const player of this.playerGroup.getChildren()) {

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
				const winnerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Jugador ${player.controls.playerNumber === 1 ? 2 : 1} ha ganado`, { fontSize: '68px', fill: '#ff0000', fontFamily: 'font' });
				winnerText.setOrigin(0.5);
				setTimeout(() => {
					this.scene.restart();
				}, 3000);
				this.powerUpCount = 0;
			});
		});
	}
}
