var listTitle = "Calendar"; var displayEventsQuery = '<View><Query><Where><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Now /></Value></DateRangesOverlap></Where><OrderBy><FieldRef Name="EventDate" Ascending="TRUE"/></OrderBy></Query><RowLimit>6</RowLimit></View>'; var findSignUpQuery = '<View><Query><Where><Eq><FieldRef Name="SignUp" /><Value Type="Text">list</Value></Eq></Where></Query></View>';
var checkUserQuery = '<View><Query><Where><Eq><FieldRef Name="Author" /><Value Type="Integer"><UserID/></Value></Eq></Where></Query></View>';
var displayTodayQuery = '<View><Query><Where><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Today /></Value></DateRangesOverlap></Where><OrderBy><FieldRef Name="EventDate" Ascending="TRUE"/></OrderBy></Query><RowLimit>6</RowLimit></View>'; 
var displayMyQuery = '<View><Query><Where><And><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Now /></Value></DateRangesOverlap><IsNotNull><FieldRef Name="SignUp" /></IsNotNull></And></Where><OrderBy><FieldRef Name="EventDate" Ascending="TRUE"/></OrderBy></Query><RowLimit>6</RowLimit></View>';
var AllUsersQuery = '<View><Query><OrderBy><FieldRef Name="Title" Ascending="TRUE"/></OrderBy></Query></View>';
var currentQuery = '<View><Query><Where><DateRangesOverlap><FieldRef Name="EventDate" /><FieldRef Name="EndDate" /><FieldRef Name="RecurrenceID" /><Value Type="DateTime"><Now /></Value></DateRangesOverlap></Where><OrderBy><FieldRef Name="EventDate" Ascending="TRUE"/></OrderBy></Query></View>';
var context;

var cequery = (function () {
    var getCeEvents = function (context) {
        this.clist = context.get_web().get_lists().getByTitle(listTitle); var query = new SP.CamlQuery();
        query.set_viewXml(currentQuery); cevents = this.clist.getItems(query); return cevents;
    };
    var getToDisplay = function (context) {
        var appview = util.getProperty("View"); var getQuery = ""; var rowlimit = util.getProperty("ItemNumber");
        if (rowlimit === undefined) { rowlimit = 6; } if (appview === "Default" || appview === "Pictures" || appview==="Tile") {
            getQuery = displayEventsQuery.replace("<RowLimit>6</RowLimit>", "<RowLimit>" + rowlimit + "</RowLimit>");
        }
        else if (appview === "Today") {
            getQuery = displayTodayQuery.replace("<RowLimit>6</RowLimit>", "<RowLimit>" + rowlimit + "</RowLimit>");
        }
        this.list = context.get_web().get_lists().getByTitle(listTitle); var query = new SP.CamlQuery();
        query.set_viewXml(getQuery); events = this.list.getItems(query); return events;
    };
    var bySignUp = function (context, listurl) {
        this.list = context.get_web().get_lists().getByTitle(listTitle); var query = new SP.CamlQuery();
        var findQuery = findSignUpQuery.replace("list", listurl);
        query.set_viewXml(findQuery); events = this.list.getItems(query); return events;
    };
    var checkAlready = function (context, signupliste) {
        this.flist = cequery.boble(signupliste);
        var query = new SP.CamlQuery(); query.set_viewXml(checkUserQuery);
        fitems = this.flist.getItems(query); return fitems;
    };
    var attdees = function (context, io) {
        this.alist = cequery.boble(io); var query = new SP.CamlQuery(); query.set_viewXml(AllUsersQuery);
        aitems = this.alist.getItems(query); return aitems;
    };
    var getListBy = function (signupliste) {
        var g = signupliste.split('-');
        if (g.length > 4) {
            this.sulist = context.get_web().get_lists().getById(signupliste);
        } else {
            this.sulist = context.get_web().get_lists().getByTitle(signupliste);
        }
        return this.sulist;
    };
    var onAlready = function (sender, args) {
        var noItemsFound = already.get_count();
        var idx = "link_";
        if (App.cache.expanded) {
            idx = "linkx_";
        }
        var slink = document.getElementById(idx + App.cache.eSignUpTitle);
       
        if (noItemsFound > 0) {
            ceui.doCancelLink(slink, App.cache.eSignUpTitle);
        } else {
            ceui.doSignLink(slink, App.cache.eSignUpTitle);
        }
    };
    var getParticipants = function (io) {
        App.cache.io = io;
        context = new SP.ClientContext.get_current(); people = cequery.getAttendees(context, io); context.load(people, 'Include(Title)');
        context.executeQueryAsync(cequery.onPeopleSuccess, util.onFail);
    };
    var onPeople = function (sender, args) {
        var noPeopleFound = people.get_count();
        if (noPeopleFound > 0) {
            ceui.showThem(App.cache.io, people);
        } else {
            document.getElementById("att_" + App.cache.io).innerHTML = res.First();
        }
    };
    var getParticipantsx = function (io) {
        App.cache.io = io;
        context = new SP.ClientContext.get_current(); people = cequery.getAttendees(context, io); context.load(people, 'Include(Title)');
        context.executeQueryAsync(cequery.onPeopleSuccessx, util.onFail);
    };
    var onPeoplex = function (sender, args) {
        var noPeopleFound = people.get_count();
        if (noPeopleFound > 0) {
            ceui.showThemx(App.cache.io, people);
        } else {
            document.getElementById("attx_" + App.cache.io).innerHTML = res.First();
        }
    };
    return{
        getCurrent: getCeEvents,
        getEvents: getToDisplay,
        findListBySignUp: bySignUp,
        findAlready: checkAlready,
        onFindAlreadySignUpSuccess: onAlready,
        getAttendees: attdees,
        getPeople: getParticipants,
        onPeopleSuccess: onPeople,
        getPeoplex: getParticipantsx,
        onPeopleSuccessx: onPeoplex,
        boble:getListBy
    };
})();

