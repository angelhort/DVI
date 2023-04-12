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
        const catedral = this.add.sprite(this.cameras.main.centerX - 100, this.cameras.main.centerY, 'catedralMini', 0);
        const muralla = this.add.sprite(this.cameras.main.centerX + 100, this.cameras.main.centerY, 'catedralMini', 0);

        // Añadir texto debajo de cada sprite
        const catedralText = this.add.text(catedral.x+5, catedral.y + catedral.height / 2 + 10, 'Catedral de Santiago de Compostela', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);
        const murallaText = this.add.text(muralla.x+5, muralla.y + muralla.height / 2 + 10, 'Muralla de Lugo', { fontSize: '16px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Texto para la selección de escena
        this.playerText = this.add.text(this.cameras.main.centerX, 50, 'Selecciona la escena de combate', { fontSize: '48px', color: '#ffffff', fontFamily: 'font' }).setOrigin(0.5, 0);

        // Añadir interactividad a los sprites
        catedral.setInteractive();
        muralla.setInteractive();

        let fondo;
        let plataformas;

        catedral.on('pointerdown', pointer => {
            fondo = 'catedral';
            plataformas = {
                platform1: { x: 140, y: 289, width: 153 },
                platform2: { x: 561, y: 316, width: 141 },
                platform3: { x: 370, y: 227, width: 160 },
                platform4: { x: 45, y: 196, width: 143 },
                platform5: { x: 589, y: 175, width: 121 },
                platform6: { x: 97, y: 391, width: 533}
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
            fondo = 'catedral';
            plataformas = {
                platform1: { x: 140, y: 289, width: 153 },
                platform2: { x: 561, y: 316, width: 141 },
                platform3: { x: 370, y: 227, width: 160 },
                platform4: { x: 45, y: 196, width: 143 },
                platform5: { x: 589, y: 175, width: 121 },
                platform6: { x: 97, y: 391, width: 533}
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

        // Si cambiamos de escena borramos lo de esta escena
        this.scene.get('animation').events.on('start', () => {
            sceneSelectionMenu.destroy();
            this.playerText.destroy();
            this.fondo.destroy();
        });
    }
}