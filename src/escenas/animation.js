import Player from '../objetos/player.js';
import Floor from '../objetos/floor.js';
import Box from '../objetos/box.js';
import Platform from '../objetos/platform.js';
/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */
export default class Animation extends Phaser.Scene {
	
	constructor() {
		super({ key: 'animation' });
	}

	preload(){
		// Cargar imágenes y spritesheets
		this.load.image('castle', 'assets/castle.gif');
		this.load.spritesheet('player', 'assets/Player/amancioAnimaciones.png', {frameWidth: 80, frameHeight: 80})
		this.load.spritesheet('box', 'assets/Box/box.png', {frameWidth: 64, frameHeight: 64})
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

	//Función para generar las cajas
	spawnBox(boxes) {
  let box = new Box(this, Phaser.Math.Between(100, 600), 0, boxes);
 };

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		//Imagen de fondo
		this.add.image(0, 0, 'castle').setOrigin(0, 0);

		// Crear grupo de cajas
		let boxes = this.physics.add.group();

		// Crear las dos primeras cajas
  this.spawnBox(boxes);
  this.spawnBox(boxes);

		// Añadir temporizador para generar una nueva caja cada 30 segundos
  this.time.addEvent({
  delay: 30000, // 30 segundos en milisegundos
  callback: () => this.spawnBox(boxes),
  loop: true
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
		let player1 = new Player(this, 200, 0, player1Controls);
		let player2 = new Player(this, 500, 0, player2Controls);
		player1.otherPlayer = player2;
		player2.otherPlayer = player1;

		// Añadir jugadores al grupo de jugadores
		this.playerGroup.add(player1);
		this.playerGroup.add(player2);

		// Crear suelo y plataformas
		let floor = new Floor(this, 100, 50);

		let platform1 = new Platform(this, 135, 200);
		let platform2 = new Platform(this, 520, 200);
		let platform3 = new Platform(this, (platform1.x + platform2.x) / 2, 150); // Crear una tercera plataforma entre las otras dos pero un poco más arriba

		// Crear cajas y añadirlas al grupo de cajas
		let box1 = new Box(this, 200, 0, boxes);	
		let box2 = new Box(this, 400, 0, boxes);

		// Detectar colisiones entre jugadores
		this.physics.add.overlap(this.playerGroup, this.playerGroup, (player1, player2) => {
			player1.takeDamage(player2);
			player2.takeDamage(player1);
		});

		// Habilitar colisiones en los cuerpos de los jugadores
		player1.body.onCollide = true;
		player2.body.onCollide = true;

		// Añadir colisiones entre jugadores y plataformas usando un bucle
		const platforms = [floor, platform1, platform2, platform3];
		for (const player of this.playerGroup.getChildren()) {
			for (const platform of platforms) {
				this.physics.add.collider(player, platform, () => this.handlePlayerPlatformCollision(player, platform));
			}
		}

		// Añadir colisiones entre suelo, cajas y jugadores
		this.physics.add.collider(floor, boxes);
		this.physics.add.collider(player1, boxes);
		this.physics.add.collider(player2, boxes);

		// Añadir colisiones entre cajas y plataformas
		this.physics.add.collider(boxes, platform1);
		this.physics.add.collider(boxes, platform2);
		this.physics.add.collider(boxes, platform3);

		// Escuchar eventos de colisión en el mundo
		this.physics.world.on('collide', (gameObject1, gameObject2, body1, body2) => {
			for (const player of this.playerGroup.getChildren()) {
				if ((gameObject1 === player && gameObject2 === floor) || (gameObject1 === floor && gameObject2 === player)) {
					player.enableJump();
				}

				if (gameObject1 === player && boxes.contains(gameObject2)) {
					if (gameObject1.isAttackInProcess()) {
						gameObject2.destroyMe();
					}
				}
			}
		});

		// Lanzar escena de título
		this.scene.launch('title');
	}

}
