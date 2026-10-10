let bandit;
let banditImg;
let banditcollided;
let banditcollidedImg;
let ground;
let groundImg;
let invisibleground;
let score = 0;
let cloudOne;
let cloudOneImg;
let cloudTwo;
let cloudTwoImg;
let cloudGroup
let obstacles1,obstacles2;
let obstaclesGroup
let gameOver;
let gameOverImg;
let restart;
let restartImg;

const PLAY = 1;
const END = 1;
let gameState = PLAY;

function preload(){
    banditImg = loadAnimation("band-1.png","band-2.png","band-3.png","band-4.png","band-5.png","band-6.png")
    banditcollidedImg = loadImage("banditcollided.png")

    groundImg = loadImage("chão.png")

    cloudOneImg = loadImage("nuvem-1.png")
    cloudTwoImg = loadImage("nuvem-2.png")

    obstacles1 = loadImage("policial-1.png")
    obstacles2 = loadImage("foguete.png")

    restartImg = loadImage("restart (1).png")
    gameOverImg = loadImage("gameOver.png")
    
}

function setup(){
    createCanvas(1280,720)

    bandit = createSprite(50,height -65,20,50);
    bandit.addAnimation("running",banditImg);
    bandit.addAnimation("collided",banditcollidedImg);
    bandit.scale = 4;
    bandit.x = 25;

    ground = createSprite(width/2,height -10,width,125);
    ground.addImage("ground",groundImg);
    ground.scale = 2;

    invisibleground = createSprite(width/2,height +29,width,125);
    invisibleground.visible = false;

    cloudGroup = new Group();
}

function draw(){
    background("#79a9ff")

    text("score:"+ score,width -150,50);

    if(gameState === PLAY){
        ground.velocityX = -(4+3*score/1000);
        
        score += Math.max(1,Math.floor(getFrameRate()/60));

        if(ground.x<0){
            ground.x = ground.width/2;
        }
        
        if(touches.length>0||keyDown("space") && bandit.y >= height - 120){
            bandit.velocityY = -20;
            touches = []
        }

        bandit.velocityY = bandit.velocityY + 1;

        spawnClouds()
        spawnObstacles()

         if(obstaclesGroup.isTouching(bandit)){
            gameState = END;
        
        }
        
        gameOver.visible = false;
        restart.visible = false;
    }
    else if(gameState === END){
        ground.velocityX = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);
        bandit.changeAnimation("collided",banditcollided);
        bandit.velocityY = 0;
        obstaclesGroup.setLifetimeEach(-1);
        cloudGroup.setLifetimeEach(-1);
        gameOver.visible = true;
        restart.visible = true;
        if(touches.length>0||mousePressedOver(restart)){
            reset();
            touches = []
        }
    }

    bandit.collide(invisibleground)

    
    drawSprites();
}

function spawnClouds(){
    if(frameCount % 60 == 0){
        let cloud = createSprite(width +5,random(60,10),40,10);
        let time = -(4+3*score/1000);
        cloud.velocityX = time;
        let rand = Math.round(random(1,2));
        switch(rand){
            case 1:
                cloud.addImage(cloudOneImg);
                break;
            case 2: 
                cloud.addImage(cloudTwoImg);
                break;
            default:
                break;
        }
    cloud.lifetime = width / time;
    cloudGroup.add(cloud);
    cloud.depht = bandit.depht;
    bandit.depht += 1;
    }
}

function spawnObstacles(){
    if(frameCount % 120 == 0){
        let obstacles = createSprite(width + 5,height - 87,10,40);
        obstacles.velocityX = time
        switch(rand){
            case 1:
                obstacles.addImage(obstacles1);
                break;
            case 2:
                obstacles.addImage(obstacles2);
                break;
            default:
                break;
                
        }
        obstacles.lifetime = width / time;
        obstaclesGroup.add(obstacles);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    obstaclesGroup.destroyEach();
    cloudGroup.destroyEach();
    bandit.changeAnimation("running",banditImg)
    score = 0
}