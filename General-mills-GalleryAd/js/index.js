var fallbackController;

let galleryIem = document.getElementById("galleryItem").innerHTML;
let galleryObject;

function orientaionChanged() {

}



function onProductChanged(e) {
    trackGalleryItem(e);
}


function showBanner() {

    TweenMax.set("#scrolling-container", { opacity: 0 });
    TweenMax.to("#scrolling-container", 1, { opacity: 1 });


    TweenMax.set(".left-arrow", { opacity: 0, left: 150 });
    TweenMax.to(".left-arrow", 1, { opacity: 1, left: 5 });

    TweenMax.set(".right-arrow", { opacity: 0, right: 150 });
    TweenMax.to(".right-arrow", 1, { opacity: 1, right: 5 });

    TweenMax.to("#text" , 1, {scaleX:1.2, scaleY:1.2, repeat:27, yoyo:true});
}
function findDealerByZip(data,zip){
			
    var elem2=0;
    if (userZip) {
    x = data;
    for (i = 0; i < x.length; i++) {
        zipCode = x[i].zip;
        //userZip = userZip.toLowerCase();
        
        if (zipCode == userZip) {
            elem2 = i;
            console.log(elem2);
        }
    }
    if (elem2 == 0 ) {
        elems = new Array();
        j= 0;   
        for (i = 0; i < x.length; i++) {
            zipCode = x[i].zip;
            zipCode = zipCode.toString();
            userZip = userZip.toString();
            //userZip = userZip.toLowerCase();
                    //console.log('zipCode: ', zipCode); 
            if (zipCode.substring(0, 5) == userZip.substring(0, 5)) {
                elems[j] = i;j++;	
                elem2 = elems[Math.floor(Math.random() * j)];
            }
        }
    }
    if (elem2 == 0 ) {
        elems = new Array();
        j= 0;   
        for (i = 0; i < x.length; i++) {
            zipCode = x[i].zip;
            zipCode = zipCode.toString();
            userZip = userZip.toString();
            //userZip = userZip.toLowerCase();
                    //console.log('zipCode: ', zipCode); 
            if (zipCode.substring(0, 4) == userZip.substring(0, 4)) {
                elems[j] = i;j++;	
                elem2 = elems[Math.floor(Math.random() * j)];
            }
        }
    }
    if (elem2 == 0 ) {
        elems = new Array();
        j= 0;   
        for (i = 0; i < x.length; i++) {
            zipCode  = x[i].zip;
            //userZip = userZip.toLowerCase();
            zipCode = zipCode.toString();
            userZip = userZip.toString();
                    
            if (zipCode.substring(0, 3) == userZip.substring(0, 3)) {
                elems[j] = i;j++;	
                elem2 = elems[Math.floor(Math.random() * j)];
                
            }
        }
    } 
        if (elem2 == 0 ) {
        elems = new Array();
        j= 0;   
        for (i = 0; i < x.length; i++) {
            zipCode = x[i].zip;
            //userZip = userZip.toLowerCase();
            zipCode = zipCode.toString();
            userZip = userZip.toString();
                     
            if (zipCode.substring(0, 2) == userZip.substring(0, 2)) {
                elems[j] = i;j++;	
                elem2 = elems[Math.floor(Math.random() * j)];
            }
        }
    }
        if (elem2 == 0 ) {
        elems = new Array();
        j= 0;   
        for (i = 0; i < x.length; i++) {
            zipCode= x[i].zip;
            //userZip = userZip.toLowerCase();
            zipCode = zipCode.toString();
            userZip = userZip.toString();
                     
            if (zipCode.substring(0, 1) == userZip.substring(0, 1)) {
                elems[j] = i;j++;	
                elem2 = elems[Math.floor(Math.random() * j)];
            }
        }
    }
}
console.log(x[elem2]);
return x[elem2];
}

function onZipDataLoaded(shopData){
    shopURL = "https://www.google.com/maps/search/?api=1&query="  + encodeURIComponent(shopData["zip"] + "," + shopData["street"] + "," + shopData["town"]);
    console.log(shopURL);
};

function dealersLoaded(data, value) {
    var shopData=findDealerByZip(data,value);

    //console.log(shopData);
    onZipDataLoaded(shopData);
    return shopData;
}

function loadDealerJson(jsonURL) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonURL, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            var jsondata = JSON.parse(xobj.responseText);
            var shopData = dealersLoaded(jsondata, userZip);

            galleryObject.setData(galleryArray);

        }
    };
    xobj.send(null);

}

function getUrlVars() {
    var e = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (r, a, n) {
        e[a] = n
    });
    return e
}

//This code is placed in init banner 
/*params = getUrlVars();
if (userZip == "") {
    //userZip = "44225";
    //console.log("userZip 2:",userZip)
}*/
urlVars = getUrlVars()
console.log("urlVars: ", urlVars);
if (urlVars.userZip !== undefined) {
    console.log("dealerchanged")
    userZip = urlVars.userZip;
}

loadDealerJson("data/data.json");

function setMobileSize() {
    var banner = document.getElementById("ad-container");
    banner.style.height = window.innerHeight;
}



function onGalleryReady() {
    showBanner()
}
/*function getUrlVars() {
    var e = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (r, a, n) {
        e[a] = n
    });
    return e;
}*/
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


    galleryObject = new productGallery("scrolling-container",
        {
            htmlTemplate: galleryIem,
            onClickItem: onProductClicked,
            onProductChanged: onProductChanged,
            looped: true,
            galleryReady: onGalleryReady,
        }
    );
    //console.log(zipCode);
    //dealer = new DealersObject(shopID,"Store Number",dealerLoaded);
    //loadDealerJson("data/data.json");
    //var vars = getUrlVars();
    //console.log(vars)
   /* new LocationModule("data/data.json", {
        zip: userZip,
        field: "zip",
        onDataReady:onDataReady
    });
*/

}

