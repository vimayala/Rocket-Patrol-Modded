class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)       // green
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)                                      // all white
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)      // |
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)                                     // |
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)      // vv
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height- borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0)
        this.mini01 = new Mini(this, game.config.width, borderUISize * 9, 'mini', 0, 35).setOrigin(0,0).setScale(0.5)
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        mouseInput = this.input
        this.p1Score = 0
        this.collision = false
        this.music = this.sound.add("8bitMusic", {loop: true, volume: 0.8})
        this.music.play()
        scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px', 
            backgroundColor: '#F3B141', 
            color: '#843605',
            align: 'right', padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, 0, scoreConfig)
        this.initialTime = game.settings.gameTimer / 1000
        this.timeDisplay = this.add.text(borderUISize + borderPadding + 450, borderUISize + borderPadding * 2, `0:${game.settings.gameTimer / 1000}`, scoreConfig)
        this.gameOver = false
        scoreConfig.fixedWidth = 0
        this.time.addEvent({ delay: 1000, callback: () => {this.initialTime -= 1}, callbackScope: this, loop: (!this.gameOver)});
        this.p1Rocket.setInteractive({
            draggable: true,
            useHandCursor: true
        })
        this.p1Rocket.on('drag', (pointer, dragX, dragY) => {
            this.p1Rocket.x = dragX
        })


        this.p1Rocket.on('dragend', (pointer, target) => {
            this.p1Rocket.isFiring = true
            this.p1Rocket.sfxShot.play()
        })
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            
            this.scene.restart()
            this.music.stop()
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
            this.music.stop()
        }
        this.starfield.tilePositionX -= 3.5
        if(!this.gameOver) {
            this.p1Rocket.update(Play)
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.mini01.update()
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)

        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
 
        }
        if(this.checkCollision(this.p1Rocket, this.mini01)) {
            this.p1Rocket.reset()
            this.miniExplode(this.mini01)
 
        }

        if(!this.gameOver){
            var seconds = this.initialTime % 60
            if(seconds < 10){
                this.timeDisplay.text = `${Math.floor(this.initialTime / 60)}:0${seconds}` 
            }
            else{
                this.timeDisplay.text = `${Math.floor(this.initialTime / 60)}:${seconds}`
            }
        }
        else{
            this.timeDisplay.text = `0:00` 
        }
        if(this.p1Rocket.timeFlag){
            this.initialTime -=3
            this.p1Rocket.timeFlag = false
        }
        if(this.initialTime <= 0){
            this.gameOver = true
            this.timeDisplay.text = '0:00'
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }
    }

    checkCollision(rocket, ship) {
        this.collision = true
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        ship.alpha = 0
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')
        this.initialTime += 2
    }

    miniExplode(mini) {
        mini.alpha = 0
        let boom = this.add.sprite(mini.x, mini.y, 'explosion-2').setOrigin(0, 0).setScale(0.5)
        boom.anims.play('explode-2')
        boom.on('animationcomplete', () => {
            mini.reset()
            mini.alpha = 1
            boom.destroy()
        })
        this.p1Score += mini.points
        this.scoreLeft.text = this.p1Score
        var sfxExplode2 = this.sound.add('sfx-explosion')
        sfxExplode2.setRate(1.75)
        sfxExplode2.play()
        if(mini.moveSpeed < 9){
            mini.moveSpeed *= 1.1
        }
        else{
            mini.moveSpeed = 4.5
        }
        mini.points += 1
        this.initialTime += 1
    }

}