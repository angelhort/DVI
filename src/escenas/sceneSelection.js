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
        this.load.image('playa', 'assets/PixelArt/backgroundCatedralesPlataformas.png');
        this.load.image('muralla', 'assets/PixelArt/backgroundMurallaPlataformas.png');
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

        this.fondo = this.add.image(0, 0, 'fondo2').setOrigin(0, 0);

        // Crear un menú de selección de escena
        const sceneSelectionMenu = this.add.container();

        // Crear los sprites de las escenas
        const catedral = this.add.sprite(this.cameras.main.centerX - 80, this.cameras.main.centerY, 'catedralMini', 0);
        const muralla = this.add.sprite(this.cameras.main.centerX + 80, this.cameras.main.centerY, 'murallaMini', 0);
        const playa = this.add.sprite(this.cameras.main.centerX + 250, this.cameras.main.centerY, 'playaMini', 0);
        const puente = this.add.sprite(this.cameras.main.centerX - 250, this.cameras.main.centerY, 'playaMini', 0);

        // Añadir texto debajo de cada sprite
        const catedralText = this.add.text(catedral.x, catedral.y + catedral.height / 2 + 10, 'Catedral de Santiago de Compostela', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const murallaText = this.add.text(muralla.x, muralla.y + muralla.height / 2 + 10, 'Muralla de Lugo', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const playaText = this.add.text(playa.x, playa.y + playa.height / 2 + 10, 'Playa de las Catedrales', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const puenteText = this.add.text(puente.x, puente.y + puente.height / 2 + 10, 'Puente del Milenio', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Texto para la selección de escena
        this.playerText = this.add.text(this.cameras.main.centerX, 50, 'Selecciona la escena de combate', { fontSize: '48px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Añadir interactividad a los sprites
        catedral.setInteractive();
        muralla.setInteractive();
        playa.setInteractive();
        puente.setInteractive();

        let fondo;
        let plataformas;

        catedral.on('pointerdown', pointer => {
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
                player2Bullets
            });
        });

        muralla.on('pointerdown', pointer => {
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
                player2Bullets
            });
        });

        playa.on('pointerdown', pointer => {
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
                player2Bullets
            });
        });

        puente.on('pointerdown', pointer => {
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
                player2Bullets
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
        });
    }
}