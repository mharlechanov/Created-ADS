function CustomPlayer(domObjId, initObj){
    var videoDOM ;
    var container = document.getElementById(domObjId);
    var vastUrl =  initObj.contentURL;
    var player = new VASTPlayer(container, {tracking: {clickpush: true}});

    var playing = false;
    var paused = false;
    this.percent = 0;
    var self = this;

    /* not working !!!
    player.once('AdStopped', function() {
        console.log("video finished!!");
        if(initObj.videoFinishedCallback){
            initObj.videoFinishedCallback();
        }
    });*/
    function loadContent(){
        player.load(
            vastUrl
        ).then( function startAd() {
            if(initObj.videoReadyCallback){
                initObj.videoReadyCallback();
            }
            videoDOM = container.querySelector("video");
            videoDOM.addEventListener("timeupdate",progress);
            playing = true;
            if( paused ){
                self.pause();
            }
            return player.startAd();

        }).catch(function(reason) {
            setTimeout(function() { throw reason; }, 0);
        });
    }


    this.pause = function () {
        paused = true;
        if(videoDOM){
            videoDOM.pause();
        }
    };

    this.resume = function(){
        paused = false;
        if(videoDOM){
            videoDOM.play();
        }

    };

    this.replay = function(){
        if(videoDOM){
            playing = true;
            videoDOM.play();
        }
    }
    this.isPlaying = function(){
        return playing;
    }

    function progress(e){
        var pos = videoDOM.currentTime;
        var duration = videoDOM.duration;
        var prc = pos/duration;
        self.percent = prc*100;
        if(playing && prc === 1){
            //----video played----------
            if(initObj.videoFinishedCallback){
                initObj.videoFinishedCallback();
            }
            playing = false;
        }

        if(initObj && initObj.videoProgressCallbak){
            initObj.videoProgressCallbak(prc);
        }


    }
   // console.log(player);
    loadContent();

}