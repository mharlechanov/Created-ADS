var orientationController;
function orientaionChanged(e){

}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}


function dealerLoaded(obj){
   console.log(obj);
    document.querySelector("#dealer-name").innerHTML = obj["Allonge"];
	document.querySelector("#dealer-price").innerHTML = obj["Leasingrate"];
    setUrlRromDealer(obj["URL"]);
}

var dealer;



function showScreen03(){
    TweenMax.to("#screen01",0.2,{scaleX:0.85,scaleY:0.9,y:"-7%"});
    TweenMax.to("#screen02",0.2,{scaleX:0.85,scaleY:0.9,y:"-7%"});
    TweenMax.to("#desclimer",0.2,{opacity:0,y:"-2%"});
    TweenMax.to("#logo-blue",0.2,{opacity:1});
    TweenMax.to("#logo",1.0,{opacity:0});
    TweenMax.to("#screen01-blue-bg",0.2,{x:"-120%",opacity:0,ease:Power2.easeIn});
    TweenMax.to("#screen01-msg1",0.2,{opacity:0,x:"-20%",delay:0.1, ease:Power3.easeIn});
	TweenMax.to("#screen02-msg1",0.2,{opacity:0,x:"-20%",delay:0.1, ease:Power3.easeIn});
    TweenMax.to("#screen01-price",0.2,{x:"20%", opacity:0, delay:0.9, ease:Power2.easeOut});
    TweenMax.from("#screen03-title",0.7,{x:"20%",opacity:0,delay:0.2});
    TweenMax.from("#dealer-info",0.7,{x:"20%",opacity:0,delay:0.3});
    TweenMax.from("#cta",0.7,{x:"20%",opacity:0,delay:0.4});

    //dealer-info
    //cta
    document.querySelector("#screen03").hidden = false;
 //   document.querySelector("#logo-blue").style.opacity = 0;
}

function showScreen02(){
    
    TweenMax.from("#screen02-msg1",0.2,{opacity:0,x:"20%",delay:0.3, ease:Power3.easeOut});
    //
    document.querySelector("#screen02").hidden = false;
    
    TweenMax.from("#screen02",0.4,{delay:0.7,opacity:0});
    setTimeout(showScreen03, 2000);
}


function showBanner(){
    document.querySelector("#logo-blue").style.opacity = 0;
    document.querySelector("#screen02").hidden = true;
    document.querySelector("#screen03").hidden = true;

    TweenMax.from("#screen01-bg",1.0,{opacity:0,scaleX:1.3,scaleY:1.3});
    TweenMax.from("#screen01-msg1",0.6,{opacity:0,x:"20%",delay:0.3, ease:Power3.easeOut});
    TweenMax.from("#screen01-msg2",0.6,{opacity:0,x:"20%",delay:0.4, ease:Power3.easeOut});
    TweenMax.from("#screen01-blue-bg",0.7,{x:"100%",delay:0.6, ease:Power2.easeOut});

    TweenMax.from("#screen01-price",0.6,{x:"20%", opacity:0, delay:0.9, ease:Power2.easeOut});
    TweenMax.from("#logo",0.7,{x:"20%", opacity:0, delay:1.0});



    setTimeout(showScreen02, 1500);


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
    dealer = new DealersObject(dealerId,"Hdl.-Nr.",dealerLoaded);
    showBanner();
    //showScreen03();
}