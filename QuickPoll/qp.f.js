var qpf = (function () {
    var getProp = function (pName) {
        var url = location.href;
        if (url.indexOf(pName + "=") > -1 && url.indexOf(pName + "=&") === -1) {
            link = ""; link = url.substring(url.indexOf(pName + "="));
            link = link.replace(pName + "=", ""); var linkL = link.split('&'); link = linkL[0]; return decodeURI(link);
        }
    };
    var saveHold = function (question) {
        $("#qpHold").html(question);
    };
    var getQProps = function () {
        return unescape($("#qpHold").html());
    };
    return {
        getsProperty: getProp,
        saveVarProps: saveHold,
        getQuestionProps:getQProps
    };
})();

