function PixiBanner(containerId, initObj) {
    const parentContainer = document.getElementById(containerId);
    const self = this;

    let app;
    let assetsLoaded = false;
    initObj = initObj || {};

    const gameDuration = 20000;

    const whenDisapear = 5000;

    let startGameTime = -1;
    let oldtime = 0;

    let char;
    const gameFieldHeight = 1024;
    const gameFieldWidth = 1024;

    var currentSpeed = 10;
    var hintShowed = false;

    var bulletsArray = [];


    let xLockSpeed = 1;

    let enemiesArray;
    const enemiesVariations = ["enemy01", "enemy02", "enemy03", "enemy04", "enemy05"];
    const enemiesAnimations = ["enemy01-an", "enemy02-an", "enemy03-an", "enemy04-an", "enemy05-an"];
    let blockTansition = 0;
    let transitionDirection = 1;
    let ypos = 0;
    const yrowSize = 40;
    let xcolSize = 0;
    const enemyRaws = 5;
    const enemyCells = 8;
    const enemiesCount = enemyRaws * enemyCells;
    let startTime = 0;
    let killedEnemies = 0;
    const xMovementSpeed = 0.005;
    const xDistScaler = 1.5;
    const yDistScaler = 1.2;


    const assetsHash = {
        "img": "img/logo_white.png",
        "enemy01-an": "img/expl01.json",
        "enemy02-an": "img/expl02.json",
        "enemy03-an": "img/expl03.json",
        "enemy04-an": "img/expl04.json",
        "enemy05-an": "img/expl05.json",

        "enemy01": "img/nlo-1.png",
        "enemy02": "img/nlo-2.png",
        "enemy03": "img/nlo-3.png",
        "enemy04": "img/nlo-4.png",
        "enemy05": "img/nlo-5.png",
        "char": "img/plane.png",
        "trasp-bg": "img/256x.png",

        "score-txt": "img/score.png",
        "time-txt": "img/timer.png",
        "icon-hand": "img/ico-hand.png",
        "bullet": "img/bullet.png",
    };


    const GameStatuses = {
        Loading: 0,
        Loaded: 1,
        InGame: 2,
        Finished: 3,
        Hided: 4,
    };

    let gameStatus = GameStatuses.Loading;
    let initAnimation = true;


    function playAnimation(sprite, str, animation, speed, autoPlay) {
        var sheet = loader.resources[assetsHash[str]].spritesheet;
        sprite.textures = sheet.animations[animation];
        sprite.animationSpeed = speed;
        if (autoPlay) {
            sprite.gotoAndPlay(1);
        }

    }

    function playAnimationFrames(sprite, str, animation, speed, frames) {
        var sheet = loader.resources[assetsHash[str]].spritesheet;
        var framesArr = sheet.animations[animation];
        var k = 1;
        if (frames[1] < frames[0]) {
            k = -1;
        }

        var totalFrames = Math.abs(frames[1] - frames[0]) + 1;

        var animationFrames = [];
        var currentFrame = frames[0];

        for (var i = 0; i < totalFrames; i++) {
            animationFrames.push(framesArr[currentFrame]);
            currentFrame += k;
        }

        sprite.textures = animationFrames;
        sprite.animationSpeed = speed;
        sprite.loop = false;
        sprite.gotoAndPlay(1);
    }


    function newAnimatedSprite(str, animation, anchor) {
        anchor = anchor || 0;
        var sheet = loader.resources[assetsHash[str]].spritesheet;
        var sp = new PIXI.AnimatedSprite(sheet.animations[animation]);
        sp.anchor.set(anchor);
        return sp;
    }

    function showEnemies() {
        for (let i = 0; i < enemiesArray.length; i++) {
            const item = enemiesArray[i];
            TweenMax.to(item, 0.5, { ay: 0, delay: (enemiesArray.length - i) * 0.02 });
        }
    }

    let bulletInterval = 0;
    function generateBullet() {
        bulletInterval++;


        if (!(bulletInterval % 10) && gameStatus !== GameStatuses.Finished) {

            const newBullet = newSprite("bullet", 0.5);
            bulletsArray.push(newBullet);
            bulletSprite.addChild(newBullet);
            newBullet.x = char.x;
            newBullet.y = char.y;



        }
        for (let i = 0; i < bulletsArray.length; i++) {
            bulletsArray[i].y += -8;
            if (bulletsArray[i].y < 0) {
                bulletSprite.removeChild(bulletsArray[i]);
                bulletsArray.splice(i, 1);
                i--;

            } else {
                for (let j = 0; j < enemiesArray.length; j++) {
                    if (!enemiesArray[j].killed) {

                        if (bulletsArray[i].x > enemiesArray[j].x && bulletsArray[i].x < enemiesArray[j].x + xcolSize) {
                            if (bulletsArray[i].y > enemiesArray[j].y && bulletsArray[i].y < enemiesArray[j].y + yrowSize) {

                                bulletSprite.removeChild(bulletsArray[i]);
                                bulletsArray.splice(i, 1);
                                // i--;
                                enemiesArray[j].killed = true;
                                enemiesArray[j].enemy.visible = false;
                                enemiesArray[j].animation.visible = true;
                                enemiesArray[j].animation.gotoAndPlay(1);


                                killedEnemies++;
                                if (killedEnemies == enemiesArray.length) {
                                    endGame();
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    var bgPosY = 0;

    function onEnterFrame() {
        //updateCameraLayer();

        if (!assetsLoaded) {
            return
        }

        if (gameStatus === GameStatuses.Hided) {
            return;
        }

        var dp = resolution;

        var w = app.renderer.view.width / dp;
        var h = app.renderer.view.height / dp;

        dt = gameDuration;
        if (gameStatus === GameStatuses.InGame) {
            dt = Math.max(0, gameDuration - (performance.now() - startGameTime));
        }

        var secs = Math.floor(dt / 1000);
        timePanel.txt.text = "0:" + (secs < 10 ? "0" + secs : secs);
        scorePanel.txt.text = killedEnemies + "/" + enemiesCount;




        if (!dt) {
            endGame();
        }

        if (gameStatus == GameStatuses.InGame || gameStatus == GameStatuses.Loaded || gameStatus == GameStatuses.Finished) {
            currentScroll += (targetScroll - currentScroll) * 0.1;
            char.x = (currentScroll - 0.5) * w / gameField.scale.x;
        }

        if (gameStatus == GameStatuses.InGame || gameStatus == GameStatuses.Finished) {

            TweenMax.set("#bg", { backgroundPosition: "0px " + (bgPosY += 2) + "px" });
            generateBullet();
        }


        if (gameStatus === GameStatuses.InGame) {



            blockTansition += xMovementSpeed * transitionDirection * xLockSpeed;

            if (blockTansition > 1 || blockTansition < 0) {
                blockTansition = Math.max(Math.min(blockTansition, 1), 0);
                transitionDirection *= -1;
                ypos++;
                for (let i = 0; i < enemiesArray.length; i++) {
                    const item = enemiesArray[i];
                    TweenMax.to(item, 0.3, { ay: ypos, delay: (enemiesArray.length - i) * 0.01 });
                }
                xLockSpeed = 0;
                setTimeout(function () {
                    xLockSpeed = 1
                }, 500)
                //ypos++;
            }
            setEnemiesPostion();


        }//(currentScroll-0.5)*w;
        //pigAdjustFilter.contrast(pigContrast);
        //ontrast*=0.91;


    }

    function setEnemiesPostion() {
        var dp = resolution;

        var w = app.renderer.view.width / dp;
        const blockWidth = enemyCells * xcolSize * xDistScaler;


        for (let i = 0; i < enemiesArray.length; i++) {
            const item = enemiesArray[i];
            if (!item.killed) {
                item.x = (w - blockWidth) * blockTansition + item.sx * xcolSize * xDistScaler - w / 2;
                item.y = (item.ay + item.sy) * yrowSize * yDistScaler + 200;
            }

        }
        // clearBullets();
    }



    function setInitialBalloonPoisition() {
        blockTansition = 0.4;
        transitionDirection = 1;
        startTime = performance.now();
        killedEnemies = 0;
        ypos = 0;
        for (let i = 0; i < enemiesArray.length; i++) {
            enemiesArray[i].killed = false;
            enemiesArray[i].ay = - enemyRaws - 5;

            enemiesArray[i].enemy.visible = true;
            enemiesArray[i].animation.visible = false;

        }

    }


    var bulletSprite;
    function ganerateEnemies() {


        enemiesArray = [];
        const yscal = yrowSize / 129;
        xcolSize = 106 * yscal;



        for (var i = 0; i < enemiesCount; i++) {
            const ypos = Math.floor(i / enemyCells);
            ////newSprite(enemiesVariations[ypos % enemiesVariations.length]);
            var newItem = new PIXI.Container;
            newItem.enemy = newSprite(enemiesVariations[ypos % enemiesVariations.length]);
            newItem.addChild(newItem.enemy);

            newItem.animation = newAnimatedSprite(enemiesAnimations[ypos % enemiesAnimations.length], "expl");

            newItem.animation.loop = false;
            newItem.animation.visible = false;

            newItem.addChild(newItem.animation);

            //newAnimatedSprite(enemiesVariations[ypos % enemiesVariations.length],"expl");

            newItem.scale.set(yscal);
            const xpos = i % enemyCells;

            newItem.sx = xpos;
            newItem.sy = ypos;
            enemiesArray.push(newItem);
            gameContainer.addChild(newItem);
        }
        bulletSprite = new PIXI.Container();
        gameContainer.addChild(bulletSprite);

        setInitialBalloonPoisition();
        setEnemiesPostion()
        //stopCoinTimeout = setTimeout(stopCointsAnimations, 25000);
    }


    function resize() {
        if (app) {
            app.renderer.resize(parentContainer.clientWidth, parentContainer.clientHeight);
        }
        var dp = resolution;

        var w = app.renderer.view.width / dp;
        var h = app.renderer.view.height / dp;

        if (preloader) {
            preloader.x = w / 2;
            preloader.y = h / 2;
        }


        if (!assetsLoaded) {

            return;
        }
        var scal = h / gameFieldHeight;

        gameField.x = (w - gameFieldWidth * scal) / 2;
        var visibleWidth = w / scal;
        gameField.y = 0;

        var dx = Math.max(570 - visibleWidth, 0);


        infoPanel.x = gameFieldWidth / 2;

        scorePanel.x = -visibleWidth / 2;
        timePanel.x = visibleWidth / 2;


        gameField.scale.set(scal);

    }

    var loader;

    function loadAssets(arr) {
        loader = new PIXI.Loader();
        loader
            .add(arr)
            .on("progress", loadProgressHandler)
            .load(onAssetsLoaded);

    }

    var sprite;

    var gameContainer;
    var boomContainer;
    var hint;
    function setUpScene() {
        assetsLoaded = true;

        gameField = new PIXI.Container();
        var bg = newSprite("trasp-bg");
        bg.scale.x = gameFieldWidth / bg.texture.width;
        bg.scale.y = gameFieldHeight / bg.texture.height;
        gameField.addChild(bg);

        //trasp-bg

        gameField.sortableChildren = true;
        app.stage.addChild(gameField);

        gameContainer = new PIXI.Container();
        gameField.addChild(gameContainer);
        gameContainer.x = gameFieldWidth / 2;

        char = newSprite("char", 0.5);
        char.anchor.y = 0.0;

        char.y = gameFieldHeight * 1.2;
        char.x = gameFieldWidth * 0.5;

        ganerateEnemies();
        gameContainer.addChild(char);


        boomContainer = new PIXI.Container();
        boomContainer.x = gameFieldWidth / 2;

        gameField.addChild(boomContainer);

        hint = newSprite("icon-hand", 0.5);
        hint.x = gameFieldWidth / 2;

        gameField.addChild(hint);

        hint.y = gameFieldHeight * 0.6;

        hint.alpha = 0;



        initInterface();
        prepareInfoPanel();
        infoPanel.y = -130;
        resize();


    }

    var infoPanel, scorePanel, timePanel;
    function prepareInfoPanel() {
        infoPanel = new PIXI.Container();
        scorePanel = newSprite("score-txt");

        scorePanel.anchor.x = 0;
        scorePanel.anchor.y = -1;

        timePanel = newSprite("time-txt");

        timePanel.anchor.x = 1;
        timePanel.anchor.y = -1;

        infoPanel.addChild(timePanel);
        infoPanel.addChild(scorePanel);

        gameField.addChild(infoPanel);


        const style = new PIXI.TextStyle({
            fontFamily: "GameFont",
            fill: "#FFFFFF",
            fontSize: 45,
            leading: 20,
            lineHeight: 20,
        });

        const textScore = new PIXI.Text('0/2000', style);
        scorePanel.addChild(textScore);
        textScore.anchor.y = 0;
        textScore.x = 0;
        textScore.y = 42;
        scorePanel.txt = textScore;
        textScore.anchor.x = 0;

        const textTime = new PIXI.Text('0:' + Math.floor(gameDuration / 1000), style);
        timePanel.addChild(textTime);
        textTime.x = 0;
        textTime.y = 42;
        textTime.anchor.x = 1;
        timePanel.txt = textTime;



    }

    function onAssetsLoaded() {
        preloader.visible = false;
        setUpScene();
        gameLoaded();
        gameStatus = GameStatuses.Loaded;
    }

    function newSprite(str, anchor) {
        anchor = anchor || 0;
        const sp = new PIXI.Sprite(loader.resources[assetsHash[str]].texture);
        sp.anchor.set(anchor);
        return sp;

    }

    function texture(str) {
        return loader.resources[assetsHash[str]].texture
    }

    function loadProgressHandler(l, resource) {
        updatePrc(l.progress / 100);
    }

    var resolution;
    var preloader, preloaderElement;
    function updatePrc(val) {
        if (!preloaderElement) {
            return;
        }

        preloaderElement.clear();
        preloaderElement.lineStyle(5, 0xFFFFFF, 1);
        preloaderElement.drawCircle(0, 0, preloaderRadius);
        preloaderElement.lineStyle(3, 0xFF0000, 1);
        preloaderElement.arc(0, 0, preloaderRadius, 0, Math.PI * 2 * val);

    }

    var preloaderRadius = 25;





    function showPreloader() {

        preloader = new PIXI.Container();
        preloaderElement = new PIXI.Graphics();
        preloader.addChild(preloaderElement);


        preloaderElement.lineStyle(5, 0xFFFFFF, 1);
        preloaderElement.drawCircle(0, 0, preloaderRadius);
        app.stage.addChild(preloader);
        preloader.x = app.view.width / 2;
        preloader.y = app.view.height / 2;


    }


    function clampScroll(val) {
        return Math.min(Math.max(0, val), 1);

    }

    var valueStarted, touching, x0, y0;
    var targetScroll = currentScroll = 0.5;
    var THE_SMALLEST_STEP = 10;
    let totalBalls = 0;



    function clearBullets() {
        bulletSprite.removeChildren(0, bulletsArray.length);
        bulletsArray = [];
    }

    this.initGame = function initGame() {
        setInitialBalloonPoisition();

        initAnimation = true;
        hintShowed = false;
        startGameTime = -1;
        char.x = 0;
        char.y = gameFieldHeight * 1.3;
        currentSpeed = 10;

        char.x = gameFieldWidth / 2;

        totalBalls = 0;
        killedEnemies = 0;

        TweenMax.to(char, 1.0, { y: gameFieldHeight * 0.8 });
        TweenMax.to(infoPanel, 1.0, { y: 10 });
        currentScroll = 0.5;
        targetScroll = 0.5;


        TweenMax.fromTo(hint, 0.5, {
            alpha: 0,
            x: gameFieldWidth * 0.3,
            delay: 0.5,
        },
            {
                alpha: 1,
                x: gameFieldWidth * 0.5,
            }
        );

        gameStatus = GameStatuses.Loaded;

        hintShowed = true;
        setEnemiesPostion();

        setTimeout(self.startGame, 5000);


    }

    this.getTotalBalls = function () {
        return enemiesArray.length;
    }

    this.getPiercedBalls = function () {
        return killedEnemies;
    }




    function onMouseUp(mouseData) {
        /*if(mouseData.data.global.y > buttonLine ){
         //   window.open(params.targetURL);
        }*/

        touching = false;

        var x = mouseData.data.global.x;
        var y = mouseData.data.global.y;
        var distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2));
        if (distance < THE_SMALLEST_STEP) {

            //backgrondClick();
            //CLICKED

        }

    }


    var oldPosition = 0;
    function moveChar(position) {
        //     console.log("move",position);
        targetScroll = clampScroll(position);

        if (hintShowed && gameStatus === GameStatuses.Loaded) {
            if (Math.abs(targetScroll - 0.5) > 0.1) {
                hideHint();
                self.startGame();
            }
        }

        if (oldPosition) {
            var distance = targetScroll - oldPosition;
            if (Math.abs(distance) > THE_SMALLEST_STEP) {
                var leftward = (distance > 0);
                if (leftward != oldDirection) {
                    initObj.track(leftward);
                }
                oldDirection = leftward;
            }
        }
        oldPosition = targetScroll;
        if (initObj.onScroll) {
            initObj.onScroll(targetScroll / radius, app.renderer.view.width / 2 / radius);
        }
    }

    function onMouseDown(mouseData) {
        x0 = mouseData.data.global.x;
        y0 = mouseData.data.global.y;
        valueStarted = targetScroll;
        touching = true;

    }




    function onMouseMove(mouseData) {

        if (touching) {
            //startTime = performance.now();
            var dx = (x0 - mouseData.data.global.x) / 120;
            moveChar(valueStarted - dx);
        }
    }


    function gyroEvent(e) {


        //  targetScroll = targetScroll + 5;//clampScroll(targetScroll + 5);
        var isIOS = false;
        var speed = 8;
        var multiplier = isIOS ? speed * (Math.PI / 180) : speed;
        var nt = performance.now();
        var dt = nt - oldtime;
        oldtime = nt;
        var naccX = e.rotationRate.beta;
        var daccX = naccX / dt / 600;//(naccX-accX);///dt;///dt*100;
        if (daccX) {
            moveChar(targetScroll + daccX * multiplier);
        }
        //  movePanorama(targetScroll - daccX * multiplier);

    }


    function initInterface() {

        var stage = app.stage;
        stage.interactive = true;

        //    console.log(stage,onMouseDown,onMouseMove);
        stage.on("pointerdown", onMouseDown);
        stage.on("pointermove", onMouseMove);
        stage.on("pointerup", onMouseUp);
        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", gyroEvent);
        }
    }

    var resolution;
    this.init = function () {


        resolution = window.devicePixelRatio || 1;
        app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: true, // default: false
            resolution: resolution       // default: 1
        });
        app.renderer.backgroundColor = 0x000000;
        app.ticker.add(onEnterFrame);
        parentContainer.appendChild(app.view);
        app.renderer.view.style.display = "block";
        app.renderer.view.style.width = "100%";

        app.renderer.view.style.display = "block";
        window.addEventListener("resize", resize);

        if (!initObj.assets) {
            //ball
            let assets = [];
            for (let i in assetsHash) {
                assets.push(assetsHash[i]);
            }
            initObj.assets = assets;
        }


        loadAssets(initObj.assets);
        showPreloader();
        resize();
        gameStatus = GameStatuses.Loading;

    }

    this.hideChar = function hideChsr() {
        TweenMax.to(char, 1.0, { y: gameFieldHeight * 1.2 });
        gameStatus = GameStatuses.Hided;
    }
    function endGame() {
        gameStatus = GameStatuses.Finished;

        TweenMax.to(infoPanel, 1.0, { y: -130 });

        for (let i = 0; i < enemiesArray.length; i++) {
            if (enemiesArray[i].y > gameFieldHeight / 2) {
                TweenMax.to(enemiesArray[i], Math.random() * 2, { y: gameFieldHeight * 1.4 })
            } else {
                TweenMax.to(enemiesArray[i], Math.random() * 2, { y: -200 })
            }
        }
        showResultScreen();

    }

    this.startGame = function () {
        if (gameStatus === GameStatuses.InGame) {
            return;
        }
        startGameTime = performance.now();

        console.log("START GAME")
        gameStatus = GameStatuses.InGame;
        initAnimation = false;
        speed = 5;

        TweenMax.to(hint, 0.5, {
            alpha: 0,
            x: gameFieldWidth * 0.7,

        }
        );


        showEnemies()

    }

}