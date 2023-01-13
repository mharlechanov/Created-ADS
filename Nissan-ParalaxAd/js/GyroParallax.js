var helperShowed = false;

function GyroParallax(containerId) {

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

    this.isAppearanceCompleted = function () {
        return appearanceCompleted;
    }

    function onEnterFrame() {
        if (appearanceCompleted) {
            var dm = targetScroll - self.currentScroll;
            if (!helperShowed && Math.abs(dm) < 1) {
                if (params.showHelper) {
                    params.showHelper();
                }
                helperShowed = true;
            }
            self.currentScroll += dm * 0.1;
        }
        updateScrollPosition();
    }

    function resize() {

        if (app ) {
            app.renderer.resize(parentContainer.clientWidth, parentContainer.clientHeight);
            scale = app.renderer.view.height / params.baseHeight;
            maxscroll = params.baseWidth * scale - app.view.width;
            if(panoramaContainer){
                panoramaContainer.scale.set(scale);
                //panoramaContainer.y = app.renderer.view.height/2;
            }


        }

        var vk = app.view.height / app.view.width;

        if (vk > 1) {
            showPortraitInfo(false);
        } else {
            showPortraitInfo(true);

        }
        self.currentScroll = targetScroll = clampScroll(targetScroll);
        updateScrollPosition();
    }

    function loadProgressHandler(l, resource) {
        //  console.log(l);
    }

    var isLansdcapeOrientation = false;

    function showPortraitInfo(val) {
        if (!layers) {
            return;
        }
        isLansdcapeOrientation = val;
        if (!isLansdcapeOrientation) {
            app.renderer.backgroundColor = 0xFFFFFF;
        } else {
            app.renderer.backgroundColor = 0x00;
        }

        for (var i = 0; i < layers.length; i++) {
            if (i == layers.length) {
                layers[i].visible = isLansdcapeOrientation;
            } else {
                layers[i].visible = !isLansdcapeOrientation;
            }
        }
    }

    function updateScrollPosition() {
        if (!layers) {
            return;
        }
       // console.log(self.currentScroll, self.tar);
        panoramaContainer.x = -self.currentScroll+params.baseWidth*panoramaContainer.scale.x/2;



        for (var i = 0; i < layers.length; i++) {

                var layer = layers[i];

                var scrollingZShift = self.currentScroll/maxscroll - (params.initPositions[i][0]/params.baseWidth);
                var parallaxShift = scrollingZShift*params.baseWidth/2*(params.scrollingKoeff[i]-1);
                layer.x = (params.initPositions[i][0]-params.baseWidth/2) - parallaxShift;
                layer.y = params.initPositions[i][1];

                ///TUNING:)

                if(i===5 || i===8){
                    var scal=Math.min(1.0, app.view.width/layer.texture.width/panoramaContainer.scale.x*0.95);
                    layer.scale.set(scal);
                }


        }

        if (params.scrollUpdateCallback) {
            var scrolled = -self.currentScroll / maxscroll;
            var scrollingW = app.renderer.view.width / (maxscroll + app.renderer.view.width);
            params.scrollUpdateCallback(scrolled, scrollingW, self.currentScroll, app.renderer.view.width, maxscroll);
        }
    }

    var maxscroll
    var oldtime = performance.now();
    var oldScroll = null;
    var lastDirection = 0;

    function trackInteraction() {
        if (oldScroll) {
            var step = targetScroll - oldScroll;
            if (Math.abs(step) < THE_SMALLEST_STEP) {
                return;
            }

            var oldDirection = lastDirection;
            lastDirection = step > 0 ? 1 : -1;

            if (lastDirection != oldDirection) {
                if(lastDirection>0) {
                    params.trackLeft()
                }else{
                    params.trackRight()
                }

            }
        }
        oldScroll = targetScroll;
    }

    function gyroEvent(e) {
        //  targetScroll = targetScroll + 5;//clampScroll(targetScroll + 5);
        var isIOS = false;
        var speed = 2;
        var multiplier = isIOS ? speed * (Math.PI / 180) : speed;
        var nt = performance.now();
        var dt = nt - oldtime;
        oldtime = nt;
        var naccX = e.rotationRate.beta;
        var daccX = naccX / dt;//(naccX-accX);///dt;///dt*100;

        targetScroll = clampScroll(targetScroll - daccX * multiplier);
        trackInteraction()
    }


    var touchStarted = 0;
    var valueStarted = 0;
    var touching = false;

    function onMouseDown(mouseData) {
        touchStarted = mouseData.data.global.x;
        valueStarted = targetScroll;
        touching = true;
        mayBeClick = true;

    }

    function onMouseUp(mouseData) {
        if (mayBeClick) {
            onMouseClick();
        }
        touching = false;
    }

    function clampScroll(val) {
        if (val < 0) {
            return 0;
        }
        return Math.min(val, maxscroll);
    }


    function onMouseClick() {
        if (params.clickCallBack) {
            params.clickCallBack();
        }

    }

    var mayBeClick = false;

    function onMouseMove(mouseData) {
        if (touching) {
            var ex = mouseData.data.global.x;
            var dx = touchStarted - ex;
            if (Math.abs(dx) > 50) {
                mayBeClick = false;
            }

            targetScroll = clampScroll(valueStarted + dx);
            trackInteraction()

        }

    }

    var panoramaContainer;

    function setUpScene() {
        assetsLoaded = true;
        layers = new Array();
        panoramaContainer = new PIXI.Container();
        for (var i = 0; i < params.imagesURL.length; i++) {
            var texture = PIXI.loader.resources[params.imagesURL[i]].texture;

            var sprite = new PIXI.Sprite(texture);
            sprite.interactive = true;
            var ls = params.scales[i];
            sprite.anchor.set(0.5,0);
            sprite.pos = params.initPositions[i];

            sprite.scale = new PIXI.Point(ls, ls);
            if(i===CTA1){
                console.log("CTA1");
                    sprite.buttonMode = true;
                    sprite.on("tap", params.CTA1Click);
                    sprite.on("click", params.CTA1Click);
            }


            panoramaContainer.addChild(sprite);
            layers.push(sprite);
        }
        ///TUNE
        //layers[4].alpha = 0;

        app.stage.addChild(panoramaContainer);
        resize();
        //updateLayerSizes();
        updateScrollPosition();
        if (window.DeviceMotionEvent) {
            window.addEventListener("devicemotion", gyroEvent);
        }
        showElements();
    }

    function appearanceComplete() {
        targetScroll = maxscroll / 2;

        //      layer.x = - self.currentScroll * params.scrollingKoeff[i] + (params.initPositions[i][0] -  layer.gizmox)* scale;

        appearanceCompleted = true;
        if (params.animationFinishedCallback) {
            params.animationFinishedCallback();
        }
    }

    function showElements() {
        if (params.onReadyToShow) {
            params.onReadyToShow()
        }
        //appearanceComplete()
        //return;
        var delay = 0.2;
        var anDur = 1.5;
        /*for (i = 0; i < layers.length; i++) {

            var layer = layers[i];
            if (i < 2) {
                TweenMax.set(layer, {alpha: 0});
                TweenMax.to(layer, 2, {alpha: 1});
            } else {
                TweenMax.set(layer.scale, {x: 0, y: 0});
                TweenMax.to(layer.scale, 0.5, {x: 1, y: 1, delay: i * delay, ease: Cubic.easeOut});
            }
        }*/
        self.currentScroll = maxscroll;
        TweenMax.to(self, ((layers.length) * delay + anDur) * 1.3,
            {
                currentScroll: 0,//clampScroll(1E+4),
                ease: Cubic.easeInOut,
                onComplete: appearanceComplete
            });

    }

    function loadAssets(imagesArray) {
        PIXI.loader
            .add(imagesArray)
            .on("progress", loadProgressHandler)
            .load(setUpScene);

    }

    this.updateSize = function () {
        resize();
    }

    var scale;

    this.init = function (initObj) {
        app = new PIXI.Application({
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        });
        app.renderer.backgroundColor = 0xFFFFFF;
        app.ticker.add(onEnterFrame);
        parentContainer.appendChild(app.view);
        app.renderer.view.style.display = "block";
        window.addEventListener("resize", resize);
        params = initObj;
        //initObj.imagesURL.push(IMG_ROTATE_DEVICE);
        loadAssets(initObj.imagesURL);
        var stage = app.stage;

        stage.interactive = true;
        stage.mousedown = stage.touchstart = onMouseDown;
        stage.on("pointerdown", onMouseDown);
        stage.on("pointermove", onMouseMove);
        stage.on("pointerup", onMouseUp);
        document.addEventListener("mouseleave", function (event) {
            if ((event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) && touching) {
                onMouseUp(event);
            }
        });
        resize();
    }
}