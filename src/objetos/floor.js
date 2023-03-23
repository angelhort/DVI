/**
 * Clase que representa el suelo, es de tipo Sprite pero no tiene una imagen asociada
 * Tendra un collider para que los personajes no caigan por debajo
 */
export default class Floor extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, scene.sys.game.canvas.height-y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this, true);

    this.scene.physics.add.collider(this);

    // Cambiamos el tamaño del body
    this.body.width = 534;
    this.body.height = 8;
  }
}