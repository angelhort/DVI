/**
 * Escena de Título.
 * @extends Phaser.Scene
 */
export default class Title extends Phaser.Scene {
	/**
	 * Escena inicial.
	 * @extends Phaser.Scene
	 */
	constructor() {
		super({ key: 'title' });
	}

	/**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload(){
		this.load.image('start', 'assets/PixelArt/start.png');
		this.load.image('inicio', 'assets/PixelArt/backgroundStart.png');
		this.load.image('logo', 'assets/images/logo1-2.png');
		this.load.audio('miAudio9', './assets/sonidos/gamestart.mp3');
	}
	
	/**
	* Creación de los elementos de la escena inicial de juego
	*/
	create() {
		//Pintamos un fondo
		var back = this.add.image(0, 0, 'inicio').setOrigin(0, 0);

		//Pintamos un botón de Empezar
		var sprite = this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/1.5, 'start')
		var logo = this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/5, 'logo')
		sprite.setInteractive(); // Hacemos el sprite interactivo para que lance eventos

		// Escuchamos los eventos del ratón cuando interactual con nuestro sprite de "Start"
	    sprite.on('pointerdown', pointer => {
	    	console.log("pulsando");
	    });

	    sprite.on('pointerup', pointer => {
			this.scene.start('characterSelection'); //Cambiamos a la escena de menu de personajes
			this.miAudio9 = this.sound.add('miAudio9');
			this.miAudio9.play();
	    });
	}
}