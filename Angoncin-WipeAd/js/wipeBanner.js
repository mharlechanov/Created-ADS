var delayBeforeShow  = 5000;
function wipeBanner(containerId) {

    var assetsLoaded = false;
    var parentContainer = document.getElementById(containerId);
    var app;
    var params;
    var layers;
    this.currentScroll = 0;
    var targetScroll = 0;
    var buttonLine = 1000000;
    var appearanceCompleted = false;

    var self = this;
    var openAnimationCompleted = false;
    var loader;
    var assetsHash = {
        //general assets
        "brush": globalURLPath + "images/brush01.png",
        "brush-solid": globalURLPath + "images/brush.png",
        "brush2": globalURLPath + "images/brush02.png",
        //cover assets
        "c-bg":globalURLPath + "images/cover-bg.jpg",
        "c-txt":globalURLPath + "images/t1.png",
        
        "hand-icon":globalURLPath + "images/hand-icon.png",
        //page assets
        "p-bg":globalURLPath + "images/pack.png",
        "p-txt":globalURLPath + "images/t2.png",
        "p-txt2":globalURLPath + "images/t3.png",
        "p-txt-bottom":globalURLPath + "images/cta.png",
		"p-logo":globalURLPath + "images/logo.png",
		


    };


    var brushPoints = [[4.5,4.35],[4.6,4.6],[5.2,5.05],[5.95,5.1],[6.05,4.75],[6.05,3.85],[5.75,3.3],[4.95,3.15],[3.85,3.5],[3.35,4.4],[3.4,5.15],[4.05,5.8],[5,5.75],[5.75,5.4],[6.25,4.65],[6.2,3.75],[5.6,3.15],[4.95,3.05],[4.25,3.45],[3.65,4.65],[3.6,6.3],[4.1,7.35],[6,7.85],[8.05,6.6],[8.35,5.1],[7.65,3],[6,2.3],[4.45,2.35],[3.65,3.1],[2.85,5.65],[3.15,7.5],[4.45,7.65],[7.35,6.85],[7.95,5.7],[7.45,4.3],[6.5,4.35],[5.15,6.35],[5.3,6.8],[7.1,5.7],[7.55,5],[5.85,6.9],[6.1,6.55],[6.95,5.55],[6.8,6.3],[6.45,3.8],[5.45,1.9],[4.5,1.4],[3.5,1.05],[2.5,2.15],[1.65,4.7],[1.4,6.9],[1.8,8.4],[3.15,9.65],[5.6,9.9],[8.95,8.35],[10.05,6.2],[9.75,3.3],[8.6,1.8],[6.95,1.35],[4.8,2.1],[3,5.1],[2.7,8],[3.9,9.9],[7.65,8.3],[9.45,6.25],[9.4,6.2],[7.85,7.4],[7.25,8.05],[9.75,5.9],[9.85,4],[9.3,1.75],[7.55,0.1],[5.35,-0.15],[3.05,0.05],[2.05,0.6],[1.1,1.95],[0.45,4.15],[0.4,6.1],[1.2,8.2],[1.95,9.1],[3.4,9.85],[7.25,9.9],[10.6,9.1],[11.4,6.95],[11.3,4.45],[10.35,2.5],[7.9,0.95],[4.75,0.3],[3.35,0.75],[1.3,3.25],[0.25,6.4],[0.55,7.8],[3.65,7],[9,5.4],[10.55,4.55],[10.4,4.6],[7.95,6.8],[6.35,8.3],[6.3,8.7],[7.4,8.95],[9.75,6.85],[10.05,4.75],[9.05,3.5],[8.2,3.35],[6.7,3.55],[5.8,4.95],[5.85,7.3],[7.3,8.3],[9.3,6.95],[10.6,4.35],[10.05,1.7],[8.85,1.45],[6.75,2.35],[4.9,4.3],[4.1,6.75],[4.5,8.8],[7.35,10.15],[9.9,8.7],[10.15,5.75],[9.55,3.65],[8.5,2.8],[6.6,2.35],[5.75,2.45],[4.75,2.65],[3.8,3.45],[2.7,5.5],[2.4,7.6],[2.95,9.05],[5,7.95],[7.5,4.3],[7.35,1.45],[5.7,0.8],[3.65,1.3],[2,3.5],[1.8,6.1],[2.05,6.75],[2.65,7.6],[3,7.15],[4.25,4],[4,1.2],[3.7,0.65],[2.15,2.85],[1.2,4.95],[1.2,5.15],[1.55,1.95],[1.35,0.7],[1.35,0.75],[0,3.65],[0,6.55],[0,8.7],[0,9.6],[0.05,10.2],[0.25,10.8],[0.4,10.6],[1.55,8.05],[1.85,7.1],[1.75,8.35],[0.7,10.15],[0.55,10.35],[0.55,10.2],[1.5,8.25],[1.75,4.15],[0.5,0.85],[0.35,0.3],[0.3,0.35],[0.25,2.6],[0.25,2.6],[1,0.2],[1.1,-0.35],[2.95,-0.3],[5.95,-0.45],[8.25,-0.3],[8.7,-0.1],[8.6,0.4],[9.3,0.15],[9.3,0.25],[9.45,0.45],[9.55,0.95],[10.05,1.65],[10.15,1.95],[10.2,2.45],[9.8,4.45],[9.55,5.4],[9.45,5.65],[9.45,5.55],[9.45,3.5],[9.25,2.4],[8,5.25],[7.45,5.75],[6.15,3.95],[5.6,2.65],[5.5,2.85],[3.3,6.5],[3.1,6.95],[3.5,3.7],[3.8,2.4],[3.25,3.9],[3,4.15],[3.75,1.35],[4,1],[3.05,2.9],[1.3,6.25],[0.8,7.85],[0.55,8.45],[0.45,8.6],[1.75,7.6],[5.1,7.5],[5.9,7.85],[6.45,8.1],[5.45,8.55],[2.35,9.75],[1.6,10],[1.6,10.05],[6.2,9.25],[8.2,9.05],[5.4,9.05],[1.45,9.75],[0,9.85],[0.95,9.2],[3.5,7.85],[4.05,7.6],[4.8,8.05],[4.8,8.2],[4.85,8.45],[3.9,9.05],[3.65,9.2],[2.35,9.05]]
    var brushPoints2 = [
        [0,0],
        [10,0],
        [0,10],
        [10,10],
        [10,1],
        [1,1],
        [9,1],
        [9,9],
        [2,9],
        [0,0],
        [0,10]

    ];
    var bruhSteps = brushPoints.length;
    var brushStep = 0;
    function onEnterFrame() {
        if(appearanceCompleted){
            self.currentScroll += (targetScroll - self.currentScroll)*0.1;
        }


        if(!assetsLoaded){
            preloader.x = app.renderer.view.width/2/resolution;
            preloader.y = app.renderer.view.height/2/resolution;
            preloader.rotation += 0.01;
        }
        if(performance.now() - initBannerTime<24000){
            //layers[0].sp.tilePosition.x-=2;

           // calcBgAnimationFrame();
           // calcWallAnimation()
        }
        var newX,newY;

        if(!distanceReached ){
            ctime = performance.now() - startTime;

            if(ctime>delayBeforeShow){
                distanceReached = true;
                brush.texture = texture("brush2")
                app.stage.on("pointerup" , function(){
                    //console.log("click")
                    clickOut();
                });
            }
        }
        var dp = resolution;
        if(distanceReached && !openAnimationCompleted){
            if(brushStep<brushPoints.length-1){
                newX = brushPoints[brushStep][0]*app.renderer.view.width/10/dp;
                newY = brushPoints[brushStep][1]*app.renderer.view.height/10/dp;

            }else{
                newX = Math.random()*app.renderer.view.width/dp;
                newY = Math.random()*app.renderer.view.height/dp;
            }

            drawLine( oldX, oldY, newX, newY);
            oldX = newX;
            oldY = newY;
            brushStep+=3;
            if( brushStep >= bruhSteps){
				//TweenMax.to(newicon, 1, {alpha:0, repeat:7, yoyo:true, ease:Sine.easeInOut});
				TweenMax.to(txtBottom, 1, {alpha:0, repeat:7, yoyo:true, ease:Sine.easeInOut});
                fillAll();
                openAnimationCompleted = true;

                showElements();

            //    document.querySelector("body").onclick = clickOut;
             //   document.querySelector("body").style.cursor = "pointer";
                coverSprite.visible = false;
                maskTextureSprite2.visible  = false;
            }


            //oldX
        }
    }
    function resize(){
        if(app) {
         //   app.renderer.resize(parentContainer.clientWidth, parentContainer.clientHeight);
            app.renderer.resize(window.innerWidth, window.innerHeight);
            updateLayerSizes()
        }
        if(!assetsLoaded){
            preloader.x = app.renderer.view.width/2;
            preloader.y = app.renderer.view.height/2;
            preloader.rotation += 0.01;
        }

        return;

        var vk =  app.view.height / app.view.width;
        if(vk>1){
            showPortraitInfo(false);
        }else{
            showPortraitInfo(true);

        }
        self.currentScroll = targetScroll = clampScroll(targetScroll);
        updateScrollPosition();
    }


    function loadProgressHandler(l, resource) {
        //updatePrc (val)

        updatePrc (l.progress/100)
        //console.log(l, resource);
      //  console.log(l);
    }

    var isLansdcapeOrientation = false;
    function showPortraitInfo(val){
        if(!layers){
            return;
        }
        isLansdcapeOrientation = val;
        if(!isLansdcapeOrientation){
            app.renderer.backgroundColor = 0xFFFFFF;
        }else{
            app.renderer.backgroundColor = 0x00;
        }

        for(var i = 0; i<layers.length; i++) {
            if(i == layers.length){
                layers[i].visible = isLansdcapeOrientation;
            }else{
                layers[i].visible = !isLansdcapeOrientation;
            }
        }

    }



    var  oldtime = performance.now();

    function gyroEvent(e) {


          //  targetScroll = targetScroll + 5;//clampScroll(targetScroll + 5);
            var isIOS = false;
            var speed = 8;
            var multiplier = isIOS ? speed * (Math.PI / 180) : speed;
            var nt = performance.now();
            var dt = nt - oldtime;
            oldtime = nt;
            var naccX = e.rotationRate.beta;
            var daccX  = naccX/dt;//(naccX-accX);///dt;///dt*100;


            targetScroll = clampScroll(targetScroll - daccX*multiplier);


    }
    function updateLayerSizes(){


        var dr = resolution ;

        if(!brush){
            return;
        }


        var scalebg = app.renderer.view.height/params.baseHeight/dr;
        backgroundLayer.scale  = new PIXI.Point( scalebg, scalebg );
        backgroundLayer.x = app.view.width/2/dr ;//- params.baseWidth/2*scalebg;
        backgroundLayer.y = app.view.height/2/dr ;//- params.baseHeight/2*scalebg;
        //console.log(backgroundLayer.x,backgroundLayer.y);

        var scalemask = app.renderer.view.height/maskTextureSprite.texture.height/dr;
        maskTextureSprite2.scale = maskTextureSprite.scale = new PIXI.Point( scalemask, scalemask );
        maskTextureSprite2.x = maskTextureSprite.x = app.view.width/2/dr - maskTextureSprite.texture.width*scalemask/2;
        maskTextureSprite2.y = maskTextureSprite.y = app.view.height/2/dr - maskTextureSprite.texture.height*scalemask/2;

        var scalecover =  app.renderer.view.height/coverH/dr;
        coverSprite.scale = new PIXI.Point( scalecover, scalecover );
        coverSprite.x =  app.view.width/2/dr - coverW*scalemask/2;
        coverSprite.y = app.view.height/2/dr - coverH*scalemask/2;

        //layers responsive
        var scalebgW = app.renderer.view.width/layers["p-bg"].texture.width/dr;
        var k = Math.max(1, scalebgW/scalebg);
        layers["p-bg"].scale.set(k*0.75);


        //scalebgW = app.renderer.view.width/layers["p-txt"].texture.width/scalebg/dr*0.8;
       // layers["p-txt"].scale.set(scalebgW/1.2);
		
       layers["c-bg"].x = -100;
       //layers["c-bg"].y = params.baseHeight/4*app.renderer.view.height/params.baseHeight;	
        //layers["p-txt-bottom"].x = params.baseWidth/4*app.renderer.view.width/params.baseWidth;
		//layers["c-txt-bottom"].x = params.baseWidth/4*app.renderer.view.width/params.baseWidth;
        layers["p-logo"].x = params.baseWidth/4*app.renderer.view.width/app.renderer.view.height*1.2;	
        layers["p-logo"].scale.set(k*0.4);
        console.log(params.baseWidth/4*app.renderer.view.width/app.renderer.view.height*1);
        //console.log(app.renderer.view.width);
		//layers["p-new"].x = 0.5;
		
		//layers["p-txt"].y=params.baseHeight/10*app.renderer.view.height/params.baseHeight;
		//console.log(layers["c-txt-bottom"].x );

		//layers["c-txt"].x = params.baseWidth/4*app.renderer.view.width/params.baseWidth;	
		//layers["c-txt"].y = params.baseHeight/4*app.renderer.view.height/params.baseHeight;	





    }

    var touchStarted = 0;
    var valueStarted = 0;
    var touching = false;
    function onMouseDown(mouseData){
        touchStarted = mouseData.data.global.x;
        valueStarted = targetScroll;
        touching = true;
        mayBeClick = true;

    }

    function onMouseUp(mouseData){
        if(mayBeClick ){
            onMouseClick();

        }
        touching = false;
    }
    function clampScroll(val){
        var scale = app.renderer.view.height/params.baseHeight;
        return Math.min(Math.max(0,val), params.maxScroll * scale - app.view.width);
    }

    function centerScroll(){
        var scale = app.renderer.view.height/params.baseHeight;
        return (params.maxScroll * scale - app.view.width)/2;
    }
    function  onMouseClick(){
        if(params.clickCallBack){
            params.clickCallBack();
        }

    }
    var mayBeClick = false;


    var backgroundLayer;

    var startTime,initBannerTime;
    var snowLayer


    function prepareContentLayer(){


        var bg = newSprite("p-bg",0.5);
		bg.scale.set(1);
        backgroundLayer.addChild(bg);
		bg.y=params.baseHeight/11;
		//bg.x=params.baseWidth/50;
        layers["p-bg"] = bg;

       
        var txtTop = newSprite("p-txt",0.5);
        txtTop.anchor.set(0.48,1.8);
        txtTop.scale.set(1.5);
		//txtTop.y=100;
		//console.log(txtTop.y, "sdg");
		//console.log(txtTop.x, "sdg");
		//coverTextBottom1.scale.set(0.17);
        backgroundLayer.addChild(txtTop);
        layers["p-txt"] = txtTop;
        
        var txtTop2 = newSprite("p-txt2",0.5);
        txtTop2.anchor.set(0.5);
        txtTop2.scale.set(1.1);
	    txtTop2.y=params.baseHeight/3.1;
		//console.log(txtTop.y, "sdg");
		//console.log(txtTop.x, "sdg");
		//coverTextBottom1.scale.set(0.17);
        backgroundLayer.addChild(txtTop2);
        layers["p-txt2"] = txtTop2;
        
		

        txtBottom = newSprite("p-txt-bottom",0.5);
        txtBottom.anchor.set(0.5);
		//txtBottom.scale.set(0.8);
        layers["p-txt-bottom"] = txtBottom;
        txtBottom.y =  params.baseHeight/2.4;
        //txtBottom.x =  params.baseWidth/5;
        backgroundLayer.addChild(txtBottom);
        txtBottom.scale.set(1.5);
		

		var coverTextBottom1 = newSprite("p-logo");
        layers["p-logo"] = coverTextBottom1;
        //coverTextBottom1.anchor.set(0,1);       
        coverTextBottom1.y =  -1*params.baseHeight/2;
        coverTextBottom1.x = params.baseWidth/6;
        console.log(coverTextBottom1.y,coverTextBottom1.x);
		coverTextBottom1.scale.set(1.2);
        backgroundLayer.addChild(coverTextBottom1);
		
		
    }


    function setUpScene() {
        console.log("ready");
        layers = {};
        killBodyClick();
        var i;


        //baseTexture.mipmap = true;

        initBannerTime = startTime = performance.now();
        TweenMax.to(preloader.scale,1,{x:2,y:2});
        TweenMax.to(preloader,1,{alpha:0});
        
        assetsLoaded = true;
        layers = new Array();
        backgroundLayer = new PIXI.Container();

        prepareWipeLayer();

        app.stage.addChild(backgroundLayer);


        /*var blackObject = new PIXI.Graphics();
        blackObject.beginFill(0xFFFFFF);
        blackObject.drawRect(0,0,params.baseHeight,params.baseHeight);
        blackObject.x = -(params.baseHeight - params.baseWidth)/2
        backgroundLayer.addChild(blackObject);*/


        prepareContentLayer()

        snowLayer = new PIXI.Container();
        backgroundLayer.addChild(snowLayer);
       // makeAwesomeBackgroundAnimation()
        //updateLayerSizes();



        resize();
        if(window.DeviceMotionEvent){
            window.addEventListener("devicemotion",gyroEvent);
        }
        setElements();

    }

    function appearanceComplete(){
        self.currentScroll = targetScroll = centerScroll();
        
        //targetScroll = centerScroll();
        appearanceCompleted = true;
        if (params.animationFinishedCallback){
            params.animationFinishedCallback();
        }
        
    }

    function setElements(){
        for(i=0; i< layers.length; i++){

            var layer = layers[i];
            if(i>=2){

                TweenMax.set(layer.scalecont.scale,{x:0,y:0});
                //TweenMax.to(layer.scalecont.scale,0.5, {x:1, y:1, delay:i*delay , ease: Back.easeOut});
            }
        }
    }

    function showElements(){
        //appearanceComplete()
        //return;
        var delay =0.1;
        var anDur = 0.5;
        for(i=0; i< layers.length; i++){

            var layer = layers[i];
            if(i>=2){

              //  TweenMax.set(layer.scalecont.scale,{x:0,y:0});
                TweenMax.to(layer.scalecont.scale,0.5, {x:1, y:1, delay:i*delay , ease: Back.easeOut});
            }
        }
        appearanceComplete()


    }

    function loadAssets(arr){
        //console.log(arr,PIXI.Loader);
        loader = new PIXI.Loader();
        loader
            .add(arr)
            .on("progress", loadProgressHandler)
            .load(setUpScene);
            
    }

    function newSprite(str,anchor){
        anchor = anchor || 0;
        var txt = loader.resources[assetsHash[str]].texture;

        //  const glTex = txt.baseTexture;//._glTextures[app.renderer.CONTEXT_UID];

        // glTex._glTextures[0].mipmap = 1;
        //glTex.enableLinearScaling();

        const sp = new PIXI.Sprite(  txt);
        sp.anchor.set(anchor);
        return sp;

    }

    function texture(str){
        return loader.resources[assetsHash[str]].texture;
    }


   /* function loadAssets(imagesArray){
        PIXI.loader
            .add(imagesArray)
            .on("progress", loadProgressHandler)
            .load(setUpScene);

    }*/

    var brush;
    var maskTextureSprite;
    var maskTextureSprite2;
    var coverSprite;
    var coverW,coverH;
    var handSprite;
	var coverText;
	var txtBottom;

    function prepareWipeLayer(){


        brush = newSprite("brush");

        var size= Math.max(params.baseHeight,params.baseWidth);
        var maskTexture = PIXI.RenderTexture.create(size, size);
        maskTextureSprite = new PIXI.Sprite(maskTexture);
        app.stage.addChild(maskTextureSprite);



       // var coverTexture = newSprite("c-bg");
        coverSprite = new PIXI.Container;


        app.stage.addChild(coverSprite);
        var covert = newSprite("c-bg");
        layers["c-bg"] = covert;
        //TweenMax.from(covert,1.5,{y:20, alpha:0, delay:2});
		
		covert.y = -126;
       // covert.blendMode = PIXI.BLEND_MODES.ADD;
	   //console.log(covert);
        coverSprite.addChild(covert);
        coverW = covert.texture.width;
        coverH = covert.texture.height;

     //   makeWallAnimation();



        coverText = newSprite("c-txt");
        layers["c-txt"] = coverText;
		coverText.x =  185;
		coverText.scale.set(1.2);
        coverText.y =  200;
		//console.log(coverText.x);
        //TweenMax.from(coverText,1.5,{y:20, alpha:0});
		//
        coverSprite.addChild(coverText);



        

        handSprite = newSprite("hand-icon");
        coverSprite.addChild(handSprite);

        handSprite.x = (coverW )/2.5;
        handSprite.scale.set(0.7);

        handSprite.anchor.set( 0.5 )
        handSprite.y = 800 ;
        TweenMax.from(handSprite,0.5,{delay:0.5,alpha:0,rotation:-1, delay:1.0});


        //TweenMax.from(handSprite,0.5,{delay:0.5,alpha:0,rotation:-1});


        var maskTexture2 = PIXI.RenderTexture.create(size, size);
        maskTextureSprite2 = new PIXI.Sprite(maskTexture2);

        app.stage.addChild( maskTextureSprite2 );
        backgroundLayer.mask = maskTextureSprite;



    }

    var dragging;
    var oldX,oldY;
    var track=false;
    function onBrushDown(e){
		
        if(!distanceReached){
            dragging = true;
            oldX =e.data.global.x;
            oldY =e.data.global.y;

            onBrushMove(e);
            
            addTrackingScript();
            
          
        } 
        
    }

    function fillAll(){
        var dp =  resolution;
        brushscale = 10 ;
        brush.tint = 0xFFFFFF;
        brush.scale.x = brushscale;
        brush.scale.y = brushscale;
        brush.x = (-maskTextureSprite.x + app.renderer.view.width/2/dp )/maskTextureSprite.scale.x; //- brush.texture.width/2 * brush.scale.x ;
        brush.y = (-maskTextureSprite.y + app.renderer.view.height/2/dp)/maskTextureSprite.scale.y; //- brush.texture.width/2 * brush.scale.y ;
        //    brush.position.copyFrom(e.data.global);

        brush.texture = texture("brush-solid");
        app.renderer.render(brush, maskTextureSprite.texture, false, null, false);

    }
    function drawBrush(x,y){
        var dp =  resolution*resolution;

        brushscale = app.renderer.view.height*brushSize/brush.texture.height/maskTextureSprite.scale.y/dp ;
        brush.tint = 0xFFFFFF;
        brush.scale.x = brushscale;
        brush.scale.y = brushscale;

        brush.anchor.set(0.5);
        brush.rotation = Math.random()*90;

        brush.x = (-maskTextureSprite.x + x )/maskTextureSprite.scale.x;//- brush.texture.width/2 * brush.scale.x ;
        brush.y = (-maskTextureSprite.y + y)/maskTextureSprite.scale.y;//- brush.texture.width/2 * brush.scale.y ;
        //    brush.position.copyFrom(e.data.global);
        app.renderer.render(brush, maskTextureSprite.texture, false, null, false);

        brush.scale.x*=1.1;
        brush.scale.y*=1.1;
        brush.x-=20;
        brush.y-=20;

       //var bigBubblesColors= [0xed3ee3,0x0874ce, 0x47e2ff];

        brush.tint = 0x4e77b7;
        app.renderer.render(brush, maskTextureSprite2.texture, false, null, false);

        brush.x+=10;
        brush.y+=10;
        brush.tint =  0x4e77b7;;
        app.renderer.render(brush, maskTextureSprite2.texture, false, null, false);
		//console.log(handSprite.visible);
		coverText.visible = true;
        handSprite.visible = false;
    }

    function drawLine( x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var steps = dist/(app.renderer.view.height*brushSize/resolution/resolution)*3+2;
        for(i=0;i<steps;i++){
            var k = i/(steps-1);
            var x = x1 + (x2-x1)*k;
            var y = y1 + (y2-y1)*k;
            drawBrush(x,y);
        }

    }

    var brushSize = 0.15;
    var distance = 0;
    var maxDistance = 1000;
    var distanceReached = false;


    function onBrushMove(e){
        if (dragging) {
            startTime = performance.now();
            var dx = e.data.global.x - oldX;
            var dy = e.data.global.y - oldY;
            distance += Math.sqrt(dx*dx + dy*dy);
         //   console.log( distance);
            drawLine( oldX, oldY, e.data.global.x, e.data.global.y);
            oldX = e.data.global.x;
            oldY = e.data.global.y;
            //drawBrush(e.data.global.x,e.data.global.y);
        }
    }


    function onBrushUp(e){
        dragging = false;
        if(distance > maxDistance){
            if(!distanceReached){
                brush.texture = texture("brush2")
                distanceReached = true;
                app.stage.on("pointerup" , function(){
                    //console.log("click")
                    clickOut();
                });
            }
        }
    }

    var preloader,preloaderElement;
    function updatePrc (val){
        if(! preloaderElement){
            return;
        }

        preloaderElement.clear();
        preloaderElement.lineStyle(5, 0xFFFFFF, 1);
        preloaderElement.drawCircle(0,0,preloaderRadius);
        preloaderElement.lineStyle(5, 0x444444, 1);
        preloaderElement.arc(0,0,preloaderRadius,0,Math.PI*2*val);
        

    }

    var preloaderRadius = 25;
    
    function showPreloader(){

        preloader = new PIXI.Container();
        preloaderElement =  new PIXI.Graphics();
        preloader.addChild(preloaderElement);

        preloaderElement.lineStyle(5, 0x444444,1);
        preloaderElement.drawCircle(0,0,preloaderRadius);
        app.stage.addChild(preloader)
    }

    var resolution;
    this.init = function (initObj){
        resolution = Math.min(1.5 , window.devicePixelRatio || 1);
        app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: resolution//window.devicePixelRatio || 1     // default: 1
        });
        app.renderer.backgroundColor = 0x4e77b7;
        app.ticker.add(onEnterFrame);
        parentContainer.appendChild(app.view);

        app.renderer.view.style.display = "block";
        app.renderer.view.style.width = "100%";
        app.renderer.view.style.height = "100%";
        window.addEventListener("resize", resize);
        params = initObj;


        //initObj.imagesURL.push(IMG_ROTATE_DEVICE);




        if(!initObj.assets){
            //ball
            var assets = [];
            for( i in assetsHash){
                assets.push(assetsHash[i]);
            }
            initObj.assets = assets ;
        }
        ///


        showPreloader();


        loadAssets(initObj.assets);



        var stage = app.stage;

        self.currentScroll = targetScroll = centerScroll();
        stage.interactive = true;
        stage.mousedown = stage.touchstart = onMouseDown;


         stage.on( "pointerdown", onBrushDown);
         stage.on( "pointermove", onBrushMove);
         stage.on( "pointerup", onBrushUp);
        


        resize();
    }
}