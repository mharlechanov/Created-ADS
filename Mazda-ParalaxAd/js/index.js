var fallbackController;

function onReadyToShow() {
    startBanner();
}

function orientaionChanged() {

    if (fallbackController.isLandscape) {

    } else {

    }
    if (gyroParalaxObject) {
        gyroParalaxObject.updateSize();
    }

    // console.log("is landscape = ", fallbackController.isLandscape);
}

function showPopUp(){
    document.querySelector("#popup").hidden = false;
    TweenMax.set("#popup", {bottom:"40%",opacity:0});
    TweenMax.set("#popup-txt",  {bottom:"-40%",opacity:0});
    //TweenMax.set("#close-txt",  {top:"2%",opacity:0});

    TweenMax.to("#popup", 0.3, {bottom:0,opacity:1});
    TweenMax.to("#popup-txt", 0.5, {bottom:"0%",opacity:1});
   // TweenMax.to("#close-txt", 0.3, {bottom:"100vw",opacity:1, delay:0.3});

}

function closePopUp(){

    TweenMax.to("#popup", 0.3,{bottom:"0%",opacity:0,
        onComplete:function(){
            document.querySelector("#popup").hidden = true;
        }
    });
    TweenMax.to("#popup-txt", 0.3, {bottom:"0%",opacity:0});
    //TweenMax.set("#close-txt",  {bottom:"50%",opacity:0});

}
function hideHelper() {
    if (helperAnimation) {
        helperAnimation.pause();
        TweenMax.to(document.getElementById("help-animation"), 1.0, { opacity: 0 });
        helperAnimation = null;
    }
}
setTimeout(hideHelper, 29000);
var startscroll = null;

function onScrollUpdate(scrolled, relativeWidth, maxWidth) {
    //   scrollingTracking(scrolled);
    if (helperShowed && !startscroll) {
        startscroll = scrolled
    }
    if (startscroll) {
        var dx = Math.abs(startscroll - scrolled);
        if (dx > THE_SMALLEST_STEP) {
            hideHelper();
            helperCompletedPlayed = true;
        }

    }
    var scroller = document.getElementById("scroller-indicator");

    var s = -scrolled * (1 - relativeWidth);
    scroller.style.left = s * 100 + "%";
    scroller.style.width = (relativeWidth * 100) + "%";

    var zshifr = (scrolled + 0.33) * 2;
   // console.log(zshifr);
    //console.log(scrolled);
   // var info =  document.getElementById("info");
   // var dealerScrollingCoeff = 1;
    //info.style.right = 12 + scrolled + "%";
    
    //info.style.right = scrolled*maxWidth + "%";// + zshifr*50+
    // info.style.left = 307 + scrolled * 100 * 2.2 + "%";
    // "px"; 85%
    //info.style.right = scrolled/1000 * (maxWidth) + "%";
    

    //info.style.right = 2 + "%";
    //console.log(info.style.right);
}

var gyroParalaxObject;

function onBackGroundReady() {
    var btn = document.getElementById("help-animation");

    TweenMax.set(btn, { opacity: 0 });
    TweenMax.to(btn, 0.5, { opacity: 1, delay: 0.25 });
}



function startBanner() {

    fallbackController = new FallbackController("animation_container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged
        });
    fallbackController.init();
    if (gyroParalaxObject) {
        gyroParalaxObject.updateSize();
    }

}

var BASE_WIDTH = 2000;
var BASE_HEIGHT = 960;
var CTA1 = 6;
var CTA2 = 2;
LIGHT_FROM_LEFT = 3;
LIGHT_FROM_RIGHT = 7;
var isBackgroundSensitive = true;

function initBanner() {

    //console.log("init Bannet")

    //   var anCont = document.getElementById("animation_container");
    //    anCont.addEventListener("click", clickOut);

    //----controller for vertical device orientation.


    gyroParalaxObject = new GyroParallax("parallax-div");

    var zklogo = 1;

    var scrollingCoefficient = [
        1
        //left side:


    ];

    var width = [
        BASE_WIDTH,

        //left side:
        1
  

    ];

    var scale = new Array(scrollingCoefficient.length);
    for (var i = 0; i < scale.length; i++) {
        scale[i] = 1;
    }

    gyroParalaxObject.init({
        showHelper: showHelper,
        imagesURL: [
            "images/bg.jpg"

       


        ],
        scrollingKoeff: scrollingCoefficient,
        scales: scale,

        initPositions: [
            [0, 0]

        

        ],
        buttonPaddings: 40,
        baseHeight: BASE_HEIGHT,
        baseWidth: BASE_WIDTH,
        clickCallBack: panoramaClick,
        scrollUpdateCallback: onScrollUpdate,
        animationFinishedCallback: onBackGroundReady,
        onReadyToShow: onReadyToShow,
        CTA1Click: CTA1Click,
        CTA2Click: CTA2Click,
        westWind: trackingFromLeftToRight,
        eastWind: trackingFromRightToLeft
    });

}

var THE_SMALLEST_STEP = 0.1;


var helperAnimation = null;
var helperCompleted = false;

function isAppearanceCompleted() {
    return gyroParalaxObject.isAppearanceCompleted();
}
/*var font = new FontFaceObserver('OpelCondenced');

font.load().then(function () {
  console.log('Output Sans has loaded.');
});*/
function showHelper() {
    // console.log("show helper called");
    var invitation = window.DeviceMotionEvent ? "lottie/inviteToShake.json" : "lottie/inviteToSwipe.json";
    var divElement = document.getElementById("help-animation");


    if (window.DeviceMotionEvent) {
        helperAnimation = lottie.loadAnimation({
            container: divElement,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: invitation
        });
        var border = 45;
        helperAnimation.onComplete = function () {
            helperCompleted = true;
            helperAnimation.playSegments([border + 1, 225], false);

        };

        function onDataReady() {
            helperAnimation.playSegments([0, border], true);
        }

        helperAnimation.addEventListener("data_ready", onDataReady);
    } else {
        helperAnimation = lottie.loadAnimation({
            container: divElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: invitation
        });
    }
}


