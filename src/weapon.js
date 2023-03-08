var Weapon = function(game, player, type) {
    // Inicializamos las propiedades del arma
    this.game = game;
    this.player = player;
    this.type = type;
    
    // Creamos el sprite del arma y lo añadimos al jugador
    this.sprite = this.game.add.sprite(0, 0, type);
    this.player.addChild(this.sprite);
    
    // Configuramos la física del arma
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.allowGravity = false;
    this.sprite.body.immovable = true;
    
    // Añadimos el sonido del disparo
    this.shootSound = this.game.add.audio('shoot');
  };
  
  Weapon.prototype.update = function() {
    // Apuntamos el arma en la dirección del movimiento del jugador
    if (this.player.body.velocity.x < 0) {
      this.sprite.scale.x = -1;
      this.sprite.x = -20;
    } else if (this.player.body.velocity.x > 0) {
      this.sprite.scale.x = 1;
      this.sprite.x = 20;
    }
    
    // Disparamos el arma con la tecla de disparo
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.shoot();
    }
  };
  
  Weapon.prototype.shoot = function() {
    // Creamos una bala y la disparamos en la dirección del arma
    var bullet = this.game.add.sprite(this.player.x + this.sprite.x, this.player.y - 20, 'bullet');
    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.velocity.x = this.sprite.scale.x * 400;
    this.shootSound.play();
  };
  