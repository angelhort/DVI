class Bootloader extends Phaser.Scene{
    constructor(){
        super({key: "Bootloader"})
    }

    preload(){
        this.load.image("jugadorUno", "./assets/jugadorUno.png");
        this.load.image("jugadorDos", "./assets/jugador2.png");
        this.load.image("plataforma", "./assets/platform.png");
    }

    create(){
        this.add.image("jugadorUno");
    }
}

export default Bootloader;