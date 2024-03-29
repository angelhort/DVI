/**
 * Escena de Título.
 * @extends Phaser.Scene
 */

export default class SceneSelection extends Phaser.Scene {

    /**
	 * Escena menu escenas.
	 * @extends Phaser.Scene
	 */

	constructor() {
		super({ key: 'sceneSelection' });
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
        this.load.image('catedralMini', 'assets/PixelArt/backgroundPlataformasMini.png');
        this.load.image('murallaMini', 'assets/PixelArt/backgroundMurallaMini.png');
        this.load.image('playaMini', 'assets/PixelArt/backgroundCatedralesMini.png');
        this.load.image('puenteMini', 'assets/PixelArt/backgroundPuenteMini.png');
        this.load.image('playa', 'assets/PixelArt/backgroundCatedralesPlataformas.png');
        this.load.image('muralla', 'assets/PixelArt/backgroundMurallaPlataformas.png');
        this.load.image('puente', 'assets/PixelArt/backgroundPuentePlataformas.png');
        this.load.image('arrow_left', 'assets/PixelArt/flechaIzquierda.png');
        this.load.image('arrow_right', 'assets/PixelArt/flechaDerecha.png');
        this.load.image('checkboxUnchecked', 'assets/PixelArt/checkboxUnchecked.png');
        this.load.image('checkboxChecked', 'assets/PixelArt/checkboxChecked.png');
        this.loadFont('font', 'assets/webfonts/AncientModernTales.otf');
	}

    /**
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {

        const player1Character = data.player1Character;
    	const player2Character = data.player2Character;
		const player1Bullets = data.player1Bullets;
    	const player2Bullets = data.player2Bullets;
        let player1AjusteAlcance = data.player1AjusteAlcance;
        let player2AjusteAlcance = data.player2AjusteAlcance;
        let player1AjusteVelocidad = data.player1AjusteVelocidad;
        let player2AjusteVelocidad = data.player2AjusteVelocidad;
        let player1AjusteCadencia = data.player1AjusteCadencia;
        let player2AjusteCadencia = data.player2AjusteCadencia;
        let player1Granada = data.player1Granada;
        let player2Granada = data.player2Granada;
        this.miAudio5 = data.miAudioAux;

        this.fondo = this.add.image(0, 0, 'fondo2').setOrigin(0, 0);

        // Crear un menú de selección de escena
        const sceneSelectionMenu = this.add.container();

        // Crear los sprites de las escenas
        const catedral = this.add.sprite(this.cameras.main.centerX - 80, this.cameras.main.centerY, 'catedralMini', 0);
        const muralla = this.add.sprite(this.cameras.main.centerX + 80, this.cameras.main.centerY, 'murallaMini', 0);
        const playa = this.add.sprite(this.cameras.main.centerX + 250, this.cameras.main.centerY, 'playaMini', 0);
        const puente = this.add.sprite(this.cameras.main.centerX - 250, this.cameras.main.centerY, 'puenteMini', 0);

        // Añadir texto debajo de cada sprite
        const catedralText = this.add.text(catedral.x, catedral.y + catedral.height / 2 + 10, 'Catedral de Santiago de Compostela', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const murallaText = this.add.text(muralla.x, muralla.y + muralla.height / 2 + 10, 'Muralla de Lugo', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const playaText = this.add.text(playa.x, playa.y + playa.height / 2 + 10, 'Playa de las Catedrales', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const puenteText = this.add.text(puente.x, puente.y + puente.height / 2 + 10, 'Puente del Milenio', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Texto para la selección de escena
        this.playerText = this.add.text(this.cameras.main.centerX, 50, 'Selecciona la escena de combate', { fontSize: '48px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Crear un selector de rondas
        const roundsSelectionContainer = this.add.container();
        const roundsText = this.add.text(this.cameras.main.centerX-80, this.cameras.main.centerY + 90, 'Rondas:', { fontSize: '20px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        
        roundsSelectionContainer.add(roundsText);

        var numberOfRounds = 5;
        
        const leftArrow = this.add.image(roundsText.x - 50, roundsText.y + 30, 'arrow_left').setInteractive().setScale(0.008);
        const rightArrow = this.add.image(roundsText.x + 50, roundsText.y + 30, 'arrow_right').setInteractive().setScale(0.008);
        const selectedRoundsText = this.add.text(roundsText.x, roundsText.y + 30, numberOfRounds, { fontSize: '20px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        // Añadir interactividad a las flechas
        leftArrow.on('pointerdown', () => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            numberOfRounds = Math.max(5, numberOfRounds - 2);
            selectedRoundsText.setText(numberOfRounds);
        });
    
        rightArrow.on('pointerdown', () => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            numberOfRounds = Math.min(9, numberOfRounds + 2);
            selectedRoundsText.setText(numberOfRounds);
        });

        let checkbox = this.add.image(selectedRoundsText.x +140, selectedRoundsText.y+17, 'checkboxUnchecked').setInteractive().setScale(0.2);
        let checkboxChecked = this.add.image(selectedRoundsText.x +140, selectedRoundsText.y+17, 'checkboxChecked').setInteractive().setScale(0.2);
        checkboxChecked.setVisible(false);
        const checkBoxText = this.add.text(checkbox.x, checkbox.y-45, 'Modo Granada:', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        let checkBoxActivated = false;
        checkbox.on('pointerdown', () => {
            checkBoxActivated = true;
        player1AjusteAlcance = 1;
        player2AjusteAlcance = 1;
        player1AjusteVelocidad = 1;
        player2AjusteVelocidad = 1;
        player1AjusteCadencia = 1;
        player2AjusteCadencia = 1;
        player1Granada = checkBoxActivated;
        player2Granada = checkBoxActivated;
        checkbox.setVisible(false);
        checkboxChecked.setVisible(true);
        });

        

        checkboxChecked.on('pointerdown', () => {
            checkBoxActivated = false;
            player1AjusteAlcance = data.player1AjusteAlcance;
            player2AjusteAlcance = data.player2AjusteAlcance;
            player1AjusteVelocidad = data.player1AjusteVelocidad;
            player2AjusteVelocidad = data.player2AjusteVelocidad;
            player1AjusteCadencia = data.player1AjusteCadencia;
            player2AjusteCadencia = data.player2AjusteCadencia;
            player1Granada = data.player1Granada;
            player2Granada = data.player2Granada;
            checkbox.setVisible(true);
            checkboxChecked.setVisible(false);
        });
        
        // Añadir interactividad a los sprites
        catedral.setInteractive();
        muralla.setInteractive();
        playa.setInteractive();
        puente.setInteractive();

        let fondo;
        let plataformas;

        catedral.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            fondo = 'catedral';
            plataformas = {
                platform1: { x: 140, y: 289, width: 153, height: 7 },
                platform2: { x: 561, y: 316, width: 141, height: 7 },
                platform3: { x: 370, y: 227, width: 160, height: 7 },
                platform4: { x: 45, y: 196, width: 143, height: 7 },
                platform5: { x: 589, y: 175, width: 121, height: 7 },
                platform6: { x: 97, y: 391, width: 533, height: 7}
            };
            this.scene.launch('animation', {
                fondo,
                plataformas,
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
                numberOfRounds
            });
        });

        muralla.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            fondo = 'muralla';
            plataformas = {
                platform1: { x: 196, y: 248, width: 178, height: 15 },
                platform3: { x: 360, y: 98, width: 120, height: 15 },
                platform4: { x: 78, y: 160, width: 181, height: 14 },
                platform5: { x: 600, y: 86, width: 103, height: 15 },
                platform6: { x: 72, y: 389, width: 359, height: 14}, 
                platform7: { x: 506, y: 388, width: 197, height: 13},
                platform9: { x: 36, y: 300, width: 95, height: 16},
                platform10: { x: 453, y: 195, width: 105, height: 13},
                platform11: { x: 664, y: 194, width: 39, height: 13},
                platform12: { x: 664, y: 324, width: 40, height: 16},
                platform13: { x: 561, y: 270, width: 44, height: 15},
                platform14: { x: 705, y: 1, width: 10, height: 400},
                platform15: { x: 546, y: 196, width: 14, height: 128},
                platform16: { x: 483, y: 183, width: 15, height: 11},
                platform17: { x: 244, y: 351, width: 15, height: 37},
            };
            this.scene.launch('animation', {
                fondo,
                plataformas,
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
                numberOfRounds
            });
        });

        playa.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            fondo = 'playa';
            plataformas = {
                platform1: { x: 16, y: 16, width: 10, height: 237 },
                platform3: { x: 26, y: 160, width: 78, height: 10 },
                platform4: { x: 26, y: 243, width: 118, height: 10 },
                platform5: { x: 80, y: 390, width: 636, height: 10 },
                platform6: { x: 236, y: 160, width: 81, height: 10}, 
                platform7: { x: 317, y: 160, width: 10, height: 170},
                platform9: { x: 197, y: 320, width: 120, height: 10},
                platform10: { x: 427, y: 160, width: 103, height: 10},
                platform11: { x: 417, y: 160, width: 10, height: 170},
                platform12: { x: 427, y: 320, width: 172, height: 10},
                platform13: { x: 620, y: 235, width: 86, height: 10},
                platform14: { x: 706, y: 16, width: 10, height: 229}
            };
            this.scene.launch('animation', {
                fondo,
                plataformas,
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
                numberOfRounds
            });
        });

        puente.on('pointerdown', pointer => {
            this.miAudio10 = this.sound.add('miAudio10');
			this.miAudio10.play();
            fondo = 'puente';
            plataformas = {
                platform1: { x: 16, y: 16, width: 21, height: 113 },
                platform2: { x: 16, y: 129, width: 131, height: 21 },
                platform3: { x: 247, y: 173, width: 238, height: 21 },
                platform4: { x: 695, y: 16, width: 21, height: 113 },
                platform5: { x: 585, y: 129, width: 131, height: 21 },
                platform6: { x: 16, y: 295, width: 253, height: 21},
                platform7: { x: 205, y: 253, width: 21, height: 42},
                platform8: { x: 464, y: 295, width: 253, height: 21},
                platform9: { x: 506, y: 253, width: 21, height: 42},
                platform10: { x: 247, y: 389, width: 238, height: 21},
            };
            this.scene.launch('animation', {
                fondo,
                plataformas,
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
                numberOfRounds
            });
        });

        // Añadir los sprites al menú
        sceneSelectionMenu.add(catedral);
        sceneSelectionMenu.add(muralla);
        sceneSelectionMenu.add(catedralText);
        sceneSelectionMenu.add(murallaText);
        sceneSelectionMenu.add(playa);
        sceneSelectionMenu.add(playaText);
        sceneSelectionMenu.add(puente);
        sceneSelectionMenu.add(puenteText);

        // Si cambiamos de escena borramos lo de esta escena
        this.scene.get('animation').events.on('start', () => {
            sceneSelectionMenu.destroy();
            this.playerText.destroy();
            this.fondo.destroy();
            leftArrow.destroy();
            rightArrow.destroy();
            selectedRoundsText.destroy();
            roundsText.destroy();
            checkbox.destroy();
            checkBoxText.destroy();
            checkboxChecked.destroy();
            this.miAudio5.stop();
        });
    }
}