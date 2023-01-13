var orientationController;
var videpPlayer;
function orientaionChanged(e){

}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}

function showBanner(){
    TweenMax.from("#bg",1.0,{scaleX:1.1,scaleY:1.1, opacity:0})
    TweenMax.from("#snow",1.0,{scaleX:1.3,scaleY:1.3, opacity:0})
    TweenMax.to("#snow",20.0,{backgroundPosition:"10px 1000px"})
   // TweenMax.from("#snow"

    TweenMax.from("#headline",0.5,{y:"-100%",delay:0.5});
    TweenMax.from("#arrow-left",0.5,{x:"100",delay:0.2,opacity:0});
    TweenMax.from("#arrow-right",0.5,{x:"-100",delay:0.2,opacity:0})
    TweenMax.from("#gallery-container",1.0,{scaleX:0.8,scaleY:0.8,opacity:0,delay:0.4})

    TweenMax.from("#cta",0.5,{x:"-110%",delay:0.7,opacity:0})
    TweenMax.from("#logo",0.5,{x:"110%",delay:0.7,opacity:0})
    TweenMax.from("#footer",0.5,{y:"100%",delay:1.0,opacity:0})

    killlbodyClick();
    //snow

}

var pages = 6;
function galleryRenderer(){
    var scroll = this.scrolling;
    var positiveScroll = scroll + pages*10000000 - 1;

    var localScroll = positiveScroll - Math.floor((positiveScroll)/pages)*pages - pages + 1;

    TweenMax.set("#gallery-bottom", {left:localScroll*100 + "%"})
    TweenMax.set("#prices", {left:localScroll*120 + 65 + "%"})



}

function onSwipeChanged(val){
    console.log("target scroll == ", gallerySwipeController.getLocalScroll());
    if(gallerySwipeController.getLocalScroll() == 0){
    //    videoPlayer.resume();
        if(videoPlayer.isPlaying()){
            TweenMax.to("#btn-play",0.5,{opacity:0});
            videoPlayer.resume();
        }


    }else{
        TweenMax.to("#btn-play",0.5,{opacity:1});
        videoPlayer.pause();
    }

    trackSwipe(val)
}

function onVideoReady(){
   // document.querySelector("#btn-play").hidden = false;
    TweenMax.from("#btn-play",0.5,{opacity:0});
    TweenMax.from("#video",1.0,{opacity:0})
}

function videoFinished(){
    console.log("video finished");
    TweenMax.to("#btn-play",0.5,{opacity:1});
}


var progressStep = 25;
var oldProgress = -1;

function videoProgress(val){

    var progress = Math.floor(val*100/progressStep);

    if(progress !== oldProgress){
        oldProgress = progress;
        trackVideo(progress*progressStep);
    }

}

var  gallerySwipeController;

function replayVideo() {
    TweenMax.to("#btn-play",0.5,{opacity:0});
    videoPlayer.startAd()
}

function leftClick(){
    gallerySwipeController.prev()
}

function rightClick(){
    gallerySwipeController.next()
}
function onGalleryClick(e){
    galleryClick(e)

}
function initBanner() {
    setMobileSize();
    window.addEventListener("resize", setMobileSize);
    bodyScrollLock.disableBodyScroll(document.body);

    orientationController = new OrientationController("ad-container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged

        });
    orientationController.init();

    gallerySwipeController = new SwipeController(document.querySelector("#gallery-container"),
        {
            onScrollChanged:galleryRenderer,
            trackSwipe:onSwipeChanged,
            elementsCount:6,
            looped: true,
            onClickItem:onGalleryClick,
        });

    videoPlayer =  new CustomPlayer("video",{
        contentURL:'video_v1.xml',
        videoReadyCallback:onVideoReady,
        videoFinishedCallback:videoFinished,
        videoProgressCallbak:videoProgress,


        autoPlay:true,
        soundOn:false,
    });
    document.querySelector("#btn-play").style.opacity=0;
    document.querySelector("#btn-play").style.pointerEvents ="auto";
    document.querySelector("#btn-play").onclick = replayVideo;

    document.querySelector("#arrow-left").onclick = leftClick;
    document.querySelector("#arrow-right").onclick = rightClick;
	document.querySelector("body").onclick = null;
    showBanner()

}