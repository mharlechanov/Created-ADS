var defaultDealerId = "152806";
var fallbackController;

// function callAction() {
//     // window.open(clickUrl);
//
// }
//
// function clickOut(e) {
//     // console.log(e.target.nodeName);
//     if (e.target.id !== "audio_icon" && e.target.id !== "replay-img") {
//         if (e.target.nodeName !== "CANVAS") {
//             callAction();
//         }
//     }
// }

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


function hideHelper() {
    if (helperAnimation) {
        helperAnimation.pause();
        TweenMax.to(document.getElementById("help-animation"), 1.0, {opacity: 0});
        helperAnimation = null;
    }
}
setTimeout(hideHelper, 29000);

var startscroll = null;

function onScrollUpdate ( scrolled, relativeWidth, scrollpos, totalWidth, maxWidth ) {
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

    var zshifr = (scrolled+0.5)*2;
    var scal = window.innerHeight/BASE_HEIGHT;
    var dealerScrollingCoeff = 1.3;

    dealer.style.left = window.innerWidth/1.7 + zshifr*maxWidth*dealerScrollingCoeff/2 + "px";// + zshifr*50+
    
}

var gyroParalaxObject;

function onBackGroundReady() {
    var btn = document.getElementById("help-animation");

    TweenMax.set(btn, {opacity: 0});
    TweenMax.to(btn, 0.5, {opacity: 1, delay: 0.25});
    //TweenMax.set(dealer, {opacity: 0});
    TweenMax.to(dealer, 0.5, {opacity: 1, delay: 0.5});
    TweenMax.from(dealer, 0.5, {y: window.innerHeight+2});
}

function dealerReady(dealer) {
    document.getElementById("txt1").innerText = dealer["DealerName"];
    //document.getElementById("txt2").innerText = dealer["Street"] + " " + dealer["Zip code"] + " " + dealer["Area"];
    //dealerClickURL = CTA1Click();
    //document.getElementById("dealer").onclick = panoramaClick();
    //gyroParalaxObject.showPrice(dealer["Angebotspreis"]);
    //killPreloader();
}

function startBanner() {
    //  document.getElementById('animation_container').style.opacity=1;
    //   console.log("srart banner", document.getElementById('animation_container'));

    // document.getElementById('preloader').style.display = 'none';
    // generalPreloader.stop();
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

var CTA1 = 4;

LIGHT_FROM_LEFT = 6;
LIGHT_FROM_RIGHT = 7;
var isBackgroundSensitive=true;
function initBanner() {
    if (dealerID) {
        defaultDealerId = dealerID;
    }

    dealerObj = new dealersObject(dealerJson, defaultDealerId, dealerReady);



    gyroParalaxObject = new GyroParallax("parallax-div");


    var scale = [];
    for (var i = 0; i < 100; i++) {
        scale[i] = 1;
    }


    gyroParalaxObject.init({
        showHelper: showHelper,
        imagesURL: [
            "images/bg.jpg",

            "images/text_left.png",
            "images/text_left2.png",
            "images/text_right.png",
            "images/text_right2.png",
            
           
            "images/text_center.png",
            "images/logo.png",
            

            


        ],
        scrollingKoeff: [
            1,

            1.1,
            1.1,
            1.1,
            1.1,
            

           
            1.3,
            1.2,
          

          

            //  1.1

        ],

        scales: scale,
        initPositions: [
            [BASE_WIDTH/2, 0],

            [BASE_WIDTH*0.145, 275],
            [BASE_WIDTH*0.148, 790],

            [BASE_WIDTH*0.88, 400],
            [BASE_WIDTH*0.85, 790],
                      

            [1000, 790],
            [1200, 25],
            

            


        ],
        buttonPaddings: 40,
        baseHeight: BASE_HEIGHT,
        baseWidth: BASE_WIDTH,
        clickCallBack: panoramaClick,
        scrollUpdateCallback: onScrollUpdate,
        animationFinishedCallback: onBackGroundReady,
        onReadyToShow: onReadyToShow,
        CTA1Click:CTA1Click,
        trackLeft:trackingFromLeftToRight,
        trackRight:trackingFromRightToLeft
    });

}

var THE_SMALLEST_STEP = 0.1;


var helperAnimation = null;
var helperCompleted = false;

function isAppearanceCompleted() {
    return gyroParalaxObject.isAppearanceCompleted();
}

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


