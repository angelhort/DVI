var Player = function(game, x, y, spriteKey, controls) {
    // inicializamos las propiedades del jugador
    this.game = game;
    this.controls = controls;
    this.health = 100;
  
    // creamos el sprite del jugador y lo añadimos al juego
    this.sprite = this.game.add.sprite(x, y, spriteKey);
  
    // activamos la física para el sprite del jugador
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
  
    // creamos un objeto de armas para el jugador
    this.weapons = new Weapons(this.game, this.sprite);
  
    // añadimos el sonido de salto
    this.jumpSound = this.game.add.audio('jump');
  };
  
  Player.prototype.update = function() {
    // actualizamos la posición del jugador según las teclas pulsadas
    if (this.controls.left.isDown) {
      this.sprite.body.velocity.x = -150;
    } else if (this.controls.right.isDown) {
      this.sprite.body.velocity.x = 150;
    } else {
      this.sprite.body.velocity.x = 0;
    }
  
    // controlamos el salto del jugador con la tecla de salto
    if (this.controls.jump.isDown && this.sprite.body.touching.down) {
      this.sprite.body.velocity.y = -350;
      this.jumpSound.play();
    }
  
    // actualizamos el objeto de armas del jugador
    this.weapons.update();
  };