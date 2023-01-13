// Init Animations
function initAnimations() {
    let pageStart = lottie.loadAnimation({
        container: document.querySelector("#pageStartAnimation"),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'animation/start.json',
        rendererSettings: {
            progressiveLoad: true,
            className: 'svg-animation',
            viewBoxOnly: true
        }
    });
}

var orientationController;
function orientaionChanged(e){

}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}

var pixiBanner;


function initBanner() {
    initAnimations();
    setMobileSize();
    window.addEventListener("resize", setMobileSize);
    bodyScrollLock.disableBodyScroll(document.body);

    orientationController = new OrientationController("ad-container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged
        });
    orientationController.init();

    pixiBanner = new PixiBanner("page-game",{});
    pixiBanner.init();


  //  setTimeout(startGame, 3000);
  //  showGalScreens();
   //document.querySelector("#btn-start").onClick = startGame;

}

var gameStarted = false;

function startGame(){
    if(gameStarted){
       return
    }
    gameStarted = true;
    console.log("Start Game");
    hideFirestScreen();
    pixiBanner.initGame();

    clearTimeout(autoStartGame);
}

function hideHint(){

}


function hideFirestScreen(){

    TweenMax.to("#page-start .headline", 0.3,
        {opacity:0, scaleX:1.2, scaleY: 1.2},
    );
    TweenMax.to("#btn-start", 0.3,

        {opacity:0, y:"50%", delay:0.1,
            onComplete:function(){
                document.querySelector("#page-start").hidden = true;
            }
        },
    );

    TweenMax.to("#page-start .right-baloon",0.5,{right:"-20%", opacity:0});
    TweenMax.to("#btn-site", 0.3, {opacity:0, y:"50%" },
    );
}

//AutoStart
let autoStartGame;

// Overlay
let autoCloseOverlay;
let overlay = document.querySelector('.overlay');
overlay.addEventListener('click', OverlayCloseBtn);

function OverlayCloseBtn(){
    TweenMax.to("#page-start .overlay", 0.3,
        {opacity:0, scaleX:1.2, scaleY: 1.2,onComplete:()=>overlay.style.visibility = "hidden"});
    clearTimeout(autoCloseOverlay);
    autoStartGame = setTimeout(startGame, 4000);
}
// END Overlay


function showFirstScreen(){
    document.querySelector("#page-start").hidden = false;
    document.querySelector(".overlay").hidden = false;


    TweenMax.from("#page-start .right-baloon",1.0,{right:"-20%", opacity:0});

    TweenMax.fromTo("#page-start .headline", 1.0,
        {opacity:0, scaleX:1.2, scaleY: 1.2, x:"-50%",y:"0%"},
        {opacity:1, scaleX:1.0, scaleY: 1.0, x:"-50%",y:"0%"}
    );

    TweenMax.fromTo("#btn-start", 0.6,
        {opacity:0, y:"50%",delay:0.3, x:"-50%"},
        {opacity:1, y:"0%",x:"-50%"},
        );
    TweenMax.fromTo("#btn-site", 0.6,
        {opacity:0, y:"50%" , x:"-50%", left:"50%"},
        {opacity:1, y:"0%", x:"-50%",left:"50%"},
        );

    autoCloseOverlay = setTimeout(OverlayCloseBtn, 3000);
}

var animationVars = {
    num1:0,
    num2:0,
};

function updateNums(){
    document.querySelector("#page-result span").innerHTML = Math.floor(animationVars.num2) + "/" +  Math.floor(animationVars.num1);

}

function hideResultScreen(){

    TweenMax.to("#page-result .headline", 1.0,

        {
            top:"5%",
            opacity:0,
        }
    );

    TweenMax.to("#page-result span", 1.0,{scaleX:1.3,scaleY:1.3,opacity:0});

}

var win = false;

function showResultScreen(){
    document.querySelector("#page-result").hidden = false;

    animationVars.num1 = 0;
    animationVars.num2 = 0;

   // if()
    win = false;
    if(pixiBanner.getTotalBalls() ===  pixiBanner.getPiercedBalls()){
        win = true;
    }

    if(win) {
        document.querySelector("#res-headline1").hidden = false;
        document.querySelector("#res-headline2").hidden = true;

        TweenMax.fromTo("#res-headline1", 1.0,
            {
                opacity: 0,
                top: 0,
            },
            {
                top: "25%",
                opacity: 1,
            }
        );
    }else {
        document.querySelector("#res-headline1").hidden = true;
        document.querySelector("#res-headline2").hidden = false;


        TweenMax.fromTo("#res-headline2", 1.0,
            {
                opacity: 0,
                top: 0,
            },
            {
                top: "25%",
                opacity: 1,
            }
        );
    }


    TweenMax.set("#page-result span",{scaleX:1, scaleY:1});
    TweenMax.fromTo("#page-result span", 1.0,{
            x:"-50%",
            opacity:0
        },
        {
            x:"-50%",
            opacity:1
        }
     );

    TweenMax.to(animationVars, 0.5,{
        num1: pixiBanner.getTotalBalls(),
        num2: pixiBanner.getPiercedBalls(),
        onUpdate: updateNums,
    });

    setTimeout(showGalScreens, 3600)
    //#page-result span

}

function showGalScreens(){

    pixiBanner.hideChar();
    hideResultScreen();
    document.querySelector("#page-fin").hidden = false;
    document.querySelector("#g1").hidden = false;
    document.querySelector("#page-result").hidden = true;

    const pageDuration = 3.0;

    TweenMax.set("#g1",{top: "50%", left:"0%", opacity:0});
    TweenMax.to("#g1",0.5,{top: "0%", opacity:1});


    TweenMax.set("#btn-site-fin",{right: "-100%", opacity:0});
    TweenMax.to("#btn-site-fin",0.5,{right: "4%", opacity:1});
    TweenMax.fromTo("#btn-site-fin",0.5,{ scaleX:1, scaleY:1}, {scaleX:0.9, scaleY:0.9, repeat: 3, yoyo:true, delay:  0.5});
    TweenMax.fromTo("#btn-site-fin",0.5,{ scaleX:1, scaleY:1, repeat: 3, yoyo:true, delay: pageDuration*1.0 + 0.5}, {scaleX:0.9, scaleY:0.9});



}
function restartGame(){
    console.log("RESTAR GAME");
    TweenMax.to("#g4",0.5,{left: "0%", top:"-20%", opacity:0, onComplete: hideHTMLpages});
    TweenMax.to("#btn-site-fin",0.5,{opacity:0});
}

function hideHTMLpages(){
    document.querySelector("#page-fin").hidden = true;
    document.querySelector("#page-result").hidden = true;
    pixiBanner.initGame();

}

function gameLoaded(){
    showFirstScreen()
}


function showHint(){

}