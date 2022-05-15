var context; var imageField = "<Field Name='Image' StaticName='Image' DisplayName='Image' Type='URL'></Field>"; var cl = vars.lendar();
var limitField = "<Field Name='Limit' StaticName='Limit' DisplayName='Limit' Type='Number'></Field>";
var contactField = "<Field Name='EventContact' DisplayName='Event Contact' Type='UserMulti' Required='FALSE' StaticName='EventContact' List='UserInfo' UserSelectionMode='PeopleOnly'/>";
var appurl; var listid; var settings; var prp = vars.ceProps(); var contentcode = vars.ceContent(); var c = vars.get_class();
var diva = vars.ceDiva(); var t = vars.get_att(); var d = vars.get_div(); var h = vars.get_href(); var hsh = vars.get_hash();
$(document).ready(function () {
    coreapp.doFls(); coreapp.showCurrent();
    coreapp.isAdmin();
    astat.watch("awatch");
});

var coreapp = (function () {
    var current = function () {
        context = new SP.ClientContext.get_current(); events = cequery.getCurrent(context); 
        context.load(events, 'Include(Title,FileRef,EventDate,EndDate,ID,SignUp,SignUpTitle, Limit)');
        context.executeQueryAsync(coreapp.onCollected, util.onFail);
    };
    var collected = function (sender, args) {
        var noEventsFound = events.get_count(); if (noEventsFound > 0) {
            ceui.showAdminView(events);
        } else { ceui.noEvents(); }
    };
    var getLists = function () {
        context = new SP.ClientContext.get_current(); this.lists = context.get_web().get_lists(); context.load(this.lists);
        context.executeQueryAsync(Function.createDelegate(this, coreapp.onQuerySucceeded), Function.createDelegate(this, util.onFail));
    };
    var listItemCount = function () {
        //go thru lists and get id and item count
        this.signuplists = context.get_web().get_lists(); context.load(this.signuplists);
        context.executeQueryAsync(function (sender, args) {
            this.signuplists = context.get_web().get_lists();
            var listEnum = this.signuplists.getEnumerator();
            while (listEnum.moveNext()) {
                var currentList = listEnum.get_current();
                listId = currentList.get_id();
                var clistnumber = currentList.get_itemCount();
                var adminPlace = document.getElementById("list_" + listId);
                if (adminPlace !== null) {
                    adminPlace.innerHTML =  res.ItemCount() + clistnumber;
                }
            }
        }
        );
    };
    var querySuccess = function () {
        var placeholder = document.getElementById(contentcode); placeholder.innerHTML = "";
        document.getElementById("ceCurrentEvents").innerHTML = "";
        var listEnumerator = this.lists.getEnumerator(); var i = 0; while (listEnumerator.moveNext()) {
            var list = listEnumerator.get_current(); listid = list.get_id();
            var listtitle = list.get_title(); var listtype = list.get_baseTemplate(); if (listtype === 100) {
                var count = list.get_itemCount(); var listurl = hsh;
                var listclick = "coreapp.openlist('" + listtitle + "');"; var diva = document.createElement(d);
                diva.setAttribute(c, "listlink");
                placeholder.appendChild(diva); diva.setAttribute("id", i);
                var lista = document.createElement("a"); diva.appendChild(lista); lista.innerHTML = listtitle;
                lista.setAttribute(h, listurl); lista.setAttribute(t, listtitle);
                lista.setAttribute("onclick", listclick); var propdiv = document.createElement(d);
                diva.appendChild(propdiv); propdiv.innerHTML = res.ItemCount() + count + "  ";
                propdiv.setAttribute(c, prp); i += 1;
            }
        }
        if (i === 0) {
            var message = document.createElement(d); placeholder.appendChild(message);
            message.innerHTML = res.NoLists();
        }
    };
    var windowList = function (listTitle) {
        context = new SP.ClientContext.get_current();
        this.list = context.get_web().get_lists().getByTitle(listTitle); var url = this.list.get_rootFolder();
        context.load(url);
        context.executeQueryAsync(function () {
            this.list = context.get_web().get_lists().getByTitle(listTitle);
            var url = this.list.get_rootFolder(); var sUrl = url.get_serverRelativeUrl() + "/AllItems.aspx";
            if (sUrl !== undefined) { window.open(sUrl, "_parent", ""); }
        });
    };
    var deleteSucceeded = function () {
        var message = res.ListDeleted();
        alert(message);
    };
    var flds = function (iex, cex, lex) {
        context = new SP.ClientContext.get_current();
        this.l = context.get_web().get_lists().getByTitle(cl);
        var newQs = "";
        if (!iex) {
            newQs = [imageField, true];
        }

        if (!cex) {
            if (newQs === "") {
                newQs = [contactField, limitField, true];
            }
            else {
                newQs = [imageField, contactField, limitField, true];
            }
        }
        if (!lex && iex === true && cex === true) {
            newQs = [limitField, true];
        }

        if (newQs !== "") {
            var numberCols = newQs.length; for (var i = 0; i < numberCols; i++) {
                this.newColumns = this.l.get_fields().addFieldAsXml(newQs[i], true, SP.AddFieldOptions.defaultValue);
            }

            context.load(this.newColumns); context.executeQueryAsync(function () { });
        }
      
    };
    var addFlds = function () {
        
        context = new SP.ClientContext.get_current();
        this.l = context.get_web().get_lists().getByTitle(cl); var iExists = false; var lExists = false; var cExists = false;
        context.load(this.l); context.executeQueryAsync(function () {
            this.l = context.get_web().get_lists().getByTitle(cl); this.fieldCol = this.l.get_fields();
            context.load(this.fieldCol); context.executeQueryAsync(function () {
                this.l = context.get_web().get_lists().getByTitle(cl);
                this.fieldCol = this.l.get_fields(); var fieldEnumerator = this.fieldCol.getEnumerator();
                while (fieldEnumerator.moveNext()) {
                    var field = fieldEnumerator.get_current(); 
                    var fieldTitle = field.get_title();
                    var fieldId = field.get_id();

                    if (fieldTitle === "Image") {
                        iExists = true;
                       
                    }
                   
                    if (fieldTitle === "Event Contact") {
                        cExists = true;
                       
                    }
                    if (fieldTitle === "Limit") {
                        lExists = true;
                    }
               
                 
                        if (String(fieldId) === "8137f7ad-9170-4c1d-a17b-4ca7f557bc88") {
                            field.set_hidden(true);
                            field.update();
                            //attendees id: 
                            
                        }
                        if (String(fieldId) === "a4e7b3e1-1b0a-4ffa-8426-c94d4cb8cc57") {
                            field.set_hidden(true);
                            field.update();
                            //res id:   
                        }
                        if (String(fieldId) === "393003f9-6ccb-4ea9-9623-704aa4748dec") {
                            field.set_hidden(true);
                            field.update();
                            //free id:  
                        }
                        if (String(fieldId) === "aea1a4dd-0f19-417d-8721-95a1d28762ab") {
                            field.set_hidden(true);
                            field.update();
                            //publ contact id:  
                        }
                        if (String(fieldId) === "d8cd5bcf-3768-4d6c-a8aa-fefa3c793d8d") {
                            //check id: 
                            
                            field.set_hidden(true);
                            field.update();
                            this.l.update();
                            
                            context.load(field); context.executeQueryAsync(function () {
                                
                                if (!cExists) {
                                    coreapp.newFlds(iExists, cExists, lExists);
                                }
                            });
                        }
                    
               
                }
               
            });
        });
    };
    var isAdminTest = function () {
        context = new SP.ClientContext.get_current();
        web = context.get_web();
        this.currentUser = web.get_currentUser();
        context.load(this.currentUser);
        context.load(web, 'EffectiveBasePermissions');
        context.executeQueryAsync(function (sender, args) {
            if (!web.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb)) {
                document.getElementById("ceContent").style.display = "none";
                document.getElementById("ceCurrentEvents").style.display = "none";
                document.getElementById("ceSignUpBlock").style.display = "none";
            }
        });
    };
    return {
        showCurrent: current,
        onCollected: collected,
        showLists: getLists,
        onQuerySucceeded: querySuccess,
        openlist: windowList,
        onDeleteSucceeded: deleteSucceeded,
        doFls: addFlds,
        newFlds: flds,
        isAdmin: isAdminTest,
        doListItemCount: listItemCount
    };
})();

