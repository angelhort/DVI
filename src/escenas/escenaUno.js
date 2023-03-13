import Floor from '../objetos/floor.js';
import Animation from './animation.js';

export default class escenaUno extends Phaser.Scene {

    constructor(){
        super({ key: 'escenaUno' });
    }

    preload(){
        this.load.image("desierto", "assets/desierto.png");
    }

    create(){
        this.add.image(0, 0, "desierto").setOrigin(0, 0);
        let floor = new Floor(this, 50);
    }
}