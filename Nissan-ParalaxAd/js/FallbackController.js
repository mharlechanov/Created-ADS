function FallbackController(banner, fallback, initObj){
    var bannerContainer = document.getElementById(banner);
    var fallbackContainer = document.getElementById(fallback);
    var ratio = 1;
    if(initObj && initObj.ratio){
        ratio = initObj.ratio;
    }

    this.isLandscape = false;
    var self = this;

    function fresize() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var k = w/h;
        var oldLand  = self.isLandscape;
        if(k>ratio){
            self.isLandscape = true;
            bannerContainer.style.display = "none";
            fallbackContainer.style.display = "block";
        }else{
            self.isLandscape = false;
            bannerContainer.style.display = "block";
            fallbackContainer.style.display = "none";
        }

      //  console.log("fallback call" , bannerContainer.style.display, fallbackContainer.style.display)
        if(self.isLandscape !== oldLand){
            if(initObj && initObj.orientaionCallback){
                initObj.orientaionCallback();
            }

        }
    }

    this.init = function(){
        window.addEventListener("resize",fresize);
        fresize();
    }

}
