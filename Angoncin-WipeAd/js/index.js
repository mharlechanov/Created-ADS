var bgScrollSpeed = 1.7;
var fallbackController;

function callAction() {
    // window.open(clickUrl);
    console.log("click but not on replay or mute button");
}


function orientaionChanged() {


    if (videoPlayer) {
        if (fallbackController.isLandscape) {

        } else {

        }
    }

    // console.log("is landscape = ", fallbackController.isLandscape);
}
function showPopUp(){
    document.querySelector("#overlay").hidden = false;

}
function closePopUp(){
    document.querySelector("#overlay").hidden = true;
}

var videoPlayer, gyroParalaxObject;
function initAnimations(){
    var params = {
        container: document.getElementById("lottie"),
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "images/data.json"
    };
    anim1 = lottie.loadAnimation(params);
    //anim1.addEventListener("data_ready", lottieLoaded);
}

function onBackGroundReady() {


}
var startTime = 0;
var duration = 8.0;
var maxTime = 15.0;
function entF(){

    var dt = performance.now() - startTime;
    var sec = dt/1000;
    //var time = Math.floor(maxTime-duration+sec);
    //var txtTime = "0:"+time;
    //document.querySelector("#counter-vals").innerHTML = txtTime;
    //console.log(sec);
    //console.log(dt);
    if(sec > duration){
        document.getElementById("disc").hidden=false;
    }else{
        requestAnimationFrame(entF);
    }


}
function initBanner() {

    //console.log("start")
    //----controller for vertical device orientation.
    fallbackController = new FallbackController("animation_container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged
        });
    fallbackController.init();

    
    gyroParalaxObject = new wipeBanner("parallax-div").init({

        baseHeight: 1408,
        baseWidth: 1080,
        clickCallBack: callAction,
        brushTexture: globalURLPath + "images/brush.png",
        
        animationFinishedCallback: onBackGroundReady,
    })
    setTimeout(function(){
        document.getElementById("parallax-div").hidden=false;
        document.getElementById("lottie").hidden=true;
    },2200)
    entF();
}


