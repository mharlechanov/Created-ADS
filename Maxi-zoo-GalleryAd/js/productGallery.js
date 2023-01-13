function productGallery(domObject, initObj){
    let jsondata;
    let container = document.getElementById(domObject);

    let scrollingContainer = container.querySelector(".products-scrolling");
    let domItems = [];

    let targetScroll = 0
    let self = this;
    self.scrolling = 0;

    function mresize(e){


        let k = Math.ceil( (targetScroll)/ domItems.length );
        let localscroll =  (-targetScroll + 100000*domItems.length)%domItems.length;

        if(domItems.length){
            for(let i = 0; i < domItems.length; i++){
                //     let di = targetScroll - i;
                let shift = 0;
                if(localscroll == 0 && i === domItems.length-1){
                    shift = -1;
                }else if(localscroll === domItems.length-1 && i === 0){
                    shift = 1;
                }

                domItems[i].style.left = ((-k + shift)* domItems.length + i) * container.clientWidth + "px";

            }
        }

    }
    function checkButtonsState(){
        if(initObj.looped) {
            return;
        }

        if(targetScroll === 0){
            btnLeft.hidden = true;
        }else{
            btnLeft.hidden = false;
        }
        if(targetScroll === -domItems.length+1){
            btnRight.hidden = true;
        }else{
            btnRight.hidden = false;
        }
    }

    var oldLocalScroll = -1;
    function changedItemCallback(e){
        let localscroll = (-targetScroll + 100000 * domItems.length) % domItems.length;
        if(oldLocalScroll !== localscroll){
            oldLocalScroll = localscroll;
            if(initObj.onProductChanged){
                initObj.onProductChanged({type:e,index:localscroll,object:jsondata[localscroll]})
            }

        }

    }
    var scrollBackSpeed =  0.2;
    var scrollGeneralSpeed =  0.5;

    function setTargetScroll(scroll,speed){

        var ds = Math.min(Math.abs(scroll- self.scrolling),1)
        if(speed){
            TweenMax.to(self,speed,{scrolling:scroll});
        }else{
            TweenMax.to(self,scrollGeneralSpeed*ds,{scrolling:scroll});
        }

        targetScroll = scroll;

    }

    function prev(e){
        if(!initObj.looped) {
            if (targetScroll < 0) {

                setTargetScroll(targetScroll+1);
            }else{
                setTargetScroll(targetScroll,scrollBackSpeed);
            }
            checkButtonsState()

        }else{

            setTargetScroll(targetScroll+1);

        }
        changedItemCallback("left")
        mresize();

    }


    function next(e){

        if(!initObj.looped){
            if(targetScroll>-domItems.length+1){
                setTargetScroll(targetScroll-1);
            }else{
                setTargetScroll(targetScroll,scrollBackSpeed);
            }
            checkButtonsState()

        }else{

            setTargetScroll(targetScroll-1);
        }
        changedItemCallback("right");
        mresize();


    }


    function renderScrolling(){
        if( !pressed ){
/*            var dscroll = (targetScroll-scrolling)*scrolling*container.clientWidth;
            console.log(dscroll);
            if(false){//Math.abs(dscroll)<1){
                self.scrolling = targetScroll;
                //scrolling+=(targetScroll- scrolling)*1;
            }else{
                self.scrolling+=(targetScroll-scrolling)*0.15;
            }*/


        }
        scrollingContainer.style.left = self.scrolling*container.clientWidth + "px";

        if(scroller && !initObj.looped){
            const secw = 1/domItems.length*100;
            scroller.style.width = secw+"%";
            scroller.style.left = (-self.scrolling/(domItems.length-1))*(100-secw)/100 * scroller.parentNode.clientWidth + "px";
        }

        if(domItems.length){
            for(let i = 0; i < domItems.length; i++){
                let dom = domItems[i];
                let globalCoord = dom.getBoundingClientRect();
                let paralaxElement = dom.querySelector("img");

                paralaxElement.style.marginLeft = globalCoord.left  + "px";

            }
        }


        requestAnimationFrame(renderScrolling)
    }

    let startX;
    let startY;
    let prevX;
    let pressed = false;
    let startscroll;


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
    function ifDeviceSupprotTouches(){
        return ( 'ontouchstart' in window ) ||
            ( navigator.maxTouchPoints > 0 ) ||
            ( navigator.msMaxTouchPoints > 0 );
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
                    if(e.target.tagName != "IMG") {
                        let localscroll = (-targetScroll + 100000 * domItems.length) % domItems.length;
                        initObj.onClickItem({index:localscroll,object:jsondata[localscroll]})
                    }
                }

                //t.setAttribute(viewURL :dealseventlistingproperties.view_item_url)
            }

            if(Math.abs(dx)>40){
                //swipe
                if(prevX>0){
                    prev();

                }else{
                    next();
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

    let btnLeft;
    let btnRight;
    this.init = function () {
        window.addEventListener("resize", mresize);
        btnLeft = container.querySelector(".left-arrow");
        btnRight = container.querySelector(".right-arrow");
        btnLeft.addEventListener("click", prev);
        btnRight.addEventListener("click", next);
        requestAnimationFrame(renderScrolling);
        initSwipe();
        checkButtonsState();
    };

    function htmlToElements(html) {
        let template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
    var _data;
    function initItems(data){
        _data = data;
        for(let i=0;i<data.length;i++){
            let newItem = initObj.htmlTemplate;

            newItem = newItem.replace(/{{id}}/i, "gi"+i);

            const imageUrl = data[i].imgUrl;
            newItem = newItem.replace(/{{img}}/i, imageUrl);

            const imageUrl2 = data[i].imgUrl2;
            newItem = newItem.replace(/{{img2}}/i, imageUrl2);

            const logo = data[i].logo;
            newItem = newItem.replace(/{{logo}}/i, logo);

            const red = data[i].red;
            newItem = newItem.replace(/{{red}}/i, red);

            const cat = data[i].cat;
            newItem = newItem.replace(/{{cat}}/i, cat);

            const dog = data[i].dog;
            newItem = newItem.replace(/{{dog}}/i, dog);

            const priceImgUrl=data[i].priceImg;
            newItem = newItem.replace(/{{priceImg}}/i, priceImgUrl);

            
            newItem = newItem.replace(/{{right}}/i, data[i].right);
            
            const textImgUrl=data[i].textImg;
            newItem = newItem.replace(/{{textImg}}/i, textImgUrl);

            newItem = newItem.replace(/{{width2}}/i, data[i].width2);
            newItem = newItem.replace(/{{bottom}}/i, data[i].bottom);

            const prodImgUrl=data[i].prodImg;
            newItem = newItem.replace(/{{prodImg}}/i, prodImgUrl);

            newItem = newItem.replace(/{{width}}/i, data[i].width);
            newItem = newItem.replace(/{{right2}}/i, data[i].right2);
            
            let domItem = htmlToElements(newItem);//document.createRange().createContextualFragment(newItem);

            scrollingContainer.appendChild(domItem);

            const t = document.getElementById("gi"+i);
            t.style.left = i * container.clientWidth + "px";
            var object=t;

            object.onclick=function(){
                clickOut(data[i].clickUrl)
            };

            domItems.push(t);
            //t.onclick=next;
            //scrollingContainer
        }

        scrollingContainer.style.opacity = 0;
        scrollingContainer.querySelector("img").onload = showGallery;

        initScrollingIndicator();
        //changedItemCallback("init")
    }

    var showed = false;
    function showGallery(){
        showed = true;
        initScrollingIndicator()
        if(initObj.galleryReady){
            initObj.galleryReady();
        }
        if(killLoader){
            killLoader()
        }
        scrollingContainer.style.opacity = 1;
    }

    let scroller;
    function initScrollingIndicator(){
        scroller = document.getElementById("scroller-indicator");
        if(scroller){
            if(initObj.looped){
                scroller.parentNode.hidden = true;
            }
        }

    }

    this.setData = function(data){
        jsondata = data;
        initItems(jsondata)
    }

    this.loadDataHttp = function(url){
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                jsondata = JSON.parse(xobj.responseText);
                initItems(jsondata)
            }
        };
        xobj.send(null);

    };

    this.init()


}
    
