var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', { preload: preload, create: create, update: update });

var player1;
var player2;
var platforms;

function preload() {
  game.load.image('player1', './assets/jugador1.png');
  game.load.image('player2', './assets/jugador2.png');
  game.load.image('platform', './assets/platform.png');

  // cargamos las pistas de audio
  game.load.audio('jump', './assets/jump.mp3');
  game.load.audio('shoot', './assets/shoot.wav');
}

function create() {
  // creamos las plataformas
  platforms = game.add.group();
  platforms.enableBody = true;
  var platform = platforms.create(0, game.world.height - 64, 'platform');
  platform.scale.setTo(2, 2);
  platform.body.immovable = true;

  // creamos a los jugadores
  var player1Controls = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    fire: game.input.keyboard.addKey(Phaser.Keyboard.F)
  };
  player1 = new Player(game, 100, game.world.height - 150, 'player1', player1Controls);
  player1.weapon = new Weapon(game, 'bullet', 10, player1.sprite);

  var player2Controls = {
    left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
    down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
    fire: game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  };
  player2 = new Player(game, 500, game.world.height - 150, 'player2', player2Controls);
  player2.weapon = new Weapon(game, 'bullet', 10, player2.sprite);
}

function update() {
  // comprobamos si los jugadores se están tocando
  game.physics.arcade.collide(player1.sprite, player2.sprite);

  // comprobamos las colisiones de los jugadores con las plataformas
  game.physics.arcade.collide(player1.sprite, platforms);
  game.physics.arcade.collide(player2.sprite, platforms);

  // actualizamos los jugadores
  player1.update();
  player2.update();
}
