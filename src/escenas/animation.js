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
		this.load.image('castle', 'assets/castle.gif');
		this.load.spritesheet('player', 'assets/Player/amancioAnimaciones.png', {frameWidth: 80, frameHeight: 80})
		this.load.spritesheet('box', 'assets/Box/box.png', {frameWidth: 64, frameHeight: 64})
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		//Imagen de fondo
		this.add.image(0, 0, 'castle').setOrigin(0, 0);

		let boxes = this.physics.add.group();

		this.playerGroup = this.physics.add.group({
			classType: Player,
			runChildUpdate: true
		});

			// Función para generar un objeto de control para cada jugador
		function createPlayerControls(keys, playerNumber) {
		const controls = {};
		for (const key in keys) {
			controls[key] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[key]]);
		}
		controls.playerNumber = playerNumber;
		return controls;
		}

					// Función para manejar colisiones entre jugadores y plataformas
		const handlePlayerPlatformCollision = (player, platform) => {
			if (this.physics.world.overlap(player, platform)) {
			player.enableJump(); // Hemos tocado el suelo, permitimos volver a saltar
		}
		};

		const player1Controls = createPlayerControls.call(this, {
		left: 'A',
		right: 'D',
		up: 'W',
		down: 'S',
		fire: 'SPACE'
		}, 1);
		
		const player2Controls = createPlayerControls.call(this, {
		left: 'LEFT',
		right: 'RIGHT',
		up: 'UP',
		down: 'DOWN',
		fire: 'ENTER'
		}, 2);
		
		//Instanciamos nuestro personaje, que es un caballero, y la plataforma invisible que hace de suelo
		let player1 = new Player(this, 50, 0, player1Controls);
		let player2 = new Player(this, 30, 0, player2Controls);
		// asignar el valor de "otherPlayer" a cada jugador
		player1.otherPlayer = player2;
		player2.otherPlayer = player1;

		this.playerGroup.add(player1);
  this.playerGroup.add(player2);

		let floor = new Floor(this, 50);
		let platform1 = new Platform(this, 135, 200);
		let platform2 = new Platform(this, 520, 200);
		let box1 = new Box(this, 200, 0, boxes);	
		let box2 = new Box(this, 400, 0, boxes);

		// Detectar colisiones entre los jugadores
		this.physics.add.overlap(this.playerGroup, this.playerGroup, (player1, player2) => {
			player1.takeDamage(player2);
			player2.takeDamage(player1);
		});

		player1.body.onCollide = true; // Activamos onCollide para poder detectar la colisión del caballero con el suelo
		player2.body.onCollide = true; // Activamos onCollide para poder detectar la colisión del caballero con el suelo


		let scene = this; // Nos guardamos una referencia a la escena para usarla en la función anidada que viene a continuación

		
	// Añadir colisiones entre jugadores y plataformas usando un bucle
	const platforms = [floor, platform1, platform2];
	for (const player of this.playerGroup.getChildren()) {
	   for (const platform of platforms) {
	        this.physics.add.collider(player, platform, () => handlePlayerPlatformCollision(player, platform));
	    }
	}

		this.physics.add.collider(floor, boxes);
		this.physics.add.collider(player1, boxes);
		this.physics.add.collider(player2, boxes);

		this.physics.add.collider(boxes, platform1);
		this.physics.add.collider(boxes, platform2);

		/*
		 * Escuchamos los eventos de colisión en el mundo para poder actuar ante ellos
		 * En este caso queremos detectar cuando el caballero colisiona con el suelo para activar el salto del personaje
		 * El salto del caballero lo desactivamos en su "clase" (archivo knight.js) para evitar dobles saltos
		 * También comprobamos si está en contacto con alguna caja mientras ataca, en ese caso destruimos la caja
		 */
		scene.physics.world.on('collide', function (gameObject1, gameObject2, body1, body2) {
        for (const player of scene.playerGroup.getChildren()) {
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

		this.scene.launch('title');
	}

}
