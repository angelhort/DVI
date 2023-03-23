/**
 * Clase que representa las plataformas, es de tipo Sprite pero no tiene una imagen asociada
 * Tendra un collider para que los personajes no caigan por debajo
 */
export default class Platform extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, width) {
      super(scene, x, y);
  
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this, true);
  
      this.scene.physics.add.collider(this);
  
      // Cambiamos el tamaño del body para ocupar todo el ancho de la escena
      this.body.width = width;
      this.body.height = 5;
    }
  }