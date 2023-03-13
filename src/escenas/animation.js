import Knight from '../objetos/knight.js';
import Floor from '../objetos/floor.js';
import Box from '../objetos/box.js';
import Personaje from '../objetos/personaje.js';
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
		this.load.spritesheet('personajeDeath', 'assets/soldados/Yellow/Gunner_Yellow_Death.png', {frameWidth: 48, frameHeight: 48})
		this.load.spritesheet('personajeJump', 'assets/soldados/Yellow/Gunner_Yellow_Jump.png', {frameWidth: 48, frameHeight: 40})
		this.load.spritesheet('personajeRun', 'assets/soldados/Yellow/Gunner_Yellow_Run.png', {frameWidth: 48, frameHeight: 40})
		this.load.spritesheet('personajeIdle', 'assets/soldados/Yellow/Gunner_Yellow_Idle.png', {frameWidth: 48, frameHeight: 40})
		this.load.spritesheet('personajeCrouch', 'assets/soldados/Yellow/Gunner_Yellow_Crouch.png', {frameWidth: 48, frameHeight: 40})
		this.load.spritesheet('box', 'assets/Box/box.png', {frameWidth: 64, frameHeight: 64})
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		//Imagen de fondo
		this.add.image(0, 0, 'castle').setOrigin(0, 0);

		let boxes = this.physics.add.group();

		//Instanciamos nuestro personaje, que es un caballero, y la plataforma invisible que hace de suelo
		//let knight = new Knight(this, 50, 0);
		let floor = new Floor(this, 50);
		let personaje = new Personaje(this, 50, 0);
		let box1 = new Box(this, 200, 0, boxes);
		let box2 = new Box(this, 400, 0, boxes);


		let scene = this; // Nos guardamos una referencia a la escena para usarla en la función anidada que viene a continuación
		personaje.body.onCollide = true;

		this.physics.add.collider(personaje, floor, function(){
			if(scene.physics.world.overlap(personaje, floor)) {
				personaje.enableJump(); // Hemos tocado el suelo, permitimos volver a saltar
			}
		});

		this.physics.add.collider(personaje, boxes);
		this.physics.add.collider(floor, boxes);
		//this.physics.add.collider(knight, boxes);

		/*
		 * Escuchamos los eventos de colisión en el mundo para poder actuar ante ellos
		 * En este caso queremos detectar cuando el caballero colisiona con el suelo para activar el salto del personaje
		 * El salto del caballero lo desactivamos en su "clase" (archivo knight.js) para evitar dobles saltos
		 * También comprobamos si está en contacto con alguna caja mientras ataca, en ese caso destruimos la caja
		 */
		scene.physics.world.on('collide', function(gameObject1, gameObject2, body1, body2) {
			if(gameObject1 === personaje && gameObject2 === floor || gameObject1 === floor && gameObject2 === personaje){
				//knight.enableJump();
				personaje.enableJump();
			}

			/*if(gameObject1 === personaje && boxes.contains(gameObject2)){
				if(gameObject1.isAttackInProcess()) {
					gameObject2.destroyMe()
				}
			}*/
		});

		this.scene.launch('title');
	}

}
