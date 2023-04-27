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
        this.load.spritesheet('irmandinio', 'assets/PixelArt/irmandinioAnimaciones.png', {frameWidth: 48, frameHeight: 48})
        this.loadFont('font', 'assets/webfonts/AncientModernTales.otf');
        this.load.audio('miAudio5', './assets/sonidos/backgroundsound.mp3');
        this.load.audio('miAudio10', './assets/sonidos/click.mp3');
	}

    /**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {

        this.fondo = this.add.image(0, 0, 'fondo2').setOrigin(0, 0);

        // Crear un menú de selección de personajes
        const characterSelectionMenu = this.add.container();

        // Crear los sprites de los personajes
        const amancio = this.add.sprite(this.cameras.main.centerX - 80, this.cameras.main.centerY, 'amancio', 0);
        const rajoy = this.add.sprite(this.cameras.main.centerX + 80, this.cameras.main.centerY, 'rajoy', 0);
        const rosalia = this.add.sprite(this.cameras.main.centerX + 250, this.cameras.main.centerY, 'rosalia', 0);
        const irmandinio = this.add.sprite(this.cameras.main.centerX - 250, this.cameras.main.centerY, 'irmandinio', 0);

        // Añadir texto debajo de cada sprite
        const amancioText = this.add.text(amancio.x+5, amancio.y + amancio.height / 2 + 10, 'Amancio', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const rajoyText = this.add.text(rajoy.x+5, rajoy.y + rajoy.height / 2 + 10, 'Rajoy', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const rosaliaText = this.add.text(rosalia.x+5, rosalia.y + rosalia.height / 2 + 10, 'Rosalia De Castro', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const irmandinioText = this.add.text(irmandinio.x+5, irmandinio.y + irmandinio.height / 2 + 10, 'Irmandiño', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

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
        this.anims.create({
            key: 'idleirmandinio',
            frames: this.anims.generateFrameNumbers('irmandinio', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        amancio.anims.play('idleamancio');
        rajoy.anims.play('idlerajoy');
        rosalia.anims.play('idlerosalia');
        irmandinio.anims.play('idleirmandinio');

        // Añadir interactividad a los sprites
        amancio.setInteractive();
        rajoy.setInteractive();
        rosalia.setInteractive();
        irmandinio.setInteractive();

        // Permitir a los jugadores elegir personajes
        let player1Turn = true;
        let player2Turn = false;
        let player1Character;
        let player2Character;
        let player1Bullets;
        let player2Bullets;
        let player1AjusteAlcance;
        let player2AjusteAlcance;
        let player1AjusteVelocidad;
        let player2AjusteVelocidad;
        let player1AjusteCadencia;
        let player2AjusteCadencia;
        let player1Granada;
        let player2Granada;

        this.miAudio5 = this.sound.add('miAudio5');
        this.miAudio5.volume = 0.2;
        this.miAudio5.play();

        let miAudioAux = this.miAudio5;
        amancio.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            if (player1Turn) {
                player1Character = 'amancio';
                player1Bullets = 'billete';
                player1Turn = false;
                player2Turn = true;
                player1AjusteAlcance = 1.1;
                player1AjusteCadencia = 0.8;
                player1AjusteVelocidad = 1.1;
                player1Granada = false;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'amancio';
                player2Bullets = 'billete';
                player2AjusteAlcance = 1.1;
                player2AjusteCadencia = 0.8;
                player2AjusteVelocidad = 1.1;
                player2Granada = false;
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets,
                    player1AjusteAlcance,
                    player2AjusteAlcance,
                    player1AjusteVelocidad,
                    player2AjusteVelocidad,
                    player1AjusteCadencia,
                    player2AjusteCadencia,
                    player1Granada,
                    player2Granada,
                    miAudioAux
                });
            }
        });

        rajoy.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            if (player1Turn) {
                player1Character = 'rajoy';
                player1Bullets = 'pp';
                player1Turn = false;
                player2Turn = true;
                player1AjusteAlcance = 1;
                player1AjusteCadencia = 0.8;
                player1AjusteVelocidad = 0.9;
                player1Granada = false;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'rajoy';
                player2Bullets = 'pp';
                player2AjusteAlcance = 1;
                player2AjusteCadencia = 0.8;
                player2AjusteVelocidad = 0.9;
                player2Granada = false;
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets,
                    player1AjusteAlcance,
                    player2AjusteAlcance,
                    player1AjusteVelocidad,
                    player2AjusteVelocidad,
                    player1AjusteCadencia,
                    player2AjusteCadencia,
                    player1Granada,
                    player2Granada,
                    miAudioAux
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
                player1AjusteAlcance = 0.7;
                player1AjusteCadencia = 0.4;
                player1AjusteVelocidad = 1;
                player1Granada = false;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'rosalia';
                player2Bullets = 'hoja';
                player2AjusteAlcance = 0.7;
                player2AjusteCadencia = 0.4;
                player2AjusteVelocidad = 1;
                player2Granada = false;
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets,
                    player1AjusteAlcance,
                    player2AjusteAlcance,
                    player1AjusteVelocidad,
                    player2AjusteVelocidad,
                    player1AjusteCadencia,
                    player2AjusteCadencia,
                    player1Granada,
                    player2Granada,
                    miAudioAux
                });
            }
        });

        irmandinio.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            if (player1Turn) {
                player1Character = 'irmandinio';
                player1Bullets = 'bomba';
                player1Turn = false;
                player2Turn = true;
                player1AjusteAlcance = 0.7;
                player1AjusteCadencia = 0.4;
                player1AjusteVelocidad = 1;
                player1Granada = true;
                this.playerText.setText('Selecciona tu personaje Jugador 2');
            } else if (player2Turn) {
                player2Character = 'irmandinio';
                player2Bullets = 'bomba';
                player2AjusteAlcance = 0.7;
                player2AjusteCadencia = 0.4;
                player2AjusteVelocidad = 1;
                player2Granada = true;
                this.scene.launch('sceneSelection', {
                    player1Character,
                    player2Character,
                    player1Bullets,
                    player2Bullets,
                    player1AjusteAlcance,
                    player2AjusteAlcance,
                    player1AjusteVelocidad,
                    player2AjusteVelocidad,
                    player1AjusteCadencia,
                    player2AjusteCadencia,
                    player1Granada,
                    player2Granada,
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
        characterSelectionMenu.add(irmandinio);
        characterSelectionMenu.add(irmandinioText);

        // Sonido

        // Si cambiamos de escena borramos lo de esta escena
        this.scene.get('sceneSelection').events.on('start', () => {
            characterSelectionMenu.destroy();
            this.playerText.destroy();
            this.fondo.destroy();
        });
    }
}