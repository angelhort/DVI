import Player from '../objetos/player.js';
import PowerUp from '../objetos/powerUp.js';
import Platform from '../objetos/platform.js';
import Bullet from '../objetos/bullet.js';
import Grenade from '../objetos/grenade.js';
/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */
export default class Animation extends Phaser.Scene {
	
	constructor() {
		super({ key: 'animation' });
		// Variable para llevar la cuenta de powerUps en el juego
  		this.powerUpCount = 0;
		this.player1Wins = 0;
		this.player2Wins = 0;
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
		this.load.spritesheet('hoja', 'assets/PixelArt/hoja.png', {frameWidth: 15, frameHeight: 9});
		this.load.spritesheet('pp', 'assets/PixelArt/pp.png', {frameWidth: 15, frameHeight: 15});
		this.load.spritesheet('bomba', 'assets/PixelArt/bomba.png', {frameWidth: 15, frameHeight: 19});
		this.load.spritesheet('explosion', 'assets/PixelArt/explosion.png', { frameWidth: 128, frameHeight: 128 });
		// Sonidos
		this.load.audio('miAudio', './assets/sonidos/muerte.mp3');
		this.load.audio('miAudio2', './assets/sonidos/powerupsound1.mp3');
		this.load.audio('miAudio3', './assets/sonidos/powerupsound2.mp3');
		this.load.audio('miAudio4', './assets/sonidos/backgroundsound2.mp3');
		this.load.audio('miAudio6', './assets/sonidos/jump.mp3');
		this.load.audio('miAudio7', './assets/sonidos/lanzar1.mp3');
		this.load.audio('miAudio8', './assets/sonidos/caida.mp3');
		this.load.audio('miAudio11', './assets/sonidos/explosion.mp3');
		// Cargar fuente personalizada
  		this.loadFont('font2', 'assets/webfonts/NightmareCodehack.otf');
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
		const player1AjusteAlcance = data.player1AjusteAlcance;
		const player2AjusteAlcance = data.player2AjusteAlcance;
		const player1AjusteCadencia = data.player1AjusteCadencia;
		const player2AjusteCadencia = data.player2AjusteCadencia;
		const player1AjusteVelocidad = data.player1AjusteVelocidad;
		const player2AjusteVelocidad = data.player2AjusteVelocidad;
		const numberOfRounds = data.numberOfRounds;

		//Imagenes de los powerUps
		console.log("Numero de rondas: " + numberOfRounds);
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

		//Contador de las victorias de los jugadores
		const victoriasJugador1 = this.add.text(30, 20, "Victorias J1: " + this.player1Wins, { fontSize: '24px', color: '#5B5B5B', fontFamily: 'font2' }).setOrigin(0, -1);
		const victoriasJugador2 = this.add.text(560, 20, "Victorias J2: " + this.player2Wins, { fontSize: '24px', color: '#5B5B5B', fontFamily: 'font2' }).setOrigin(0, -1);


		//Número de rondas
		this.roundsText = this.add.text(310, 20, "Rondas: " + numberOfRounds, { fontSize: '24px', color: '#5B5B5B', fontFamily: 'font2' }).setOrigin(0, -1);

		// Crear grupo de cajas
		let powerUps = this.physics.add.group();

		// Añadir temporizador para generar una nueva caja cada 4 segundos
		this.time.addEvent({
			delay: 4000, // 4 segundos en milisegundos
			callback: () => this.spawnPowerUps(powerUps),
			loop: true
		});

		// Bala
		this.bullets = this.physics.add.group({
			classType: Bullet,
			maxSize: 10,
			runChildUpdate: true
		});

		// Grenade
		this.grenades = this.physics.add.group({
			classType: Grenade,
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
		let player1 = new Player(this, 100, 0, player1Controls, player1Character, player1Bullets, player1AjusteVelocidad, player1AjusteCadencia, player1AjusteAlcance);
		let player2 = new Player(this, 560, 0, player2Controls, player2Character, player2Bullets, player2AjusteVelocidad, player2AjusteCadencia, player2AjusteAlcance);

		// Musica de fondo

		//Animacion de explosion
		this.anims.create({
			key: 'explode',
			frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
			frameRate: 24,
			repeat: 0
		});

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

		//Añadir colisiones entre granadas y plataformas
		this.physics.add.collider(this.grenades, platforms);
		//Añadir colisiones entre granadas y jugadores
		this.physics.add.collider(this.playerGroup, this.grenades);
		

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
			this.miAudio2 = this.sound.add('miAudio2');
			this.miAudio2.play();
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
				powerUpText.destroy();
				this.miAudio3 = this.sound.add('miAudio3');
				this.miAudio3.play();
			}, 7000);
		});

		// Añadir colisiones entre granadas y powerUps
		this.physics.add.collider(this.grenades, powerUps, (grenade, powerUp) => {
			const player = grenade.player;
			this.miAudio2 = this.sound.add('miAudio2');
			this.miAudio2.play();
			const randomPowerUpType = this.getRandomPowerUpType();
			console.log(randomPowerUpType);
			player.applyPowerUpType(randomPowerUpType);
			grenade.setDestruido();
			grenade.destroy();
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
				powerUpText.destroy();
				this.miAudio3 = this.sound.add('miAudio3');
				this.miAudio3.play();
			}, 7000);
		});

		if (this.player1Wins == 0 && this.player2Wins == 0){
			this.miAudio4 = this.sound.add('miAudio4');
			this.miAudio4.volume = 0.2;
			this.miAudio4.play();
		}

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
				const winningPlayerNumber = player.controls.playerNumber === 1 ? 2 : 1;
				if (winningPlayerNumber === 1) {
					player1.dance();
					this.player1Wins++;
				} else {
					player2.dance();
					this.player2Wins++;
				}
		
				var tiempoEspera;
				if(this.player1Wins == numberOfRounds || this.player2Wins == numberOfRounds){
					const winnerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Jugador ${winningPlayerNumber} ha ganado la partida`, { fontSize: '50px', fill: '#FFD700', fontFamily: 'font2' });
					winnerText.setOrigin(0.5);
					tiempoEspera = 7000;
				}
				else{
					const winnerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Jugador ${winningPlayerNumber} ha ganado`, { fontSize: '68px', fill: '#ff0000', fontFamily: 'font2' });
					winnerText.setOrigin(0.5);
					tiempoEspera = 3000;
				}
		
				setTimeout(() => {
					
					if (this.player1Wins >= numberOfRounds || this.player2Wins >= numberOfRounds) {
						this.miAudio4.stop();
						this.scene.start('characterSelection');
						this.player1Wins = 0;
						this.player2Wins = 0;

					} else {
						this.scene.restart();
					}
				}, tiempoEspera);
				this.powerUpCount = 0;
			});
		});
		this.physics.world.drawDebug = false;
  		this.toggleDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(this.toggleDebug)) {
		  if (this.physics.world.drawDebug) {
			this.physics.world.drawDebug = false;
			this.physics.world.debugGraphic.clear();
		  }
		  else {
			this.physics.world.drawDebug = true;
		  }
		}
	  }
}
