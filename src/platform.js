var Platform = function(game, x, y, width, height) {
    // Inicializamos las propiedades de la plataforma
    this.game = game;
    
    // Creamos el sprite de la plataforma y lo añadimos al juego
    this.sprite = this.game.add.sprite(x, y, 'platform');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.width = width;
    this.sprite.height = height;
  };
  