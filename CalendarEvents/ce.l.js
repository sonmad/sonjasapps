$(document).ready(function () { launch(); }); var loc = location.href;
function launch() {
    loc=loc.toLocaleLowerCase();
    switch(loc) {
        case loc.indexOf('display.aspx') > -1:
            addjsref("../../Scripts/ce.display.min.js");
            addjsref("../../Scripts/ce.query.min.js");
            addjsref("https://az836959.vo.msecnd.net/cdn/SONJASAPPS/s.util.min.js");
            break;
        case loc.indexOf('edit.aspx') > -1:
            addjsref("../../Scripts/ce.event.min.js");
            addjsref("https://az836959.vo.msecnd.net/cdn/SONJASAPPS/s.util.min.js");
            break;
        case loc.indexOf('new.aspx') > -1:
            addjsref("../../Scripts/ce.event.min.js");
            addjsref("https://az836959.vo.msecnd.net/cdn/SONJASAPPS/s.util.min.js");
            break;
    }
}
function addjsref(src) {
    var jsref = document.createElement('script')
    jsref.setAttribute("type", "text/javascript")
    jsref.setAttribute("src", src)
    document.getElementsByTagName("head")[0].appendChild(jsref);
}