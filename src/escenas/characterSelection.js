/**
 * Escena de Título.
 * @extends Phaser.Scene
 */

export default class CharacterSelection extends Phaser.Scene {

    /**
	 * Escena menu personajes.
	 * @extends Phaser.Scene
	 */

	constructor() {
		super({ key: 'characterSelection' });
	}

    loadFont(name, url){
		let newFont = new FontFace(name, `url(${url})`);
		newFont.load().then(function (loaded){
			document.fonts.add(loaded);
		}).catch(function (error){
			return error;
		});
	}

    /**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload(){
		this.load.image('start', 'assets/PixelArt/start.png');
		this.load.image('fondo2', 'assets/PixelArt/backgroundMenu.png');
        this.load.spritesheet('amancio', 'assets/PixelArt/amancioAnimaciones.png', {frameWidth: 48, frameHeight: 48})
		this.load.spritesheet('rajoy', 'assets/PixelArt/rajoyAnimaciones.png', {frameWidth: 48, frameHeight: 48})
        this.load.spritesheet('rosalia', 'assets/PixelArt/rosaliaAnimaciones.png', {frameWidth: 48, frameHeight: 48})
        this.loadFont('font', 'assets/webfonts/AncientModernTales.otf');
	}

    /**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {

        this.fondo = this.add.image(0, 0, 'fondo2').setOrigin(0, 0);

        // Crear un menú de selección de personajes
        const characterSelectionMenu = this.add.container();

        // Crear los sprites de los personajes
        const amancio = this.add.sprite(this.cameras.main.centerX - 200, this.cameras.main.centerY, 'amancio', 0);
        const rajoy = this.add.sprite(this.cameras.main.centerX + 0, this.cameras.main.centerY, 'rajoy', 0);
        const rosalia = this.add.sprite(this.cameras.main.centerX + 200, this.cameras.main.centerY, 'rosalia', 0);

        // Añadir texto debajo de cada sprite
        const amancioText = this.add.text(amancio.x+5, amancio.y + amancio.height / 2 + 10, 'Amancio', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const rajoyText = this.add.text(rajoy.x+5, rajoy.y + rajoy.height / 2 + 10, 'Rajoy', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const rosaliaText = this.add.text(rosalia.x+5, rosalia.y + rosalia.height / 2 + 10, 'Rosalia De Castro', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Texto para la selección de jugador
        this.playerText = this.add.text(this.cameras.main.centerX, 50, 'Selecciona tu personaje Jugador 1', { fontSize: '48px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Añadir animaciones a los sprites
        this.anims.create({
            key: 'idleamancio',
            frames: this.anims.generateFrameNumbers('amancio', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
          });
        this.anims.create({
            key: 'idlerajoy',
            frames: this.anims.generateFrameNumbers('rajoy', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'idlerosalia',
            frames: this.anims.generateFrameNumbers('rosalia', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        amancio.anims.play('idleamancio');
        rajoy.anims.play('idlerajoy');
        rosalia.anims.play('idlerosalia');

        // Añadir interactividad a los sprites
        amancio.setInteractive();
        rajoy.setInteractive();
        rosalia.setInteractive();

        // Permitir a los jugadores elegir personajes
        let player1Turn = true;
        let player2Turn = false;
        let player1Character;
        let player2Character;
        let player1Bullets;
        let player2Bullets;


        amancio.on('pointerdown', pointer => {
            if (player1Turn) {
                player1Character = 'amancio';
                player1Bullets = 'billete';
                player1Turn = false;
                player2Turn = true;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'amancio';
                player2Bullets = 'billete';
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets
                });
            }
        });

        rajoy.on('pointerdown', pointer => {
            if (player1Turn) {
                player1Character = 'rajoy';
                player1Bullets = 'pp';
                player1Turn = false;
                player2Turn = true;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'rajoy';
                player2Bullets = 'pp';
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets
                });
            }
        });

        rosalia.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            if (player1Turn) {
                player1Character = 'rosalia';
                player1Bullets = 'hoja';
                player1Turn = false;
                player2Turn = true;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'rosalia';
                player2Bullets = 'hoja';
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets,
                    miAudioAux
                });
            }
        });

        // Añadir los sprites al menú
        characterSelectionMenu.add(amancio);
        characterSelectionMenu.add(rajoy);
        characterSelectionMenu.add(amancioText);
        characterSelectionMenu.add(rajoyText);
        characterSelectionMenu.add(rosalia);
        characterSelectionMenu.add(rosaliaText);

        // Si cambiamos de escena borramos lo de esta escena
        this.scene.get('sceneSelection').events.on('start', () => {
            characterSelectionMenu.destroy();
            this.playerText.destroy();
            this.fondo.destroy();
        });
    }
}