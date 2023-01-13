var orientationController;
function orientaionChanged(e){

}

function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}
var curentQuestion = 0;

function showFirstScreen(){
    document.querySelector("#intro-screen").hidden = false;
    TweenMax.from("#logo",0.5,{left:"10%",opacity:0});

    TweenMax.from("#sc01-greeting",0.5,{left:"80%",opacity:0});
    TweenMax.from("#sc01-cta",0.5,{left:"-20%",opacity:0});

    document.querySelector("#intro-screen").addEventListener("click",function(){
		addTrackingScript(trackStart);
        showQuestionScreen()
    });

    TweenMax.from("#sc01-left-image",0.5,{height:"0%", top: "50%",opacity:0,delay:0.2, ease:Cubic.easeOut});
    TweenMax.from("#sc01-right-image",0.5,{width:"0%",left:"100%",opacity:0,delay:0.4, ease:Cubic.easeOut});
    TweenMax.from("#sc01-bottom-image",0.5,{height:"0%",opacity:0,delay:0.4, ease:Cubic.easeOut});
    curentQuestion = 1;

    var qst = document.querySelectorAll(".no");
    for(var i = 0; i<qst.length ; i++){
        qst[i].addEventListener("click", noPressed);
		
    }
    qst = document.querySelectorAll(".yes");
    for(var i = 0; i<qst.length ; i++){
        qst[i].addEventListener("click",yesPressed);
		
    }
}

function yesPressed(){
    hideQuestion(curentQuestion,0);
	addTrackingScript(trackYes);
    showGallery()
}

function noPressed(){
    hideQuestion(curentQuestion,1);
    curentQuestion++;
	addTrackingScript(trackNo);
    if(curentQuestion<4){
        showQuestion(curentQuestion, 0);
    }else{
        showGenericScreen()
    }
}

function showGenericScreen(delay){
    var divName="#no-answer";
    document.querySelector(divName).hidden = false;
    TweenMax.from(divName+" .big-image",0.5,{left:"-70%",opacity:0, delay:delay});

    TweenMax.from(divName+" .fin-text",0.5,{left:"70%",opacity:0, delay:delay});
    TweenMax.from(divName+" .cta",0.5,{left:"-70%",opacity:0, delay:delay});

    //TweenMax.from(divName+" .yes",0.5,{top:"50%",opacity:0,delay:delay});
    //TweenMax.from(divName+" .no",0.5,{top:"50%",opacity:0,delay:0.1+ delay});

}
function showQuestion(id, delay){

    var divName="#question0"+id;
    document.querySelector(divName).hidden = false;
    TweenMax.from(divName+" .big-image",0.5,{left:"-70%",opacity:0, delay:delay});
    TweenMax.from(divName+" .question-text",0.5,{left:"70%",opacity:0, delay:delay});
    TweenMax.from(divName+" .yes",0.5,{top:"50%",opacity:0,delay:delay});
    TweenMax.from(divName+" .no",0.5,{top:"50%",opacity:0,delay:0.1+ delay});


}

var hidedScreen;
function makeHidden(){
    document.querySelector(hidedScreen).hidden = true;
}
function hideQuestion(id,isNo){
    var divName="#question0"+id;
    hidedScreen = divName;
    TweenMax.to(divName+" .big-image",0.5,{left:"70%",opacity:0});
    TweenMax.to(divName+" .question-text",0.5,{left:"-70%",opacity:0});

    if(isNo){
        TweenMax.to(divName+" .no",0.5,{scaleX:3.0,scaleY:3.0,opacity:0, delay:0.1, onComplete:makeHidden});
        TweenMax.to(divName+" .yes",0.5,{scaleX:0,scaleY:0,opacity:0});
    }else{
        TweenMax.to(divName+" .yes",0.5,{scaleX:3.0,scaleY:3.0,opacity:0 });
        TweenMax.to(divName+" .no",0.5,{scaleX:0,scaleY:0,opacity:0,delay:0.1,onComplete:makeHidden});

    }

}

function showQuestionScreen(){

    document.querySelector("#question-screen").hidden = false;
    TweenMax.to("#intro-screen",0.5,{left:"-100%",opacity:0});
    showQuestion(curentQuestion);
//    question01



}

var pages = 3;
function galleryRenderer(){
    var scroll = this.scrolling;
    var positiveScroll = scroll + pages*10000000 - 1;

    var localScroll = positiveScroll - Math.floor((positiveScroll)/pages)*pages - pages + 1;

    TweenMax.set("#gallery", {left:localScroll*120 + "%"})
    //TweenMax.set("#prices", {left:localScroll*120 + 65 + "%"})



}

function onSwipeChanged(val){

   // console.log("target scroll == ", gallerySwipeController.getLocalScroll());

   trackSwipe();
}

function onGalleryClick(e){
    galleryClick(e,curentQuestion);

}
var  gallerySwipeController;

function showGallery() {

    document.querySelector("#gallery-screen").hidden = false;

    TweenMax.from("#gallery-screen", 0.5, {top:"100%",opacity:0, delay:0.4});

    gallerySwipeController = new SwipeController(document.querySelector("#gallery-screen"),
        {
            onScrollChanged:galleryRenderer,
            trackSwipe:onSwipeChanged,
            elementsCount:pages,
            looped: true,
            onClickItem:onGalleryClick,
        });
    if(curentQuestion>1){
        var arr = document.querySelectorAll("#gallery .gallery-item");

        var name="Y";
        if(curentQuestion>2){
            name = "M";
        }
        //img/1image-F.jpg
        for(var i=0;i<arr.length;i++){
            var img = arr[i].getElementsByClassName("gallery-image")[0];
            var ind = i%3+1;
            img.style.backgroundImage = "url("+gloabalURLPath+"img/"+ind+"image-"+name+".jpg)";
            //console.log(img);

            var txt = arr[i].getElementsByClassName("gallery-desc")[0];
            txt.src = gloabalURLPath+"img/"+ind+"name-"+name+".svg"
        }

        //console.log(arr);
    }
    TweenMax.from("#arrow-left",0.5,{left:"40%",delay:0.7, opacity:0});
    TweenMax.from("#arrow-right",0.5,{right:"40%",delay:0.7, opacity:0});

    document.querySelector("#arrow-left").onclick =leftClick;
    document.querySelector("#arrow-right").onclick =rightClick;

}
function leftClick(){
    gallerySwipeController.prev()
}

function rightClick(){
    gallerySwipeController.next()
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

	document.getElementById("body").removeAttribute("onclick");	
    showFirstScreen()

}