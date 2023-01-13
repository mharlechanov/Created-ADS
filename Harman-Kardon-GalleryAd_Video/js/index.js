var fallbackController;

let galleryIem = document.getElementById("galleryItem").innerHTML;
let galleryObject;

function orientaionChanged() {

}



function onProductChanged(e) {
    trackGalleryItem(e);
}


function showBanner() {

    TweenMax.set("#scrolling-container", {opacity: 0});
    TweenMax.to("#scrolling-container", 1, {opacity: 1});


    TweenMax.set(".left-arrow", {opacity: 0, left: 150});
    TweenMax.to(".left-arrow", 1, {opacity: 1, left: "12%"});

    TweenMax.set(".right-arrow", {opacity: 0, right: 150});
    TweenMax.to(".right-arrow", 1, {opacity: 1, right: "12%"});


    TweenMax.from("#logo", 1, {x: -300, opacity:0});
    TweenMax.from("#CTA", 1, {x: 300, opacity:0});

    TweenMax.set("#video-play",{opacity:0});

    TweenMax.from("#video-comtainer",1,{y:100,opacity:0});


    TweenMax.from("#scrolling-container .text",1,{y:"-100%",delay:0.5});
    TweenMax.to("#scrolling-container .text",1,{opacity:1,delay:0.5});

    TweenMax.to("#bg",2,{opacity:1});


}



function findDealerByZip(data,zip,field){
    var mutches = [[],[],[],[],[],[]];
    var highest_mutches = 0;
    var shopData;
    function calcMutches(str1,str2){
        if(!str1 || !str2){
            return 0;
        }
        var len = Math.min(str1.length, str2.length);
        for(var i=0;i<len;i++){
            if(str1.substr(i,1) !== str2.substr(i,1)){
                return i;
            }
        }

        return i;
    }

    for(var i = 0; i<data.length; i++){
        var m = calcMutches(data[i][field],zip);
        if(m>highest_mutches){
            highest_mutches = m;
        }
        mutches[m].push(data[i]);
    }

    var highestMutchesArr = mutches[highest_mutches];
    if(highest_mutches<3){
        shopData = data[Math.floor(Math.random()*data.length)];
    }else{
        shopData = highestMutchesArr[Math.floor(Math.random()*highestMutchesArr.length)];
    }
    return shopData;
}

function findDealerByDealerId(data,dealerId){
    for(var i=0;i<data.length;i++){
        if(data[i]["Nr."]==dealerId){
            return data[i];
        }
    }
}

function dealersLoaded(data, value) {
    //var shopData=findDealerByZip(data,value,"PLZ");
    var shopData=findDealerByDealerId(data,value);

    var txt = document.querySelector("#address");
    //txt.innerHTML = shopData["Stadt"] + ", " + shopData["address"];
	txt.innerHTML = "C&A Mode GmbH & Co. KG, Wanheimer Str. 70, 40468 Düsseldorf";
    onZipDataLoaded(shopData)
    return shopData;
}


function loadDealerJson(jsonURL) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonURL, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            var jsondata = JSON.parse(xobj.responseText);
            var shopData = dealersLoaded(jsondata, dealerid);

            galleryObject.setData(galleryArray);

        }
    };
    xobj.send(null);

}


function setMobileSize() {
    var banner = document.getElementById("ad-container");
    banner.style.height = window.innerHeight;
}

function getUrlVars() {
    var e = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (r, a, n) {
        e[a] = n
    });
    return e
}

function onGalleryReady() {
    showBanner()
}

var videpPlayer;
var progressStep = 25;
var oldProgress = -1;

function videoProgress(val){

    var progress = Math.floor(val*100/progressStep);

    if(progress !== oldProgress){
        oldProgress = progress;
        trackVideo(progress*progressStep);
    }

}

function replayVideo(){
    videpPlayer.replay();
    document.querySelector("#video-play").hidden = true;
}

function onVideoReady(){
document.querySelector("video").addEventListener("click", function(){
clickOut(clickURL);
});
}

function videoFinished(){
    document.querySelector("#video-play").hidden = false;
    TweenMax.set("#video-play",{opacity:0});
    TweenMax.to("#video-play",0.5,{opacity:1});
}


function initBanner() {
    setMobileSize();

    window.addEventListener("resize", setMobileSize);
    bodyScrollLock.disableBodyScroll(document.body);

    fallbackController = new FallbackController("ad-container", "landscape_fallback",
        {
            ratio: 1.0,
            orientaionCallback: orientaionChanged
        });
    fallbackController.init();

    params = getUrlVars();
    if (params.dealerid) {
        console.log(params.dealerid)
        dealerid = params.dealerid;
    }

    galleryObject = new productGallery("scrolling-container",
        {
            htmlTemplate: galleryIem,
            onClickItem: onProductClicked,
            onProductChanged: onProductChanged,
            looped: true,
            galleryReady: onGalleryReady,
        }
    );

    videpPlayer =  new CustomPlayer("video",{
        contentURL:'video_v1.xml',
        videoReadyCallback:onVideoReady,
        videoFinishedCallback:videoFinished,
        videoProgressCallbak:videoProgress,
        autoPlay:true,
        soundOn:true,
    });
    document.querySelector("#video-play").hidden = true;
    document.querySelector("#video-play").onclick = replayVideo;
    galleryObject.setData(galleryArray);
    //loadDealerJson(dealersList);

}

