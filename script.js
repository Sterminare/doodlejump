/* jshint esversion: 6 */

    window.onload = function(){
        game = new Phaser.Game(500, 500, Phaser.CANVAS, ' ', {
            preload: preload,
            create: create,
            update: update,
            render: render
    });
}

var player;
var platform;
var platformsGroup;
var moveOffset;
var gameOver;
var version = 'v0.2.1';

var maxPlayerHeight = -400;

var leftButton;
var rightButton;
var shootButton;



function preload(){
    
    game.load.image('platform','Assets/platform.png');
    game.load.image('player','Assets/player.png');
    game.load.image('playerJump','Assets/playerJump.png');
    game.load.image('platformMove','Assets/platformMove.png');
    game.load.image('gameOverScreen','Assets/gameOverScreen.png');
    game.stage.backgroundColor = '#EFEFEF';
}

function create(){
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    

    platformsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);

    //Create an intitial platform, create 6 random platforms afterward to initialize
    platform = game.add.sprite(100, 400, 'platform');
        platformsGroup.add(platform);
        platform.body.immovable = true;
   for (var i = 0; i < 6; i++) {
       platform = game.add.sprite(((Math.random() * 400)+ 50),platformsGroup.children[platformsGroup.children.length-1].y-((Math.random() * 100) + 50), 'platform');
       platformsGroup.add(platform);
        platform.body.immovable = true;
    }

    versionCount = game.add.text(430,20, version, {
        font: 'bold 21px',
        fill: '#000000'
    });
    versionCount.fixedToCamera = true;

    heightText = game.add.text(20, 20, "Score: 0", {
        font: 'bold 21px',
        fill: '#000000'
    });
    heightText.fixedToCamera = true;
    heightText.cameraOffset.setTo(20,20);

    player = game.add.sprite(100,300, 'player');
    player.scale.setTo(.25,.25);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 900;
    player.body.width.x = 3;

}

function update(){

    //Creates world
    game.world.setBounds(0, player.y - 500, 500, 1000);
    if (player.y < game.camera.y +200){
        game.camera.y = player.y -200;
    }

    //Player only collides with platforms if they are moving downward
    if((player.body.velocity.y > 0)){
        game.physics.arcade.collide(platformsGroup, player);
    }

    //Move left or right when A or D is pressed
    if(leftButton.isDown){
        player.body.velocity.x = -300;
    } else if(rightButton.isDown){
        player.body.velocity.x = 300;
    } else {
        player.body.velocity.x = 0;
    }



    //Bounce when hitting a platform
    if(player.body.touching.down || player.body.blocked.down){
        player.body.velocity.y = -600;
        player.loadTexture('playerJump')
        game.time.events.add(500, function() {
            player.loadTexture('player')

        })
    }

    //Scroll around the sides of the world
    if(player.body.x < -25){
        player.body.x = 525
    } else if(player.body.x > 526){
        player.body.x = -24
    }

    //Kill the player if it drops below the camera
    if(player.body.y >= game.camera.y+500){
        player.kill();
        gameOver = true;
    }

    //Remove platforms that are below the camera
    for (var i = 0; i < platformsGroup.children.length; i++) {
        if (platformsGroup.children[i].y >= game.camera.y + 500) {
            platformsGroup.children[i].destroy();
            --i;
        }
    }

    //When the highest platform is near the top of camera, generate a new platform between 0 and 150 pixels above it
    if(typeof platformsGroup.children[platformsGroup.children.length-1] != 'undefined' && platformsGroup.children[platformsGroup.children.length-1].y >= game.camera.y - 100){
        platform = game.add.sprite(((Math.random() * 360)+ 10),platformsGroup.children[platformsGroup.children.length-1].y-((Math.random() * 100) + 50), 'platform');
        platformsGroup.add(platform);
        platform.body.immovable = true;
        if((Math.random() * 10) < 2){
            platform.loadTexture('platformMove');
            platform.body.velocity.x = (Math.random() * 150 + 100);
            if (Math.random() < 0.5) {
                platform.body.velocity.x *= -1;
            }
        }
    }

    //Moving platforms
    for(var i=0; i < platformsGroup.children.length; i++){
        if(platformsGroup.children[i].key == 'platformMove'){
            if(platformsGroup.children[i].body.x > 371) {
                platformsGroup.children[i].body.velocity.x *= -1;
            } else if(platformsGroup.children[i].body.x < 11) {
                platformsGroup.children[i].body.velocity.x *= -1;
            }
        }
    }

    //Track score
    if(-1*(player.y) >= maxPlayerHeight){

    heightText.text = 'Score: ' + Math.round(-1*(player.y) + 300)
    maxPlayerHeight = Math.round(-1*(player.y));
    }

    //Do this when the player dies
    if(gameOver == true){
        platformsGroup.destroy(true);
        heightText.destroy(true);
        versionCount.destroy(true);
       // gameOverButton = game.add.button(game.camera.x,game.camera.y, 'gameOverScreen', reset, this);
       reset();

    }

}

function reset(){
    console.log('resetting');
    
    //gameOverButton.destroy();
    
    platformsGroup = game.add.physicsGroup(Phaser.Physics.ARCADE);
    //generate starting platforms
    platform = game.add.sprite(100, 400, 'platform');
    platformsGroup.add(platform);
    platform.body.immovable = true;

   for (var i = 0; i < 6; i++) {
       platform = game.add.sprite(((Math.random() * 400)+ 50),platformsGroup.children[platformsGroup.children.length-1].y-((Math.random() * 100) + 50), 'platform');
       platformsGroup.add(platform);
       platform.body.immovable = true;
    }
    
    versionCount = game.add.text(430,20, version, {
        font: 'bold 21px',
        fill: '#000000'
    });
    versionCount.fixedToCamera = true;

    heightText = game.add.text(20, 20, "Score: 0", {
        font: 'bold 21px',
        fill: '#000000'
    });
    heightText.fixedToCamera = true;
    heightText.cameraOffset.setTo(20,20);
  
    player.revive();
    player.body.x = 100;
    player.body.y = 300;

    game.world.setBounds(0, player.y - 500, 500, 1000);
    game.camera.y = 0;

    gameOver = false;
}


function render(){

}