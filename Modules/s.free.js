var email;
var modal = {
    launch: function () {
        var hinge = document.getElementById("SModal");
        var modaldialog = document.createElement("div"); modaldialog.setAttribute("class", "modal-dialog");
        hinge.appendChild(modaldialog);
        var modalcontent = document.createElement("div"); modalcontent.setAttribute("class", "modal-content");
        modaldialog.appendChild(modalcontent);
        var modalheader = document.createElement("div"); modalheader.setAttribute("class", "modal-header");
        modalcontent.appendChild(modalheader);
        var dismiss = document.createElement("button"); dismiss.setAttribute("type", "button"); dismiss.setAttribute("class", "close");
        dismiss.innerHTML = '<span aria-hidden="true">&times;</span>'; modalheader.appendChild(dismiss);
        dismiss.setAttribute("data-dismiss", "modal"); dismiss.setAttribute("aria-label", "Close");
        var mtitle = document.createElement("h4"); mtitle.setAttribute("class", "modal-title");
        mtitle.setAttribute("id", "modaltitlelabel"); mtitle.innerHTML = "Welcome to a 30 day free trial";
        modalheader.appendChild(mtitle);
        var modalbody = document.createElement("div"); modalcontent.appendChild(modalbody);
        modalbody.setAttribute("id", "cwusign"); modalbody.setAttribute("style", "background-image: url('../Images/SONJASAPPS_Lite.jpg'); background-repeat: no-repeat; background-size: cover; height: 440px;");
        modalbody.setAttribute("class", "modal-body");
        var keyteaser = document.createElement("div"); keyteaser.setAttribute("style", "height: 50px;");
        modalbody.appendChild(keyteaser);

        var keyspan = document.createElement("div"); keyteaser.appendChild(keyspan);
        keyteaser.setAttribute("class", "keyspan");
        keyspan.innerHTML = res.Popup();
        var bodydiv = document.createElement("div"); modalbody.appendChild(bodydiv); bodydiv.setAttribute("class", "w300");
        var formgroup = document.createElement("div"); formgroup.setAttribute("class", "form-group");
        bodydiv.appendChild(formgroup); formgroup.setAttribute("style", "width:300px;");
        var chdiv1 = document.createElement("div"); chdiv1.setAttribute("class", "checkbox pad w300");
        formgroup.appendChild(chdiv1);
        var chlbl1 = document.createElement("label"); chdiv1.appendChild(chlbl1);
        chlbl1.innerHTML = '<input id="newsch" type="checkbox" checked> Subscribe to newsletter from SONJAsAPPS';

        var chdiv2 = document.createElement("div"); chdiv2.setAttribute("class", "checkbox w300");
        formgroup.appendChild(chdiv2);
        var chlbl2 = document.createElement("label"); chdiv2.appendChild(chlbl2);
        chlbl2.innerHTML = '<input id="updatech" type="checkbox" checked> Subscribe to update email alert';

        var modalfooter = document.createElement("div"); modalfooter.setAttribute("class", "modal-footer");
        modalcontent.appendChild(modalfooter);
        var oklink = document.createElement("a"); oklink.setAttribute("class", "btn okbtn");
        oklink.setAttribute("style", "color:#FFF;");
        modalfooter.appendChild(oklink); oklink.setAttribute("id", "modalok"); oklink.setAttribute("href", "#");
        oklink.setAttribute("onclick", "modal.set();");
        oklink.innerHTML = "OK";
        var closelink = document.createElement("button"); closelink.setAttribute("type", "button");
        closelink.setAttribute("class", "btn btn-default");
        modalfooter.appendChild(closelink); closelink.setAttribute("data-dismiss", "modal");
        closelink.innerHTML = "Close"; closelink.setAttribute("href", "#");




    },
    deliver: function () {
        $(sm).modal('show');
        $(sm).on('shown.bs.modal', function (event) {
            var div = document.getElementById("cwusign");
            var hosturl = util.getProperty("SPHostUrl");
            var appurl = util.getProperty("SPAppWebUrl");
            var lang = util.getProperty("SPLanguage");
            context = SP.ClientContext.get_current();
            var user = context.get_web().get_currentUser();
            context.load(user); context.executeQueryAsync(function () {
                var user = context.get_web().get_currentUser(); email = user.get_email(); var name = user.get_title();
                name = encodeURI(name);

            });
        });

    },
    set: function () {
        context = SP.ClientContext.get_current();

        var hosturl = util.getProperty("SPHostUrl");
        var hostL = hosturl.split('/');
        var siteurl = hostL[2];
        var sitefancy = siteurl.replace("#", "");
        var sitenodot = sitefancy.replace(/\./g, '');

        var appweburl = util.getProperty("SPAppWebUrl"); appweburl = appweburl.replace("#", "");

        var anL = appweburl.split('/');
        var appname = anL[anL.length - 1];
        appname = appname.replace("#", "");
        var date = new Date();
        var timestamp = date.toUTCString();

        var litejson = { liteApp: appname, liteDate: timestamp, liteUrl: sitenodot };
        var liteUrl = "https://sfactory.azurewebsites.net/api/Lites";

        $.ajax({
            url: liteUrl,
            method: "POST",
            crossDomain: true,
            headers: {
                "ACCEPT": "application/json;odata=verbose",
                "Access-Control-Allow-Origin": "*"
            },
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(litejson),
            dataType: 'json',
            success: modal.logLite(appname, sitefancy, timestamp, appweburl),
            error: function (err) { console.info(JSON.stringify(err)); }
        });

    },
    logLite: function (appname, sitefancy, timestamp, appweburl) {
        context = SP.ClientContext.get_current();
        var user = context.get_web().get_currentUser();
        context.load(user); context.executeQueryAsync(function () {
            var user = context.get_web().get_currentUser();
            var email = user.get_email();
            var name = user.get_title();
            var newsletter = document.getElementById("newsch").checked;
            var appUpdate = document.getElementById("updatech").checked;
            var siteshort = sitefancy.substring(0, 40);
            var appshorturl = appweburl.substring(0, 40);
            var logUrl = "https://sfactory.azurewebsites.net/api/LiteLogs";
            var logjson = {
                CustomerName: name, CustomerEmail: email,
                SiteUrl: sitefancy,
                AppUrl: appshorturl,
                Newsletter: newsletter,
                AppUpdate: appUpdate,
                App: appname
            };
            $.ajax({
                url: logUrl,
                method: "POST",
                crossDomain: true,
                headers: {
                    "ACCEPT": "application/json;odata=verbose",
                    "Access-Control-Allow-Origin": "*"
                },
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(logjson),
                dataType: 'json',
                success: modal.final,
                error: function (err) { console.info(JSON.stringify(err)); }
            });


        });
    },
    reg: function () {
        var hosturl = util.getProperty("SPHostUrl");
        var hosturlL = hosturl.split('/');
        var siteUrl = hosturlL[2];
        var appurl = util.getProperty("SPAppWebUrl");
        var appSiteL = appurl.split('/');
        var appName = appSiteL[appSiteL.length - 1];
        appName = appName.replace("#", "");
        var date = new Date();
        var timestamp = date.toUTCString();
        var djson = { app: appName, dlDate: timestamp, scUrl: siteUrl };
        var saveurl = "http://sfactory.azurewebsites.net/api/Lites";
        //GetByApp/" + appName + "/" + siteUrl;

        var request = new SP.WebRequestInfo();
        request.set_url(saveurl);
        request.set_headers({ "Accept": "application/json;odata=verbose" });
        request.set_method("POST");
        request.set_body(JSON.stringify(djson));
        response = SP.WebProxy.invoke(context, request);
        context.executeQueryAsync(function onDone(sender, args) { console.info(response.get_body()); });

    },
    onError: function () {
        console.info(JSON.stringify(err));
    },
    final: function () {
        if (navigator.appVersion.indexOf('Chrome') > -1) {

            location.reload(true);
        } else {

            var loc = location.href;
            window.open(loc, "_parent", "");
        }
    }
};
modal.launch();



