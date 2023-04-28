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
		this.add.image(0, 0, 'inicio').setOrigin(0, 0);

		//Pintamos un botón de Empezar y el logo
		const canvasWidth = this.sys.game.canvas.width;
		const canvasHeight = this.sys.game.canvas.height;
		this.add.image(canvasWidth/2, canvasHeight/1.5, 'start').setInteractive().on('pointerdown', () => {
			console.log("pulsando");
		}).on('pointerup', () => {
			// Al pulsar el start, pasamos a la escena de selección de personaje
			this.scene.start('characterSelection');
			this.sound.add('miAudio9').play();
		});
		this.add.image(canvasWidth/2, canvasHeight/5, 'logo');
	}
}
