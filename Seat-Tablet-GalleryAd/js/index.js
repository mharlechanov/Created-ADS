var orientationController;
function orientaionChanged(e){
    console.log(e);
    galleryRenderer.bind(gallerySwipeController)()

}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);

    banner.style.height = window.innerHeight;
    galleryRenderer.bind(gallerySwipeController)()
    setPinPositions();
}


function setPinPositions(){
    var clipRec = document.querySelector("#gallery").getBoundingClientRect();
    var w = 1024;
    var h = 700;
    var pins =["#p1","#p2","#p3"];
    var dx = 180;
    var dy = 40;
    var pinsCoords = [{x:132+dx,y:410+dy}, {x:218+dx,y: 276+dy}, {x:444+dx, y: 232+dy}];

    var k1 = clipRec.width/w;
    var k2 = clipRec.height/h;

    var kMax = Math.max(k1,k2);
    var locX = (clipRec.width - w*kMax)/2;
    var locY = (clipRec.height - h*kMax)/2;

    console.log(locX,locY);

    for(i=0;i<pins.length;i++){
        var x1 = pinsCoords[i].x*kMax+locX;
        var y1 = pinsCoords[i].y*kMax+locY;
        TweenMax.set(pins[i],{left:x1,top:y1});
    }



    //p1
}
var gallerySwipeController;
var galleryItemsCount = 4;

function galleryRenderer(){
    if(!orientationController){
        return;
    }
    var scroll = this.scrolling;
    var thumbsArr = ["#thumb1","#thumb2","#thumb3","#thumb4"];
    var textsArr = ["","#t2","#t3","#t4"];


    var cont = document.querySelector("#gallery-items");
    cont.style.left = scroll*100 + "%";
    var index = Math.round(scroll);
    var dInd = Math.abs(index-scroll);



    TweenMax.set("#thumb-highlighter",{scaleX:1-dInd,scaleY:1-dInd,x:"-50%",y:"-50%"});


    var itemRelation = document.querySelector(thumbsArr[Math.abs(index)]);
    if(itemRelation) {
        TweenMax.set("#thumb-highlighter", {left: itemRelation.offsetLeft, top: itemRelation.offsetTop});
    }

    for(var i=0;i<textsArr.length;i++){
        if(textsArr[i]){
            TweenMax.set(textsArr[i], {opacity:0});
        }
    }

    if (textsArr[Math.abs(index)]) {
        if(this.isJumping()){
            if(this.getTargetScroll() === -index){
                var textRelation = document.querySelector(textsArr[Math.abs(index)]);
                TweenMax.set(textRelation, {left: dInd * 10 + "%", opacity: 1 - dInd * 3});
            }

        }else {
            var textRelation = document.querySelector(textsArr[Math.abs(index)]);
            TweenMax.set(textRelation, {left: dInd * 10 + "%", opacity: 1 - dInd * 3});
        }
    }



    var k = Math.min(Math.max(0,-scroll - 1),1);
    if(orientationController.isLandscape){
        TweenMax.set("#gallery-thumbnals-container", {top: -35.5*(k) + "%", left: 0});
    }else{
        TweenMax.set("#gallery-thumbnals-container", {left: -35.5*(k) + "%", top: 0});
    }

    if(!index){
        document.querySelector("#arrow-backward").hidden = true;
        document.querySelector("#icon-back").hidden = true;
    }else{
        document.querySelector("#icon-back").hidden = false;
        document.querySelector("#arrow-backward").hidden = false;
    }

    if(-index === galleryItemsCount-1){
        document.querySelector("#arrow-forward").hidden = true;
    }else{
        document.querySelector("#arrow-forward").hidden = false;
    }


}
var trackHome=false;
function thumbClick(e){
    gallerySwipeController.to(-(e-1));
    trackGalleryButtons(gallerySwipeController.getLocalScroll());
}

function nextItem(){
    gallerySwipeController.next();
    trackGalleryButtons(gallerySwipeController.getLocalScroll());
}

function prevItem(){
    gallerySwipeController.prev();
    trackGalleryButtons(gallerySwipeController.getLocalScroll());
}

function goHome(){
    gallerySwipeController.to(0);
	if(trackHome==false){
		trackHome=true;
	}
    trackGalleryButtons(gallerySwipeController.getLocalScroll());

}

function onSwipeChanged(e) {
    trackGallerySwipe(e, gallerySwipeController.getLocalScroll());
}

function onGalleryClick(){
    backgroundClick();
}

function closeColyRight(){
    var copyLayer = document.querySelector("#copyright-layer");
    copyLayer.hidden = false;
    TweenMax.to(
        copyLayer,
        0.4,
        {
        opacity:0,
        top:"50%",
        onComplete: function(){
            var copyLayer = document.querySelector("#copyright-layer");
            copyLayer.hidden = true;
        }
        }
    );
}
function openCopyRight(){
    var copyLayer = document.querySelector("#copyright-layer");
    copyLayer.hidden = false;
    TweenMax.set(copyLayer,{opacity:0,top:"50%"});
    TweenMax.to(copyLayer,0.5,{opacity:1,top:"0%"});

}

function showBanner(){
    TweenMax.from(document.querySelector(".gallery-item"),0.5, {scaleX:1.1,scaleY:1.1,opacity:0});
    TweenMax.from("#gallery-headline",1.0, {x:"-100%",opacity:0,delay:0.1});
    TweenMax.from("#p1",0.5, {scaleX:1.7,scaleY:1.7,opacity:0,delay:0.5});
    TweenMax.from("#p2",0.5, {scaleX:1.7,scaleY:1.7,opacity:0,delay:0.7});
    TweenMax.from("#p3",0.5, {scaleX:1.7,scaleY:1.7,opacity:0,delay:0.9});

    TweenMax.from("#thumb1",0.5, {opacity:0,delay:0.9});
    TweenMax.from("#thumb2",0.5, {opacity:0,delay:1.1});
    TweenMax.from("#thumb3",0.5, {opacity:0,delay:1.3});
    TweenMax.from("#arrow-forward",0.5, {opacity:0,delay:1.5});
    TweenMax.from("#arrow-backward",0.5, {opacity:0,delay:1.5});

    TweenMax.from("#thumb-highlighter",0.5, {opacity:0,delay:1.0});
    TweenMax.from("#static-elements",1.0, {opacity:0});


}

function initBanner() {

    window.addEventListener("resize", setMobileSize);
    bodyScrollLock.disableBodyScroll(document.body);

    document.querySelector("#ad-container").style.display = "block";

    orientationController = new OrientationController("ad-container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged
        });
    orientationController.init();


    gallerySwipeController = new SwipeController(document.querySelector("#gallery"),
        {
            onScrollChanged:galleryRenderer,
            trackSwipe:onSwipeChanged,
            elementsCount:galleryItemsCount,
            looped: false,
            onClickItem:onGalleryClick,
        });
    setMobileSize();
    showBanner();
	document.getElementById("body").removeAttribute("onclick");
}