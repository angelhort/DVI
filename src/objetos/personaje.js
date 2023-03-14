export default class Personaje extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'personaje');
        this.speed = 140;
        this.salto = true;
        this.isAttacking = false;
        this.scene.add.existing(this);

        this.scene.anims.create({
			key: 'idle',
			frames: scene.anims.generateFrameNumbers('personajeIdle', {start:0, end:4}),
			frameRate: 5,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'run',
			frames: scene.anims.generateFrameNumbers('personajeRun', {start:0, end:5}),
			frameRate: 5,
			repeat: -1
		});
        this.scene.anims.create({
			key: 'jump',
			frames: scene.anims.generateFrameNumbers('personajeJump', {start:0, end:1}),
			frameRate: 5,
			repeat: -1
		});
		this.scene.anims.create({
			key: 'death',
			frames: scene.anims.generateFrameNumbers('personajeDeath', {start:0, end:7}),
			frameRate: 5,
			repeat: -1
		});
        this.scene.anims.create({
			key: 'crouch',
			frames: scene.anims.generateFrameNumbers('personajeCrouch', {start:0, end:2}),
			frameRate: 5,
			repeat: 0
		});

        this.play('idle');

		// Seteamos las teclas para mover al personaje
		this.wKey = this.scene.input.keyboard.addKey('W'); //saltar
		this.aKey = this.scene.input.keyboard.addKey('A'); //izquierda
		this.sKey = this.scene.input.keyboard.addKey('S'); //parar animación
		this.dKey = this.scene.input.keyboard.addKey('D'); //derecha
		this.ctrKey = this.scene.input.keyboard.addKey('SPACE'); //atacar

        scene.physics.add.existing(this);

        // Decimos que el caballero colisiona con los límites del mundo
		this.body.setCollideWorldBounds();
    }


    preUpdate(t, dt){
        super.preUpdate(t, dt);
		// Mientras pulsemos la tecla 'A' movelos el personaje en la X
		if(this.aKey.isDown && !this.isAttacking){
			this.setFlip(true, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			
			//this.x -= this.speed*dt / 1000;
			this.body.setVelocityX(-this.speed);
		}

		// Mientras pulsemos la tecla 'D' movelos el personaje en la X
		if(this.dKey.isDown && !this.isAttacking){
			this.setFlip(false, false)
			if(this.anims.currentAnim.key !== 'run'){
				this.play('run');
			}
			//this.x += this.speed*dt / 1000;
			this.body.setVelocityX(this.speed);
		}

		// Si dejamos de pulsar 'A' o 'D' volvemos al estado de animación'idle'
		// Phaser.Input.Keyboard.JustUp y Phaser.Input.Keyboard.JustDown nos aseguran detectar la tecla una sola vez (evitamos repeticiones)
		if(Phaser.Input.Keyboard.JustUp(this.aKey) || Phaser.Input.Keyboard.JustUp(this.dKey)){
			if(this.anims.currentAnim.key !== 'attack' && this.anims.isPlaying === true){
				this.play('idle');
			}
			this.body.setVelocityX(0);
		}
		
		// Si pulsado 'S' detendremos o reanudaremos la animación de 'idle' según su estado actual
		if(Phaser.Input.Keyboard.JustDown(this.sKey)){
            console.log("entra");
            this.play('crouch');
			if(this.anims.currentAnim.key === 'idle' && this.anims.isPlaying === true){
				this.play('crouch');
			}			
		}

        // Si soltamos 'S' detendremos o reanudaremos la animación de 'idle' según su estado actual
		if(Phaser.Input.Keyboard.JustUp(this.sKey)){
			if(this.anims.currentAnim.key === 'crouch' && this.anims.isPlaying === true){
				this.play('idle');
			}		
		}

		// Si pulsamos 'W' haremos que el personaje salte
		// Mientras saltamos no podremos volver a saltar ni atacar
		if(Phaser.Input.Keyboard.JustDown(this.wKey) && !this.salto){
			this.play('jump');
			this.salto = true;
			this.body.setVelocityY(-this.speed);
		}

		// Si pulsamos 'CTRL' atacamos
		if(Phaser.Input.Keyboard.JustDown(this.ctrKey)){
			this.attack();
		}
    }
    
    enableJump(){
		if(this.salto){
			this.play('idle');			
		}
		this.salto = false;
	}

    attack(){

	}

    stopAttack(){
		this.isAttacking = false;
	}
}