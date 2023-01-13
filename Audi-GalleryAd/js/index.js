var orientationController;
function orientaionChanged(e){

}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}

var gallerySwipeController;

function setBullet(dom,id,val){


    var df = val-Math.floor( val);
    var scal = 0;
    if(Math.abs(val-id)<1){
        if(val-id >= 0){
            scal = 1-df;
        }else{
            scal = df;
        }
    }


    TweenMax.set(dom,{scaleX:scal,scaleY:scal});

}
function galleryRenderer(){
   // console.log(this.scrolling);
    var scroll = this.scrolling;
    TweenMax.set("#top-elements", {left:-scroll*100 + "%"})
    TweenMax.set("#bottom-elements", {left:scroll*100 + "%"})
    TweenMax.set("#top-texts", {left:scroll*100 + "%"})
    TweenMax.set("#bottom-texts", {left:-scroll*100 + "%"});

    var pscroll = -scroll;


    setBullet("#b1 img",0,pscroll);
    setBullet("#b2 img",1,pscroll);
    setBullet("#b3 img",2,pscroll);
    setBullet("#b4 img",3,pscroll);



}

function showPopUp(){
    document.querySelector("#popup").hidden = false;
    TweenMax.set("#popup", {top:"50%",opacity:0});
    TweenMax.set("#popup-txt",  {bottom:"-30%",opacity:0});
    TweenMax.set("#close-txt",  {bottom:"110vw",opacity:0});

    TweenMax.to("#popup", 0.3, {top:0,opacity:1});
    TweenMax.to("#popup-txt", 0.5, {bottom:"2vw",opacity:1});
    TweenMax.to("#close-txt", 0.3, {bottom:"100vw",opacity:1, delay:0.3});

}

function showBanner(){
    TweenMax.from("#bg", 0.5, {opacity:0,scaleX:1.2,scaleY:1.2});

    TweenMax.from("#top-elements",0.6 , {left:"-100%"});
    TweenMax.from("#logo",0.5 , {left:"10%",opacity:0,delay:0.3});
    TweenMax.from("#bottom-elements",0.6 , {left:"100%"});

    TweenMax.from("#top-texts",0.6 , {left:"40", delay:0.4,opacity:0});
    TweenMax.from("#bottom-texts",0.6 , {left:"40", delay:0.6,opacity:0});
    TweenMax.from("#disclamer",0.6 , {bottom:"-10%", delay:0.7,opacity:0});

     TweenMax.from("#pager",0.6 , {left:"40%", delay:0.7,opacity:0});


}

function closePopUp(){

    TweenMax.to("#popup", 0.3,{top:"50%",opacity:0,
        onComplete:function(){
            document.querySelector("#popup").hidden = true;
        }
    });
    TweenMax.to("#popup-txt", 0.3, {bottom:"30%",opacity:0});
    //TweenMax.set("#close-txt",  {bottom:"50%",opacity:0});

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
    gallerySwipeController = new SwipeController(document.querySelector("#gallery"),
        {
            onScrollChanged:galleryRenderer,
            elementsCount:4,
        });
    showBanner()
}