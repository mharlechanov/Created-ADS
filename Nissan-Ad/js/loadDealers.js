function DealersObject (defaultDealerId,idKey, onLoadCallback){
    var urlVars;
    var dealerID = defaultDealerId;

    var r;
    var c_json;

    init();

    function getUrlVars() {
        var e = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (r, a, n) {
            e[a] = n
        });
        return e
    }

    function init(){
        urlVars = getUrlVars()
        console.log("urlVars: ", urlVars);
        if (urlVars.dealerid !== undefined) {
            console.log("dealerchanged")
            dealerID = urlVars.dealerid;
        }
        r = new XMLHttpRequest();
        r.addEventListener("load", jsonLoaded);
        r.open("GET", "dealers.json", true);
        r.responseType = 'text';
        r.send();

    }

    function jsonLoaded(e) {
        var data = e.currentTarget.response;
        c_json = JSON.parse(data);
        var dealerObj;
        for(var i=0;i<c_json.length;i++){
            if(c_json[i][idKey] === dealerID){
                dealerObj = c_json[i];
                break;
            }
        }
        if(!dealerObj){
            dealerObj = c_json[Math.floor(Math.random(c_json.length))];
        }
        if (onLoadCallback) {
            onLoadCallback(dealerObj);
        }
    }


}









