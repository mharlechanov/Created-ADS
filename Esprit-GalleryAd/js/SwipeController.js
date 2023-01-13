function SwipeController(container,initObj){

    var scrollBackSpeed =  0.2;
    var scrollGeneralSpeed =  0.5;
    var oldLocalScroll = -1;
    var self = this;
    self.scrolling = 0;
    initObj = initObj||{};
    var startX;
    var startY;
    var targetScroll;
    var pagesCount = initObj.elementsCount?initObj.elementsCount:2;
    var oldScrollingValue;
    var pressed;

    this.getTargetScroll = function(){
        return -targetScroll;
    }

    this.getLocalScroll = function(){
        var tm = -targetScroll + pagesCount * 100000000;
        return tm - Math.floor(tm/pagesCount)*pagesCount;
    }

    function onEnterFrame(){
        requestAnimationFrame(onEnterFrame);

        if(initObj.onScrollChanged){
            if(oldScrollingValue!= self.scrolling){
                initObj.onScrollChanged.bind(self)();
                oldScrollingValue = self.scrolling;
            }
        }
    }

    function setTargetScroll(scroll,speed){

        var ds = Math.min(Math.abs(scroll- self.scrolling),1)
        if(speed){
            TweenMax.to(self,speed,{scrolling:scroll});
        }else{
            TweenMax.to(self,scrollGeneralSpeed*ds,{scrolling:scroll});
        }

        targetScroll = scroll;

    }

    this.prev = function(e){
        if(!initObj.looped) {
            if (targetScroll < 0) {

                setTargetScroll(targetScroll+1);
                if(initObj.trackSwipe){
                    initObj.trackSwipe(1)
                }
            }else{
                setTargetScroll(targetScroll,scrollBackSpeed);
            }

        }else{
            setTargetScroll(targetScroll+1);
            if(initObj.trackSwipe){
                initObj.trackSwipe(1)
            }

        }

    }


    this.next = function(e){

        if(!initObj.looped){
            if(targetScroll>-pagesCount+1){

                setTargetScroll(targetScroll-1);
                if(initObj.trackSwipe){
                    initObj.trackSwipe(-1)
                }
            }else{
                setTargetScroll(targetScroll,scrollBackSpeed);
            }

        }else{
            setTargetScroll(targetScroll-1);
            if(initObj.trackSwipe){
                initObj.trackSwipe(-1)
            }
        }

    }


    function onDown(e){
        if(e.type.indexOf("touch") === -1){
            if( ifDeviceSupprotTouches()  ){
                return;
            }
        }

        TweenMax.killTweensOf(self);
        const m = getEventCoods(e);
        startX = m.x;
        startY = m.y;
        //console.log(e);
        prevX = m.x;
        pressed = true;
        startscroll = self.scrolling;

    }

    function ifDeviceSupprotTouches(){
        return ( 'ontouchstart' in window ) ||
            ( navigator.maxTouchPoints > 0 ) ||
            ( navigator.msMaxTouchPoints > 0 );
    }

    function onMove(e){
        if(e.type.indexOf("touch") === -1){
            if( ifDeviceSupprotTouches()  ){
                return;
            }
        }
        const m = getEventCoods(e);
        const dx =  m.x - startX;

        if(Math.abs(dx) > 0){
            prevX = dx;
        }
        if(pressed){
            self.scrolling = startscroll + dx/container.clientWidth;
        }
    }

    this.getLocalScroll = function(){
        var localscroll = (-targetScroll + 100000 * pagesCount) % pagesCount;
        return localscroll;
    }

    function onUp(e){
        //  console.log("touch" , ifDeviceSupprotTouches(), e.type);
        if(e.type.indexOf("touch") === -1){
            if( ifDeviceSupprotTouches() ){
                return;
            }
        }
        //console.log("entered")
        const m = getEventCoods(e);
        const dx =  m.x - startX;
        const dy =  m.y - startY;
        const dist = Math.sqrt(dx*dx +  dy*dy);
        if(pressed){
            if(dist < 30) {
                //clicked
                if (initObj.onClickItem) {
                    if(e.target.id != "gallery-cta" && e.target.id != "arrow-right" && e.target.id != "arrow-left" ) {
                        var localscroll = (-targetScroll + 100000 * pagesCount) % pagesCount;
                        initObj.onClickItem({index:localscroll})
                    }
                }

                //t.setAttribute(viewURL :dealseventlistingproperties.view_item_url)
            }

            if(Math.abs(dx)>40){
                //swipe
                if(prevX>0){
                    self.prev();

                }else{
                    self.next();
                }
            }else{
                setTargetScroll(targetScroll,scrollBackSpeed)
            }
        }
        pressed = false;
    }

    function getEventCoods(e){
        var mx,my;

        if(e.type.indexOf("touch") > -1){
            //  console.log("touch event", e)
            mx = e.changedTouches[0].clientX;
            my = e.changedTouches[0].clientY;
            //  console.log(e.type, mx,my);
        }else{
            //  console.log("mouse event", e)
            mx = e.clientX;
            my = e.clientY
        }

        return {x:mx,y:my}
    }
    function initSwipe(){
        //console.log("initSwipe");
        //container.addEventListener("pointerdown", onDown);
        //container.addEventListener("pointermove", onMove);
        //window.addEventListener("pointerup", onUp);

        container.addEventListener( 'mousedown', onDown, false );
        document.addEventListener( 'mousemove', onMove, false );
        document.addEventListener( 'mouseup', onUp, false );
        document.addEventListener( 'mouseoutside', onUp, false );

        container.addEventListener( 'touchstart', onDown, false );
        document.addEventListener( 'touchmove', onMove, false );
        document.addEventListener( 'touchend', onUp, false );

    }

    function init(){
        initSwipe();
        targetScroll = 0;
        requestAnimationFrame(onEnterFrame);
    }

    init()

}