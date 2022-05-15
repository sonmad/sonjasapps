var context; var App = {}; App.cache = {}; $(document).ready(function () {
    corepart.getItems(); corepart.insertCustom(); corepart.hideie8(); awatch.onl();
    awatch.onc();  });

var corepart = (function () {
    var getCEvents = function () {
        context = new SP.ClientContext.get_current(); events = cequery.getEvents(context); context.load(events, 'Include(Title,FileRef,EventDate,Description,EndDate,ID,Image,SignUpTitle,Location,Limit,EventDetails,Event_x0020_Contact)');
        context.executeQueryAsync(corepart.onGetSuccess, corepart.onFails);
    };
    var failAlert = function (sender, args) {
        alert(args.get_message());
    };
    var onGet = function (sender, args) {
        var noEventsFound = events.get_count();
        App.cache.no = noEventsFound / 2;
        if (noEventsFound > 0) { ceui.showEvents(events); } else { ceui.noEventsUI(); }
    };
    var ie8 = function () {
        if (vars.IE8() > -1 || vars.IE7() > -1) {
            document.getElementById("ceNext").innerHTML = "<a href='../Lists/Calendar/calendar.aspx' target='_parent'> <span style='height:24px;width:24px;position:relative;margin-bottom:3px;display:inline-block;overflow:hidden;margin-top:15px;' class='s4-clust ms-designbuilder-navbutton-image'><img src='/_layouts/15/images/spcommon.png?rev=23' alt='More Events' style='position: absolute; left: -152px; top: -56px; border-width: 0px;'></span></a>";
        }
    };
    var customCSS = function () {
        var css = vars.customCSS();
        if (css !== undefined) { document.getElementById("icss").href = css; }
    };
   
    return{
        getItems:getCEvents,
        onFails: failAlert,
        onGetSuccess: onGet,
        hideie8: ie8,
        insertCustom: customCSS
    };
})();

