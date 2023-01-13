var helperShowed = false;

function GyroParallax(containerId) {

    var assetsLoaded = false;
    var parentContainer = document.getElementById(containerId);
    var app;
    var params;
    var layers;
    this.currentScroll = null;
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

        function updateLayerSizes() {
            if (!layers) {
                return;
            }
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                layer.scale = new PIXI.Point(scale * params.scales[i], scale * params.scales[i]);
                layer.y = (params.initPositions[i][1] - layer.gizmoy) * scale;
                //layer.x = (params.initPositions[i][0] - layer.gizmox) * scale;

                if (!params.initPositions[i][0] && params.initPositions[i][0] != 0) {
                    params.initPositions[i][0] = BASE_WIDTH / 2 + layer.gizmox + maxscroll / 2 / scale * (params.scrollingKoeff[i] - 1);
                }
            }
            updateScrollPosition();
        }


        if (app) {
            app.renderer.resize(parentContainer.clientWidth, parentContainer.clientHeight);
            scale = app.renderer.view.height / params.baseHeight;
            maxscroll = params.baseWidth * scale - app.view.width;
            updateLayerSizes()
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
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            layer.x = -self.currentScroll * params.scrollingKoeff[i] + (params.initPositions[i][0] - layer.gizmox) * scale;
        }
        if (params.scrollUpdateCallback) {
            var scrolled = -self.currentScroll / maxscroll;
            var scrollingW = app.renderer.view.width / (maxscroll + app.renderer.view.width);
            params.scrollUpdateCallback(scrolled, scrollingW, self.currentScroll, app.renderer.view.width, maxscroll);
      //  params.scrollUpdateCallback(scrolled, scrollingW);
		}
    }

    var maxscroll

    var oldtime = performance.now();

    function startImpulses(light) {
        currentLight = null;

        function finishOneImpulse() {
            light.blendMode = PIXI.BLEND_MODES.DARKEN;
            if (currentLight) {
                setTimeout(startImpulses, 100, currentLight);
            }
        }

        light.blendMode = PIXI.BLEND_MODES.ADD;
        setTimeout(finishOneImpulse, 100);
    }

    var oldScroll = null;
    var currentLight = null;
    var lastDirection = 0;

    

    function trackInteraction() {
        if (oldScroll) {
            var step = targetScroll - oldScroll;
            if (Math.abs(step) < THE_SMALLEST_STEP) {
                return;
            }
            var oldLight = currentLight;
            var oldDirection = lastDirection;
            lastDirection = step > 0 ? 1 : -1;
            currentLight = lastDirection == 1 ? lightFromRight : lightFromLeft;
            if (lastDirection != oldDirection) {
                switch (currentLight) {
                    case lightFromLeft:
                        params.westWind();
                        break;
                    case lightFromRight:
                        params.eastWind();
                        break;
                }
            }
            if (!oldLight) {
                //startImpulses(currentLight);
            }
        }
        oldScroll = targetScroll;
    }

    function gyroEvent(e) {
        //  targetScroll = targetScroll + 5;//clampScroll(targetScroll + 5);
        var isIOS = false;
        var speed =1;
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

    var lightFromLeft
    var lightFromRight

    function addSprite(sprite, scale, clickCallback) {
        if (clickCallback) {
            sprite.buttonMode = true;
            sprite.on("tap", clickCallback);
            sprite.on("click", clickCallback);
        }
        var newLayer = new PIXI.Container();
        var scaleContainer = new PIXI.Container();
        sprite.interactive = true;

        sprite.x = -sprite.texture.width / 2 * scale;
        sprite.y = -sprite.texture.height / 2 * scale;

        newLayer.gizmox = sprite.x;
        newLayer.gizmoy = sprite.y;

        sprite.scale = new PIXI.Point(scale, scale);
        scaleContainer.addChild(sprite);
        newLayer.addChild(scaleContainer);
        newLayer.scalecont = scaleContainer;
        app.stage.addChild(newLayer);
        layers.push(newLayer);
    }

    var price

    function setUpScene() {
        assetsLoaded = true;
        layers = new Array();
        for (var i = 0; i < params.imagesURL.length; i++) {

            var sprite = new PIXI.Sprite(PIXI.loader.resources[params.imagesURL[i]].texture);
            if (i == LIGHT_FROM_LEFT) {
                lightFromLeft = sprite;
            } else if (i == LIGHT_FROM_RIGHT) {
                lightFromRight = sprite;
            } else if (i == 1) {
                sprite.visible = true;
                price = sprite;
            }
            var clickCallback
            switch (i) {
                case CTA1:
                    clickCallback = params.CTA1Click;
                    break;
                case CTA2:
                    clickCallback = params.CTA2Click;
                    break;
                default:clickCallback=null;
            }
            addSprite(sprite, params.scales[i], clickCallback);
        }


        resize();
        //self.showPrice();
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
        TweenMax.set(self, {currentScroll: maxscroll});
        TweenMax.to(self, 4,
            {
                currentScroll: 0,//clampScroll(1E+4),
                ease: Cubic.easeInOut,
                onComplete: appearanceComplete
            });
        killPreloader();
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