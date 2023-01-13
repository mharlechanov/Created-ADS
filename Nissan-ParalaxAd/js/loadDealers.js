function dealersObject(dealersURL, defaultDealerId, onLoadCallback) {
    var urlVars;
    var dealerID = defaultDealerId;

    var r;
    var c_json;

    init(dealersURL);

    function getUrlVars() {
        var e = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (r, a, n) {
            e[a] = n
        });
        return e
    }

    function init(dealersURL) {
        urlVars = getUrlVars()
        if (urlVars.dealerid) {
            dealerID = urlVars.dealerid;
            console.log(dealerID)
        }
        r = new XMLHttpRequest();
        r.addEventListener("load", jsonLoaded);
        r.open("GET", dealersURL, true);
        r.responseType = 'text';
        r.send();
    }

    function jsonLoaded(e) {
        var data = e.currentTarget.response;
        c_json = JSON.parse(data);
        for (var i = 0; i < c_json.length; i++) {
            if (c_json[i]["Dealer ID"] == dealerID) {
                onLoadCallback(c_json[i]);
                break;
            }
        }
    }


}









