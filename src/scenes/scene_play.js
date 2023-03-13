class Scene_play extends Phaser.Scene {
    constructor(){
        super({key: "Scene_play"});
    }
    preload(){
        console.log("Se ha cargado")
    }
}

export default Scene_play;