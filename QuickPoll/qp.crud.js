var listTitle = "QuickPolls"; var title = "Title"; var App = {}; App.cache = {}; var listName;
var rightField = "<Field Name='Answer' ShowInViewForms='TRUE' DisplayName='Answer' Type='Text'><Default>defaultvalue</Default></Field>";

var qpcrud = (function () {
    var createItemAndList = function (context, qpName, listChoices, theList) {
        context = new SP.ClientContext.get_current();
        var itemCreationInfo = new SP.ListItemCreationInformation(); var newItem = theList.addItem(itemCreationInfo);
        newItem.set_item(title, qpName);
        newItem.update(); context.load(newItem);
        context.executeQueryAsync(function () { qpcrud.createListCRUD(context, qpName, listChoices); });
    };
    var createList = function (ccontext, qpName, listChoices) {
        var listCreationInfo = new SP.ListCreationInformation();
        listName = qpName;
        listCreationInfo.set_title(listName);
        listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
        this.newlist = context.get_web().get_lists().add(listCreationInfo);
        this.qlist = context.get_web().get_lists().getByTitle(listName);
        var rval = document.getElementById("qpRight").value;
        rightField = rightField.replace("defaultvalue", rval);

        var newQs = ["<Field Name='" + qpName + "' StaticName='" + listName + "' DisplayName='" + listName + "' Type='Choice'><CHOICES>" + listChoices + "</CHOICES></Field>", "<Field Name='qpAnswers' ShowInViewForms='TRUE' DisplayName='qpAnswers' Type='Text'></Field>", rightField, true];
        var numberCols = newQs.length; for (var i = 0; i < numberCols; i++) {
            this.newColumns = this.qlist.get_fields().addFieldAsXml(newQs[i], true, SP.AddFieldOptions.defaultValue);
        }
        context.load(this.newColumns);
        context.executeQueryAsync(Function.createDelegate(this, qpcrud.onQPSucceeded), Function.createDelegate(this, qpcrud.onQPFailed));
    };
    var onQPSuccess = function (sender, args) {
        qpcrud.doAllow();
    };
    var onFailed = function (sender, args) {
        qpcrud.doAllow();
    };
    var allow = function () {
        var list = context.get_web().get_lists().getByTitle(listName);
        context.load(list, 'HasUniqueRoleAssignments');
        context.executeQueryAsync(
           function () {
               var hasUniqueAssgns = list.get_hasUniqueRoleAssignments();
               if (!hasUniqueAssgns) {
                   list.breakRoleInheritance(true, true);
                   context.executeQueryAsync(
                      function () {
                          var groupColl = context.get_web().get_siteGroups();
                          context.load(groupColl);
                          context.executeQueryAsync(
                            function () {
                                var list = context.get_web().get_lists().getByTitle(listName);
                                var groupColl = context.get_web().get_siteGroups();
                                var listEnumerator = groupColl.getEnumerator();
                                while (listEnumerator.moveNext()) {
                                    var group = listEnumerator.get_current();
                                    var roleDef = context.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor);
                                    var roleDefBindings = SP.RoleDefinitionBindingCollection.newObject(context);
                                    roleDefBindings.add(roleDef);
                                    list.get_roleAssignments().add(group, roleDefBindings);
                                    list.update();
                                }
                                context.load(list);
                                context.executeQueryAsync(
                                  function () {
                                      qpui.questionCreatedUI();
                                  }, function (sender, args) { alert(args.get_message()); });

                            });

                      },
                      function (sender, args) {
                          alert(args.get_message());
                      }
                   );
               }
           });

    };
    var saveInput = function () {
        var itemTitle = $(qpTitleId).text(); context = new SP.ClientContext.get_current(); this.qlist = context.get_web().get_lists().getByTitle(escape(itemTitle));
        var itemCreationInfo = new SP.ListItemCreationInformation(); var newitem = this.qlist.addItem(itemCreationInfo);
        var itemTitle = $(qpTitleId).text();
        var chosen = $("#qpChoices input[type='radio']:checked").val(); if (chosen != undefined) {
            var fakeanswer = 1; for (var o = 0; o < choiceArr.length; o++) {

                if (chosen === choiceArr[o]) { fakeanswer = 0; }
                App.cache.chosen = chosen;
            } if (fakeanswer === 0) {
                newitem.set_item(title, unescape(itemTitle)); newitem.set_item("qpAnswers", unescape(chosen));

                newitem.update(); qpui.saveAnswerUI(); context.load(newitem); context.executeQueryAsync(function () {
                    qpstat.getStat(itemTitle); var already = util.getProperty("Once"); if (already === "Cookie") {
                        qpcrud.saveC(itemTitle);
                    }
                });
            }
        }
    };
    var deleteItem = function (context, qId) {
        this.list = context.get_web().get_lists().getByTitle(listTitle); 
        this.delItem = this.list.getItemById(qId); this.delItem.deleteObject(); context.executeQueryAsync(function () { });
    };
    var deleteList = function (context, qTitle) {
        
        this.delList = context.get_web().get_lists().getByTitle(unescape(qTitle)); this.delList.deleteObject();
        context.executeQueryAsync(Function.createDelegate(this, qpcrud.onDeleteSucceeded), Function.createDelegate(this, onFail));
    };
    var onDeleteSuccess = function () {
        var sel = document.getElementById("qpSelect").options.length = 0;
    };
    var onDeleteItemSuccess = function () {     
    };
    var saveCoo = function (itemTitle) {
        var exdays = 365; var exdate = new Date(); exdate.setDate(exdate.getDate() + exdays);
        var cValue = escape(itemTitle) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString()); document.cookie = "qpsp" + "=" + cValue;
    };
    var getCoo = function () {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, ""); if (x == "qpsp") { return unescape(y); }
        }
    };
    var newOneResult = function (questionTitle, colChoices) {
        webinfo.add({
            resultTitle: questionTitle,
            resultId: 0,
            resultChoices: colChoices
        });
        result.add(questionTitle, 0,colChoices);
    };
    return{
        createItemAndListCRUD: createItemAndList,
        createListCRUD: createList,
        onQPSucceeded: onQPSuccess,
        onQPFailed: onFailed,
        doAllow: allow,
        saveAnswer: saveInput,
        deleteItemCRUD: deleteItem,
        deleteListCRUD: deleteList,
        onDeleteSucceeded: onDeleteSuccess,
        onDeleteItemSucceeded: onDeleteItemSuccess,
        saveC: saveCoo,
        getC: getCoo,
        addOneToResults: newOneResult
    };
})();

