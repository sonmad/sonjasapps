var context; var listChoices; var listTitle = "QuickPolls"; var App = {}; App.cache = {}; var title = "Title";
$(document).ready(function () { qpcoreapp.launch(); });

var qpcoreapp = (function () {
    var launchPage = function () {
        qpcoreapp.displayCurrentQuestion(); qpui.showFormUI('New'); util.setWhats();
        qpcoreapp.getCurrentUser();
        $("#btnNew").click(function () { qpui.showFormUI('New'); });
        $("#btnDelete").click(function () { qpui.showFormUI('Delete'); });
        $("#btnView").click(function () { qpui.showFormUI('Stat'); });
        $("#CreatePoll").click(function () {
            qpcoreapp.createQuestion($get('qpName').value, $get('qpChoices').value);
        });
        $("#qpDeleteBtn").click(function () {
            qpcoreapp.deleteQuestion();
        });
        astat.watch("awatch");
    };
    var currentQ = function () {
        context = new SP.ClientContext.get_current(); this.last = qpquery.currentQuestionQuery(context);
        context.load(this.last, 'Include(Title)');
        context.executeQueryAsync(Function.createDelegate(this, qpcoreapp.onSucceededCurrentQ), Function.createDelegate(this, util.onFail));
    };
    var currentQSuccess = function (sender, args) {
        var lq = ""; var lastItem = this.last.getEnumerator(); var noqps = this.last.get_count();
        if (noqps > 0) {
            var resultStr = "";
            while (lastItem.moveNext()) {
                var item = lastItem.get_current(); lq = item.get_item(title);
            }
            qpui.currentQuestionUI(lq);

        } else {
            qpui.noQuestionsUI();
        }
        qpcoreapp.getCurrentUser();
    };
    var delQ = function () {
        context = new SP.ClientContext.get_current(); var dropdown = document.getElementById("qpSelect");
        var selected = dropdown.options[dropdown.selectedIndex].text;
        this.qpDel = qpquery.deleteQuestionQuery(context, selected);
        context.load(this.qpDel, 'Include(Title,ID)');
        context.executeQueryAsync(Function.createDelegate(this, qpcoreapp.onDeleteItemFound), Function.createDelegate(this, onFail));
    };
    var delFound = function (sender, args) {
        var questionToDel = this.qpDel.getEnumerator(); var delItem; var qId; var qTitle;
        var founddq = this.qpDel.get_count();
        while (questionToDel.moveNext()) {
            var li = questionToDel.get_current(); qId = li.get_item("ID");
            qTitle = li.get_item(title);
            if (qId !== undefined) {
                qpcrud.deleteItemCRUD(context, qId);
                qpcrud.deleteListCRUD(context, qTitle);
                qpui.updateInterfaceUI();
            }
        }
       
    };
    var itemsToDelete = function () {
        context = new SP.ClientContext.get_current(); this.qps = qpquery.getAllQuestionsDDQuery(context);
        context.load(this.qps, 'Include(Title)');
        context.executeQueryAsync(Function.createDelegate(this, qpcoreapp.onSucceededFillDD), Function.createDelegate(this, util.onFail));
    };
    var fillDDSuccess = function (sender, args) {
        var noQPs = this.qps.get_count(); if (noQPs > 0) {
            var qpsEnum = this.qps.getEnumerator();
            var dropdown = document.getElementById("qpSelect"); var i = 0; while (qpsEnum.moveNext()) {
                var quickpoll = qpsEnum.get_current(); var option = new Option; var str = unescape(quickpoll.get_item(title));
                option.text = str; option.value = str; dropdown.options[i] = option; i += 1;
            }
        }
        else { qpui.NoDeleteUI(); }
    };
    var ifExists = function (context, qpName) {
        this.found = qpquery.getQuestionsQuery(context, qpName);
        context.load(this.found, 'Include(Title)');
        context.executeQueryAsync(Function.createDelegate(this, qpcoreapp.onSQ), Function.createDelegate(this, util.onFail));
    };
    var successQuestion = function (sender, args) {
        var QPs = this.found.get_count(); if (QPs === 0) { qpcoreapp.createQ(); }
        else { qpui.noNewExistsUI(); }
    };
    var addQ = function (qpName, qpChoices) {
        if (qpName !== "" && qpChoices !== "") {
            var alreadyE = qpcoreapp.checkIfExists(context, qpName);
        }
        else { alert(res.qpAlertEnter()); }
    };
    var cQ = function () {
        var qpName = $("#qpName").val(); var qpChoices = $("#qpChoices").val();

        context = new SP.ClientContext.get_current();
        var div = document.getElementById("qp");
        if (navigator.userAgent.indexOf("Firefox") != -1) {

            div.textContent = qpChoices;
            qpChoices = div.innerHTML;
            qpChoices = qpChoices.replace(/(\r\n|\n|\r)/gm, "<br>");
            if (qpChoices.substring(qpChoices.length - 2) !== "\n") { qpChoices += "<br>"; }
        } else {
            div.innerText = qpChoices; qpChoices = div.innerHTML;
            if (qpChoices.substring(qpChoices.length - 1) !== ">") { qpChoices += "<br>"; }
        } var choices = qpChoices.split("<br>"); var countChoices = "";
        listChoices = "";
        for (var i = 0; i < choices.length - 1; i++) {
            if (choices[i] !== "") { listChoices += "<CHOICE>" + choices[i] + "</CHOICE>"; countChoices += 0 + ","; }
        } qpName = escape(qpName); this.theList = context.get_web().get_lists().getByTitle(listTitle);
        listChoices = listChoices.replace("undefined", "");
        qpcrud.createItemAndListCRUD(context, qpName, listChoices, this.theList);
    };
    var getUser = function () {
        web = context.get_web();
        this.currentUser = web.get_currentUser();
        context.load(this.currentUser);
        context.load(web, 'EffectiveBasePermissions');
        context.executeQueryAsync(Function.createDelegate(this, qpcoreapp.onGotUser), Function.createDelegate(this, util.onFail));
    };
    var userSuccess = function (sender, args) {
        if (web.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb)) {
            App.cache.manage = "Yes";
        } else {
            var message = res.ManageLists();
            $("#qpcntrls").html(message);
        }
    };
    return{
        launch: launchPage,
        displayCurrentQuestion: currentQ,
        onSucceededCurrentQ: currentQSuccess,
        deleteQuestion: delQ,
        onDeleteItemFound: delFound,
        fillDelDropDown: itemsToDelete,
        onSucceededFillDD: fillDDSuccess,
        checkIfExists: ifExists,
        onSQ: successQuestion,
        createQuestion: addQ,
        createQ: cQ,
        getCurrentUser: getUser,
        onGotUser:userSuccess
    };
})();

function onFail(sender, args) {
    //console.info("error: " + args.get_message());
}








	
