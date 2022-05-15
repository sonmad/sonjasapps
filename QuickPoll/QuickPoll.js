var choiceArr = []; var context; var web; var user; var listChoices; var listTitle = "QuickPolls"; var question; var lastQuestion; var title = "Title"; var qpTitleId = "#qpTitle"; var App = {}; App.cache = {};
var qProperty; var userInput = "Answer the quick poll, please.";
$(document).ready(function () { quickpoll.onLoad(); });

var quickpoll = (function () {
    var qp_onLoad = function () {
        $("#OKbtn").click(function () {
            qpcrud.saveAnswer();
        });
        awatch.onl();
        awatch.onch();
        var ccss = util.getProperty("CustomCSS");
        if (ccss !== undefined) { document.getElementById("qpccss").href = ccss; }
        quickpoll.displayQuestion();
        qpui.manageStatControlsUI("hide");
    };
    var getQuestionToDisplay = function () {
        qpui.setPieSize();
        qProperty = escape(qpf.getsProperty("Question")); context = new SP.ClientContext.get_current();
        if (qProperty === "undefined") {
            $("#OKbtn").hide(); this.last = qpquery.getQuestionQuery(context);
            context.load(this.last, 'Include(Title)');
            context.executeQueryAsync(Function.createDelegate(this, displayLastQ), Function.createDelegate(this, util.onFailed));
        } else {
            var already = util.getProperty("Once"); var exists = "";
            var lastQuestion = qProperty.replace("%253F", "%3F");
            switch (already) {
                case "Cookie":
                    exists = qpcrud.getC();
                    if (exists != undefined && exists === unescape(lastQuestion)) { $("#OKbtn").hide(); qpstat.getStat(lastQuestion); }
                    if (exists != unescape(lastQuestion)) { exists = ""; } if (exists === "") { quickpoll.getTheQuickPoll(lastQuestion); }
                    break;
                case "User":
                    checkUser(lastQuestion);
                    break;
                case "Unlimited":
                    getTheQuickPoll(lastQuestion);
                   
            }
            
        }
    };
    var displayLastQ = function (sender, args) {
        var noQPs = this.last.get_count(); if (noQPs > 0) {
            var lastItem = this.last.getEnumerator(); var resultStr = "";
            while (lastItem.moveNext()) { var item = lastItem.get_current(); lastQuestion = item.get_item(title); }
            var already = util.getProperty("Once"); var exists = "";
            switch (already) {
                case "Cookie":
                    exists = qpcrud.getC();
                    if (exists != undefined && exists === unescape(lastQuestion)) {
                        $("#OKbtn").hide();
                        qpstat.getStat(unescape(lastQuestion));
                    }
                    if (exists != unescape(lastQuestion)) { exists = ""; } if (exists === "") {
                        quickpoll.showTheQuickPoll(lastQuestion);
                    }
                    break;
                case "User":
                    qpquery.checkUser(lastQuestion);
                    break;
                case "Unlimited":
                    quickpoll.showTheQuickPoll(lastQuestion);
            }
           
        } else { qpui.NoQPsYetUI(); }
    };
    var getCurrentUser = function () {
        context = new SP.ClientContext.get_current();
        var user = context.get_web().get_currentUser(); context.load(user); context.executeQueryAsync(function () {
            var user = context.get_web().get_currentUser(); var currentuser = user.get_title();
            App.cache.currentuser = currentuser;
        });
    };
    var getTheQuickPoll = function () {
        this.qList = context.get_web().get_lists().getByTitle(lastQuestion);
        this.fieldCol = this.qList.get_fields();
        context.load(this.fieldCol); context.executeQueryAsync(function () {
            this.qList = context.get_web().get_lists().getByTitle(lastQuestion);
            this.fieldCol = this.qList.get_fields(); var fieldEnumerator = this.fieldCol.getEnumerator();
            var field = null; var lastQ = null;
            while (fieldEnumerator.moveNext()) {
                field = fieldEnumerator.get_current();
                if (field.get_typeAsString() === "Choice") { lastQ = field; }
            } if (lastQ !== null) {
                question = lastQ.get_title(); question = unescape(question);
                var choiceCol = context.castTo(lastQ, SP.FieldChoice); context.load(choiceCol);
                var questionTitle=unescape(lastQ.get_title());
                context.executeQueryAsync(function () {
                    var colChoices = choiceCol.get_choices();
                    var colStr = "<h2><div id='qpTitle'>" + questionTitle + "</div></h2>";
                    for (var y in colChoices) {
                        var checked = ""; if (y === 0) { checked = "checked"; }
                        if (colChoices[y] !== "undefined") {
                            choiceArr[y] = escape(colChoices[y]); var str1 = "<div class='displaytable'><div class='displaycell'>"; var str2 = "</div><div class='displaycell'>";
                            var str3 = "</div></div>";
                            if (navigator.appVersion.indexOf('MSIE 8') > -1 || navigator.appVersion.indexOf('MSIE 7') > -1) { str1 = ""; str2 = ""; str3 = "<br />"; }
                            colStr += str1 + "<input id='qpch" + y + "' type='radio' value='" + escape(colChoices[y]) + "' name='qpch' />" + str2 + colChoices[y] + str3;
                        }
                    } var radiolist = document.getElementById("qpChoices"); radiolist.innerHTML = colStr; var btnValue = qpf.getsProperty("Btn");
                    if (btnValue != "OK" && btnValue != "" && btnValue != "undefined") { $("#OKbtn").prop("value", btnValue); } $("#OKbtn").show();
                    util.resize();
                });
            }
        });
    };
    return {
        onLoad: qp_onLoad,
        displayQuestion: getQuestionToDisplay,
        onSucceededLastQ: displayLastQ,
        getUser: getCurrentUser,
        showTheQuickPoll: getTheQuickPoll
    };
})();
