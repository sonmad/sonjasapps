$(document).ready(function () {
    var e = ExecuteOrDelayUntilScriptLoaded(cestat.launch, "sp.js");
});
var cestat = (function () {
    var launchPage = function () {
        astat.getViews();
        util.setWhats();
    };
    return {
        launch: launchPage
    };
})();