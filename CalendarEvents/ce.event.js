var context; var web;var url = location.href; var currentitem; url = url.toLowerCase(); var listName; $(document).ready(function () {
    if (url.indexOf("edit.aspx?") > -1) {
        eventview.setSignUp();
    }
    if (url.indexOf("edit.aspx?") >-1 || url.indexOf("new.aspx?") >-1)
    {
        eventview.adminCheck();
        //document.getElementById("ListName").innerHTML = res.ListName();
        //document.getElementById("ceSignUpBtn").value = res.AddSignUpList();
        
        //document.getElementById("part1").style.display = "none";
        
        //document.getElementsByTagName("body")[0].innerHTML += '<script type="text/javascript" src="../../Scripts/bootstrap.min.js"></script>';
        //document.getElementsByTagName("body")[0].innerHTML += ' <link href="../../Content/bootstrap.min.css" rel="stylesheet" />';
        ////https://spfxcloud.azureedge.net/spfxcloud/date/
    }
    if (url.indexOf("new.aspx?") > -1) {
        eventview.newcustom();
    }
});

var eventview =(function () {
    var createList = function () {
        var listName = document.getElementById("ceListName").value; if (listName !== "") { eventview.addList(); }
        else { alert(res.PleaseEnter()); }
    };
    var removeList = function () {
        var ask = confirm(res.ConfirmRemoving()); if (ask === true) { eventview.deleteList(); }
    };
    var deleteSignList = function () {
        context = new SP.ClientContext.get_current(); var listname = $('input[title="Sign Up Title"]').val();
        var h = listname.split('-');
        if (h.length > 4) {
            this.listToDelete = context.get_web().get_lists().getById(listname);
        } else {
            this.listToDelete = context.get_web().get_lists().getByTitle(listname);
        }
        this.listToDelete.deleteObject();
        context.executeQueryAsync(Function.createDelegate(this, eventview.onDeleteSucceeded), Function.createDelegate(this, util.onFail));
    };
    var deleteSuccess = function () {
        $('input[title="Sign Up"]').val(""); $("#ceSignUpLink").html(""); $("#ceListName").val("");
        $('input[title="Sign Up Title"]').val("");
        var btn = document.getElementById("ceSignUpBtn");
        btn.value = res.AddSignUp(); btn.setAttribute("onclick", "eventview.addSignUpList();");
    };
    var deleted = function (sender, args) {
        var listname = document.getElementById("ceListName").value;
        eventview.setID(listname);
        eventview.setPerm(listname);
        eventview.setListUrl(listname);
    };
    var listID = function (ln) {
        var newlist = context.get_web().get_lists().getByTitle(ln);
        context.load(newlist);
        context.executeQueryAsync(
           function () {
               var newlist = context.get_web().get_lists().getByTitle(ln);
               var newlistid = newlist.get_id();
               $('input[title="Sign Up Title"]').val(newlistid);

           });
    };
    var isAdminTest = function () {
        context = new SP.ClientContext.get_current();
        web = context.get_web();
        this.currentUser = web.get_currentUser();
        context.load(this.currentUser);
        context.load(web, 'EffectiveBasePermissions');
        context.executeQueryAsync(function (sender, args) {
            if (web.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb)) {
                var guidance = res.AddSignUpList();
                $("#AddSL").html(guidance);
                
            }else
            {
                var message = res.ManageLists();
                $("#AddSLtd").html(message);
                document.getElementById("ceAdminTable").style.display = "none";
            }
        });
    };
    var allowWrite = function (listname) {
        var list = context.get_web().get_lists().getByTitle(listname);
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
                                    var roleDef = eventview.get_def(context);
                                    var roleDefBindings = eventview.get_bindings(context);
                                    roleDefBindings.add(roleDef);
                                    list.get_roleAssignments().add(group, roleDefBindings);
                                    list.update();
                                }
                                context.load(list);
                                context.executeQueryAsync(
                                  function () {
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
    var writeItem = function () {
        var iId = vars.ID(); context = new SP.ClientContext.get_current();
        this.list = context.get_web().get_lists().getByTitle("Calendar");
        currentitem = this.list.getItemById(iId); context.load(currentitem, 'SignUpTitle');
        context.executeQueryAsync(Function.createDelegate(this, eventview.onGotItem), Function.createDelegate(this, util.onFail));
    };
    var get_roledefinition = function (context) {
        return context.get_web().get_roleDefinitions().getByType(SP.RoleType.contributor);
    };
    var gotItem = function (sender, args) {
        var iId = vars.ID(); this.list = context.get_web().get_lists().getByTitle("Calendar");
        currentitem = this.list.getItemById(iId); var signupliste = currentitem.get_item('SignUpTitle');
        if (signupliste !== null) {
            var h = signupliste.split('-');
            if (h.length > 4) {
                this.listup = context.get_web().get_lists().getById(signupliste); context.load(this.listup);
                context.executeQueryAsync(function () {
                    this.listup = context.get_web().get_lists().getById(signupliste);
                    var listt = this.listup.get_title();
                   eventview.writetitle(listt);
                });
            } else {
                eventview.writetitle(signupliste);
            }
        }
    };
    var writeLinks = function (signupliste) {
        $("#ceSignUpLink").html(res.SignUpList() + signupliste);
        var btn = document.getElementById("ceSignUpBtn");
        btn.value = res.RemoveSignUp(); btn.setAttribute("onclick", "eventview.deleteSignUpList();");
        $("#ceListName").val(signupliste);
    };
    var get_rolebindings = function (context) {
        return SP.RoleDefinitionBindingCollection.newObject(context);
    };
    var newList = function () {
        context = new SP.ClientContext.get_current(); var listCreationInfo = new SP.ListCreationInformation();
        listName = document.getElementById("ceListName").value; listCreationInfo.set_title(listName);
        listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
        this.newlist = context.get_web().get_lists().add(listCreationInfo); context.load(this.newlist);
        context.executeQueryAsync(Function.createDelegate(this, eventview.onSucceeded), Function.createDelegate(this, eventview.onAe));
    };
    var addSignupUrl = function (title) {
        context = new SP.ClientContext.get_current(); this.list = context.get_web().get_lists().getByTitle(title);
        var url = this.list.get_rootFolder();
        context.load(url); context.executeQueryAsync(function () {
            this.list = context.get_web().get_lists().getByTitle(title);
            var url = this.list.get_rootFolder(); var sUrl = url.get_serverRelativeUrl() + "/AllItems.aspx";
            if (sUrl !== undefined) {
                $('input[title="Sign Up"]').val(sUrl);
                $("#ceSignUpLink").html(res.SignUpList() + document.getElementById("ceListName").value);
                var btn = document.getElementById("ceSignUpBtn"); btn.value = res.RemoveSignUp();
                btn.setAttribute("onclick", "eventview.deleteSignUpList();");
            }
        });
    };
    var anotherList = function () {
        var message = res.AnotherList();
        alert(message);
    };
    var cnew = function () {
        var formbody = document.getElementById("newform");
        var form = document.createElement("form"); formbody.appendChild(form);
        form.setAttribute("class", "form-horizontal");
        var titlediv = document.createElement("div"); form.appendChild(titlediv);
        titlediv.setAttribute("class", "form-group");
        var titlelbl = document.createElement("label"); titlediv.appendChild(titlelbl);
        titlelbl.setAttribute("for", "titlectrl"); titlelbl.setAttribute("class", "col-sm-2 control-label");
        titlelbl.innerHTML = "Title"; //resources
        var tctrldiv = document.createElement("div"); titlediv.appendChild(tctrldiv);
        tctrldiv.setAttribute("class", "col-sm-10");
        var tctrl = document.createElement("input"); tctrldiv.appendChild(tctrl);
        tctrl.setAttribute("type", "text"); tctrl.setAttribute("class", "form-control"); tctrl.setAttribute("placeholder", "Title");
        tctrl.setAttribute("id", "tctrl");

        var locdiv = document.createElement("div"); form.appendChild(locdiv);
        locdiv.setAttribute("class", "form-group");
        var loclbl = document.createElement("label"); locdiv.appendChild(loclbl);
        loclbl.setAttribute("for", "locctrl"); loclbl.setAttribute("class", "col-sm-2 control-label");
        loclbl.innerHTML = "Location"; //resources
        var lctrldiv = document.createElement("div"); locdiv.appendChild(lctrldiv);
        lctrldiv.setAttribute("class", "col-sm-10");
        var lctrl = document.createElement("input"); lctrldiv.appendChild(lctrl);
        lctrl.setAttribute("type", "text"); lctrl.setAttribute("class", "form-control"); lctrl.setAttribute("placeholder", "Location");
        lctrl.setAttribute("id", "lctrl");


        var startdiv = document.createElement("div"); form.appendChild(startdiv);
        startdiv.setAttribute("class", "form-group");
        var startlbl = document.createElement("label"); startdiv.appendChild(loclbl);
        startlbl.setAttribute("for", "locctrl"); startlbl.setAttribute("class", "col-sm-2 control-label");
        startlbl.innerHTML = "Start Time"; //resources
        var sctrldiv = document.createElement("div"); startdiv.appendChild(sctrldiv);
        sctrldiv.setAttribute("class", "col-sm-10"); sctrldiv.setAttribute("data-provide", "datepicker");
        var sctrl = document.createElement("input"); sctrldiv.appendChild(sctrl);
        sctrl.setAttribute("type", "text"); sctrl.setAttribute("class", "form-control"); sctrl.setAttribute("placeholder", "Start Time");//resources
        sctrl.setAttribute("id", "sctrl");

        startdiv.innerHTML = '<div class="container">'+
            '<div class="row">' + 
                '<div class="col-sm-6">' +
                    '<div class="form-group">' +
                        '<div class="input-group date" id="datetimepicker2">' +
                            '<input type="text" class="form-control" />' +
                            '<span class="input-group-addon">' +
                               // '<span class="glyphicon glyphicon-calendar"></span>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<script type="text/javascript">' +
                    '$(function () { ' +
                        '$("#datetimepicker2").datetimepicker({ ' +
                            'locale: "en"' +
                        '});' +
                    '});' +
       ' </script>' +
    '</div >' +
'</div >';

   
    };
    return{
        addSignUpList: createList,
        deleteSignUpList: removeList,
        deleteList: deleteSignList,
        onDeleteSucceeded: deleteSuccess,
        onSucceeded: deleted,
        setID: listID,
        setPerm: allowWrite,
        setSignUp: writeItem,
        get_def: get_roledefinition,
        onGotItem: gotItem,
        writetitle: writeLinks,
        get_bindings: get_rolebindings,
        addList: newList,
        setListUrl: addSignupUrl,
        onAe: anotherList,
        adminCheck: isAdminTest,
        newcustom:cnew
    };
})();




    
    

