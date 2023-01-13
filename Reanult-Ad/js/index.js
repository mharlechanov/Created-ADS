var orientationController;
function orientaionChanged(e){

}


function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}

function dealerLoaded(obj){
   // var shopData=findDealerByZip(data,value,"zip");
    document.querySelector("#dealer-name").innerHTML = obj["Name"];
    document.querySelector("#dealer-address").innerHTML = obj["Str."] + "<br>"+obj["zip"] + " " + obj["ORT"]
	//clickUrl = 'https://' + obj["URL"];
}

var dealer;
function showBanner(){ 
   
	TweenMax.from("#screen01-msg1",0.6,{opacity:0,x:"5%",delay:0.3, ease:Power3.easeOut});	
    TweenMax.from("#screen01-msg2",0.6,{opacity:0,x:"20%",delay:0.4, ease:Power3.easeOut});
    TweenMax.from("#logo",0.7,{y:"20%", opacity:0, delay:0.5});
	TweenMax.from("#price",0.7,{x:"60%",opacity:0});
    TweenMax.from("#cta",0.7,{x:"20%",opacity:0,delay:0.5});
    setTimeout(() => {
        showScreen02();
    }, 3000); 

}

function showScreen02(){
    TweenMax.to("#price",0.7,{x:"-60%",opacity:0});
    document.querySelector("#screen02").hidden=false;
    TweenMax.from("#dealer-info",0.7,{x:"20%",opacity:0,delay:0.3});
    setTimeout(() => {
        showScreen03();
    }, 3000);
}
function showScreen03(){
    document.querySelector("#screen02").hidden=true;
    document.querySelector("#screen03").hidden=false;
    TweenMax.to("#screen01-bg",0.6,{opacity:0});	
    document.querySelector("#screen01-msg1").style.display="none";
    document.querySelector("#screen01-msg2").style.display="none";
    TweenMax.from("#legal",0.6,{opacity:0,y:"20%",delay:0.4, ease:Power3.easeOut});
    setTimeout(() => {
        showScreen04()
    }, 3000);
}
function showScreen04(){
    document.querySelector("#screen02").hidden=false;
    TweenMax.to("#legal",0.6,{opacity:0,y:"20%", ease:Power3.easeOut});
    TweenMax.to("#screen01-bg",0.6,{opacity:1});
    document.querySelector("#screen01-msg1").style.display="block";
    document.querySelector("#screen01-msg2").style.display="block";
    TweenMax.from("#cta",0.7,{x:"20%",opacity:0,delay:0.5});
}

var dealer;
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
    

	//console.log(zipCode);
	//if (zipCode){dealerid = zipCode;}
    dealer = new DealersObject(dealerId,"Händlernummer",dealerLoaded);
	//loadDealerJson(dealersList);
    showBanner();
    //showScreen03();
}