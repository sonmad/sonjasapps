var listTitle = "QuickPolls"; var App = {}; App.cache = {}; var displayQuestionQuery = '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>'; var qpAnswersQuery = '<View><Query><OrderBy><FieldRef Name="qpAnswers" Ascending="FALSE" /></OrderBy></Query></View>'; var qpQuestionsQuery = '<View><Query><OrderBy><FieldRef Name="ID" Ascending="TRUE"/></OrderBy></Query></View>'; var listAllQuestionsQuery = '<View><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE"/></OrderBy></Query></View>'; var checkQuestionsQuery = '<View><Query><Where><Eq><FieldRef Name="Title" /><Value Type="Text">qpname</Value></Eq></Where></Query></View>'; var checkUserQuery = '<View><Query><Where><Eq><FieldRef Name="Author" /><Value Type="Integer"><UserID/></Value></Eq></Where></Query></View>';

var qpquery = (function () {
    var qCurrentQ = function (context) {
        this.list = context.get_web().get_lists().getByTitle(listTitle); var listQuery = new SP.CamlQuery();
        listQuery.set_viewXml(displayQuestionQuery);
        return this.list.getItems(listQuery);
    };
    var ddQuery = function (context) {
        this.list = context.get_web().get_lists().getByTitle(listTitle); var listQuery = new SP.CamlQuery();
        listQuery.set_viewXml(listAllQuestionsQuery); return this.list.getItems(listQuery);
    };
    var queryDeleteQ = function (context, selected) {
        this.delList = context.get_web().get_lists().getByTitle(listTitle);
        var listQuery = new SP.CamlQuery();
        listQuery.set_viewXml('<View><Query><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' + escape(selected) + '</Value></Eq></Where></Query></View>');
        return this.delList.getItems(listQuery);
    };
    var queryQ = function (context) {
        this.list = context.get_web().get_lists().getByTitle(listTitle);
        var listQuery = new SP.CamlQuery(); listQuery.set_viewXml(displayQuestionQuery);
        return this.list.getItems(listQuery);
    };
    var queryA = function (context, question) {
        this.currentList = context.get_web().get_lists().getByTitle(escape(question));
        var caml = new SP.CamlQuery(); caml.set_viewXml(qpAnswersQuery);
        return this.currentList.getItems(caml);
    };
    var queryAllStat = function (context) {
        this.list = context.get_web().get_lists().getByTitle(listTitle);
        var listQuery = new SP.CamlQuery(); listQuery.set_viewXml(qpQuestionsQuery);
        return this.last = this.list.getItems(listQuery);
    };
    var queryDisplayStat = function (context, question) {
        this.list = context.get_web().get_lists().getByTitle(question);
        var caml = new SP.CamlQuery(); caml.set_viewXml(qpAnswersQuery);
        return this.list.getItems(caml);
    };
    var queryQs = function (context, question) {
        this.list = context.get_web().get_lists().getByTitle(listTitle);
        var listQuery = new SP.CamlQuery(); checkQuestionsQuery = checkQuestionsQuery.replace("qpname", unescape(question));
        listQuery.set_viewXml(checkQuestionsQuery); checkQuestionsQuery = checkQuestionsQuery.replace(unescape(question), "qpname");
        return this.list.getItems(listQuery);
    };
    var userCheck = function (lastQuestion) {
        App.cache.lq = lastQuestion;
        this.list = context.get_web().get_lists().getByTitle(lastQuestion);
        var listQuery = new SP.CamlQuery(); listQuery.set_viewXml(checkUserQuery);
        usere = this.list.getItems(listQuery); context.load(usere);
        context.executeQueryAsync(qpquery.onuSuccess, util.onFail);
    };
    var gotUsers = function (sender, args) {
        var noItemsFound = usere.get_count();
        if (noItemsFound > 0) {
            $("#OKbtn").hide();
            qpstat.getStat(unescape(App.cache.lq));
        } else {
            quickpoll.showTheQuickPoll(App.cache.lq);
        }
    };
    return{
        currentQuestionQuery: qCurrentQ,
        getAllQuestionsDDQuery: ddQuery,
        deleteQuestionQuery: queryDeleteQ,
        getQuestionQuery: queryQ,
        getAnswersQuery: queryA,
        getAllStatQuery: queryAllStat,
        displayStatQuery: queryDisplayStat,
        getQuestionsQuery: queryQs,
        checkUser: userCheck,
        onuSuccess:gotUsers
    };
})();
