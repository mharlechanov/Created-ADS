var orientationController;
function orientaionChanged(e){

}
function findDealerByZip(data,zip,field){
	
    var elem2=0;
    if (dealerid) {
	x = data;
	for (i = 0; i < x.length; i++) {
		zipCode = x[i].zip;
		//dealerid = dealerid.toLowerCase();
		
		if (zipCode == dealerid) {
			elem2 = i;
		}
	}
	if (elem2 == 0 ) {
		elems = new Array();
		j= 0;   
		for (i = 0; i < x.length; i++) {
            zipCode = x[i].zip;
            zipCode = zipCode.toString();
            dealerid = dealerid.toString();
			//dealerid = dealerid.toLowerCase();
					//console.log('zipCode: ', zipCode); 
			if (zipCode.substring(0, 5) == dealerid.substring(0, 5)) {
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
            dealerid = dealerid.toString();
			//dealerid = dealerid.toLowerCase();
					//console.log('zipCode: ', zipCode); 
			if (zipCode.substring(0, 4) == dealerid.substring(0, 4)) {
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
            //dealerid = dealerid.toLowerCase();
            zipCode = zipCode.toString();
            dealerid = dealerid.toString();
					
			if (zipCode.substring(0, 3) == dealerid.substring(0, 3)) {
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
            //dealerid = dealerid.toLowerCase();
            zipCode = zipCode.toString();
            dealerid = dealerid.toString();
					 
			if (zipCode.substring(0, 2) == dealerid.substring(0, 2)) {
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
            //dealerid = dealerid.toLowerCase();
            zipCode = zipCode.toString();
            dealerid = dealerid.toString();
					 
			if (zipCode.substring(0, 1) == dealerid.substring(0, 1)) {
				elems[j] = i;j++;	
				elem2 = elems[Math.floor(Math.random() * j)];
			}
		}
	}
}
return x[elem2];
}
function setMobileSize() {
    var banner = document.getElementById("ad-container");
    //console.log(banner.style);
    banner.style.height = window.innerHeight;
}


function dealersLoaded(data,value){
	var shopData=findDealerByZip(data,value,"zip");
	//console.log(obj);
    document.querySelector("#dealer-name").innerHTML = shopData["Firmierung"];
    document.querySelector("#dealer-address").innerHTML = shopData["Straße"] + "<br>"+shopData["zip"] + " " + shopData["Ort"]
	//document.querySelector("#dealer-price").innerHTML = obj["Prämie"];
    //setUrlRromDealer(obj["URL"]);
	onZipDataLoaded(shopData);
	console.log(shopData);
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

            //galleryObject.setData(galleryArray);

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
function showBanner(){ 
   
	TweenMax.from("#screen01-msg1",0.6,{opacity:0,x:"5%",delay:0.3, ease:Power3.easeOut});	
    TweenMax.from("#screen01-msg2",0.6,{opacity:0,x:"20%",delay:0.4, ease:Power3.easeOut});
	TweenMax.from("#screen01-disclaimer",0.6,{opacity:0,y:"20%",delay:0.4, ease:Power3.easeOut});
	TweenMax.from("#screen01-msg4",0.6,{opacity:0,y:"20%",delay:0.4, ease:Power3.easeOut});
    TweenMax.from("#logo",0.7,{y:"20%", opacity:0, delay:0.5});
	TweenMax.from("#dealer-info",0.7,{x:"20%",opacity:0,delay:0.3});
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
    params = getUrlVars();
    if (params.dealerid) {
        //console.log("dealerid ",params.dealerid)
        dealerid = params.dealerid;

    }

	//console.log(zipCode);
	//if (zipCode){dealerid = zipCode;}

	loadDealerJson(dealersList);
    showBanner();
    //showScreen03();
}