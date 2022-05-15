var arrSups = []; var b = 0; var p = "ceContent"; var h = "div"; var context; var clAss = "class";
var arrTitle = []; var arrImage = []; var arrDesc = []; var arrContent = []; var arrStart = []; var arrEnd = []; var arrSign = [];
var arrLimit = []; var arrLoc = []; var arrContact = []; var arrId = []; var arrAtt = [];

var ceui=(function () {
    var noEvents = function () {
        document.getElementById("ce").innerHTML = res.NoEventsAdmin();
        document.getElementById("ceNext").style.display = "none";
    };
    var dealEvents = function (events) {
        var items = events.getEnumerator();
        var view = vars.View();
        var signedit = vars.ShowSignUp(); var addOut = vars.ShowAdd(); var addAtt = vars.ShowAtt();
        switch (view) {
            case "Pictures":
                ceui.showPictures(items, signedit, addOut, addAtt);
                break;
            case "Tile":
                ceui.showTile(items, signedit, addOut, addAtt);
                break;
            case "Default":
                ceui.showDefault(items, signedit, addOut, addAtt);
                break;
            case "Today":
                ceui.showToday(items, signedit, addOut, addAtt);
                break;
        }
    };
    var todayView = function (items, s, a, t) {
        var placeholder = document.getElementById("ce"); var x = 0;
        var dateholder = document.createElement(h); dateholder.setAttribute(clAss, "todayBigDate");
        placeholder.appendChild(dateholder);
        var newtab = util.getProperty("ShowTab");
        var contentholder = document.createElement(h); contentholder.setAttribute(clAss, "todayContent");
        placeholder.appendChild(contentholder);
        while (items.moveNext()) {
            var event = items.get_current();
            var eTitle = event.get_item("Title");
            arrTitle[x] = eTitle;
            var eId = event.get_item("ID"); var eUrl = ceui.formatUrl(eId);
            arrId[x] = eId;
            var eDesc = event.get_item("Description"); if (eDesc === null) { eDesc = ""; }
            arrDesc[x] = eDesc;
            var eStart = event.get_item("EventDate"); var j = util.formatMonthDate(eStart);
            var y = util.formatHoursDate(eStart);
            
            var clockStart = eStart;
            arrStart[x] = clockStart;
           
            var clockEnd = event.get_item("EndDate");
            arrEnd[x] = clockEnd;
            var timeFormat = util.getProperty("Time");
            var starttime = util.formatAMPM(clockStart);
            var endtime = util.formatAMPM(clockEnd)
            if (timeFormat === "false") {
                starttime = util.formatHoursDate(clockStart);
                endtime = util.formatHoursDate(clockEnd);
            }
           
            var sul = event.get_item("SignUpTitle");
            arrSign[x] = sul;
            App.cache.limit = event.get_item("Limit");

            arrLimit[x] = App.cache.limit;
            var ePic = event.get_item("Image");
            if (ePic !== null) {
                ePic = ePic.get_url();
            }
            arrImage[x] = ePic;
            var eventContact = event.get_item('Event_x0020_Contact');
            if (eventContact === null) { eventContact = ""; } else {
                eventContact = eventContact.get_lookupValue();

            }
            arrContact[x] = eventContact;
            var eCnt = event.get_item("EventDetails");
            if (eCnt === null) {
                eCnt = "";
            }
            arrContent[x] = eCnt;
            var eLoc = event.get_item("Location"); if (eLoc === null) { eLoc = ""; }
            arrLoc[x] = eLoc;

            if (x === 0) {
                var ddiv = document.createElement(h); ddiv.setAttribute(clAss, "todayDate");
                dateholder.appendChild(ddiv); ddiv.innerHTML = j;
              //  x += 1;
            }
            
            var titlediv = document.createElement(h); titlediv.setAttribute(clAss, "todayTitle");
            contentholder.appendChild(titlediv);
            var hourdiv = document.createElement(h); hourdiv.setAttribute(clAss, "todayHour");
            titlediv.appendChild(hourdiv); hourdiv.innerHTML = starttime;
            var linkdiv = document.createElement(h); linkdiv.setAttribute(clAss, "todayt");
            titlediv.appendChild(linkdiv);
            var elink = document.createElement("a"); elink.innerHTML = eTitle;
            //opens a new tab
            
            var elink = document.createElement("a");
            if (newtab === "true") {
                elink.setAttribute("href", eUrl); elink.setAttribute("target", "_blank");
            }
            else {
                var eventTitleClick = "ceui.showCalItem(" + x + ");";
                elink.setAttribute("href", "#");
                elink.setAttribute("onclick", eventTitleClick);
                elink.setAttribute("href", "#ceItem");
            }
            elink.innerHTML = eTitle;
            linkdiv.appendChild(elink);
            var eDesc = event.get_item("Description"); if (eDesc === null) { eDesc = ""; }
            var descdiv = document.createElement("div"); descdiv.setAttribute(clAss, "todayDesc");
            linkdiv.appendChild(descdiv); descdiv.innerHTML = eDesc;

          

            var controls = document.createElement("div"); controls.setAttribute(clAss, "controls nl");
            controls.setAttribute("name", x);
                            contentholder.appendChild(controls);

            ceui.propsPart(eId, t, a, s, sul, controls, x);
            var hasAttachments = event.get_fieldValues()['Attachments'];
            arrAtt[x] = hasAttachments;

            
            x += 1;
            util.resize();
        }
    };
    var tileView = function (items, s, a, t) {
        var p = document.getElementById("ce");
        var x = 0;
        var newtab = util.getProperty("ShowTab");
        while (items.moveNext()) {
            

         
            var event = items.get_current(); var eTitle = event.get_item("Title");
            arrTitle[x] = eTitle;
            var ev = document.createElement(h); ev.setAttribute(clAss, "pictile");
            p.appendChild(ev);

            var eId = event.get_item("ID"); var eUrl = ceui.formatUrl(eId);
            arrId[x] = eId;
            //opens a new tab           
            var elink = document.createElement("a");
            if (newtab === "true") {
                elink.setAttribute("href", eUrl); elink.setAttribute("target", "_blank");
            }
            else {
                var eventTitleClick = "ceui.showCalItem(" + x + ");";
                elink.setAttribute("href", "#");
                elink.setAttribute("onclick", eventTitleClick);
                elink.setAttribute("href", "#ceItem");
            }
            ev.appendChild(elink);
            var ePic = event.get_item("Image");

            if (ePic !== null) {
                ePic = ePic.get_url();
                var imgdiv = document.createElement(h); imgdiv.setAttribute(clAss, "picimgdiv nl");
                elink.appendChild(imgdiv);
                var evi = new Image(); evi.src = ePic;
                evi.setAttribute(clAss, "picimg"); imgdiv.appendChild(evi);
            }

            arrImage[x] = ePic;

            var eventContact = event.get_item('Event_x0020_Contact');
            if (eventContact === null) { eventContact = ""; } else {
                eventContact = eventContact.get_lookupValue();

            }
            arrContact[x] = eventContact;

            var eStart = event.get_item("EventDate");
            var clockStart = eStart;
            arrStart[x] = clockStart;
            var j = util.formatMonthDate(eStart);
            var clockEnd = event.get_item("EndDate");
            arrEnd[x] = clockEnd;

            var sul = event.get_item("SignUpTitle");
            arrSign[x] = sul;
            App.cache.limit = event.get_item("Limit");

            arrLimit[x] = App.cache.limit;
            var datediv = document.createElement(h); datediv.setAttribute(clAss, "picdate");
            elink.appendChild(datediv); datediv.innerHTML = j;
            var titlediv = document.createElement(h); titlediv.setAttribute(clAss, "pictitle");
            elink.appendChild(titlediv);
            titlediv.innerHTML = "<h2>" + eTitle + "</h2>";

            var hasAttachments = event.get_fieldValues()['Attachments'];
            arrAtt[x] = hasAttachments;

            var eDesc = event.get_item("Description"); if (eDesc === null) { eDesc = ""; }
            
            arrDesc[x] = eDesc;
            if (eDesc !== "") {
                var descdiv = document.createElement(h); descdiv.setAttribute(clAss, "picdesc");
                ev.appendChild(descdiv); descdiv.innerHTML = eDesc;
            }
            var eCnt = event.get_item("EventDetails");
            if (eCnt === null) {
                eCnt = "";
            }
            arrContent[x] = eCnt;
            var eLoc = event.get_item("Location"); if (eLoc === null) { eLoc = ""; }
            if (eLoc !== "") {
                var locdiv = document.createElement(h); ev.appendChild(locdiv); locdiv.setAttribute(clAss, "picloc");
                var locstr = res.Location();
                locdiv.innerHTML = locstr + eLoc;
            }
            arrLoc[x] = eLoc;


            var controls = document.createElement("div"); controls.setAttribute(clAss, "controls nl");
            controls.setAttribute("name", x);
            ev.appendChild(controls);
            ceui.propsPart(eId, t, a, s, sul, controls, x);
            x += 1;
            util.resize();

        }
    };
    var picturesView = function (items, s, a, t) {
        var p = document.getElementById("ce");    
        var p1 = document.getElementById("npleft");
        var p2 = document.getElementById("npright");
        if (p1 === null) {
            p1 = document.createElement("div"); p1.setAttribute("id", "npleft");
            p2 = document.createElement("div"); p2.setAttribute("id", "npright");
            p.appendChild(p1); p.appendChild(p2);
        }
        var x = 0;
        var newtab = util.getProperty("ShowTab");
        while (items.moveNext()) {
            var col = document.getElementById("npright");

            if (App.cache.no > x) {

                col = document.getElementById("npleft");
            }
            var event = items.get_current(); var eTitle = event.get_item("Title");
            arrTitle[x] = eTitle;
            var ev = document.createElement(h); ev.setAttribute(clAss, "piccard");
            col.appendChild(ev);

            var eId = event.get_item("ID"); var eUrl = ceui.formatUrl(eId);
            arrId[x] = eId;
            //opens a new tab           
            var elink = document.createElement("a");
            if (newtab === "true") {
                elink.setAttribute("href", eUrl); elink.setAttribute("target", "_blank");
            }
            else {
                var eventTitleClick = "ceui.showCalItem(" + x + ");";
                elink.setAttribute("href", "#");
                elink.setAttribute("onclick", eventTitleClick);
                elink.setAttribute("href", "#ceItem");
            }
            ev.appendChild(elink);
            var ePic = event.get_item("Image");

            if (ePic !== null) {
                ePic = ePic.get_url();
                var imgdiv = document.createElement(h); imgdiv.setAttribute(clAss, "picimgdiv nl");
                elink.appendChild(imgdiv);
                var evi = new Image(); evi.src = ePic;
                evi.setAttribute(clAss, "picimg"); imgdiv.appendChild(evi);
            }
            
            arrImage[x] = ePic;

            var eventContact = event.get_item('Event_x0020_Contact');
            if (eventContact === null) { eventContact = ""; } else {
                eventContact = eventContact.get_lookupValue();
                
            }
            arrContact[x] = eventContact;
            
            var eStart = event.get_item("EventDate");
            var clockStart = eStart;
            arrStart[x] = clockStart;
            var j = util.formatMonthDate(eStart);
            var clockEnd = event.get_item("EndDate");
            arrEnd[x] = clockEnd;
          
            var sul = event.get_item("SignUpTitle");
            arrSign[x] = sul;
            App.cache.limit = event.get_item("Limit");
            
            arrLimit[x] = App.cache.limit;
            var datediv = document.createElement(h); datediv.setAttribute(clAss, "picdate");
            elink.appendChild(datediv); datediv.innerHTML = j;
            var titlediv = document.createElement(h); titlediv.setAttribute(clAss, "pictitle");
            elink.appendChild(titlediv);
            titlediv.innerHTML = "<h2>" + eTitle + "</h2>";
          
            var hasAttachments = event.get_fieldValues()['Attachments'];
            arrAtt[x] = hasAttachments;
            
            var eDesc = event.get_item("Description"); if (eDesc === null) { eDesc = ""; }
            arrDesc[x] = eDesc;
            if (eDesc !== "") {
                var descdiv = document.createElement(h); descdiv.setAttribute(clAss, "picdesc");
                ev.appendChild(descdiv); descdiv.innerHTML = eDesc;
            }
            var eCnt = event.get_item("EventDetails");
            if (eCnt === null) {
                eCnt = "";
            }
            arrContent[x] = eCnt;
            var eLoc = event.get_item("Location"); if (eLoc === null) { eLoc = ""; }
            if (eLoc !== "") {
                var locdiv = document.createElement(h); ev.appendChild(locdiv); locdiv.setAttribute(clAss, "picloc");
                var locstr = res.Location();
                locdiv.innerHTML = locstr + eLoc;
            }
            arrLoc[x] = eLoc;
          
            
            var controls = document.createElement("div"); controls.setAttribute(clAss, "controls nl");
            controls.setAttribute("name", x);
            ev.appendChild(controls);
            ceui.propsPart(eId, t, a, s, sul, controls, x);
            x += 1;
             util.resize();
            
        }
    };
    var defaultView = function (items, s, a, t) {
        var placeholder = document.getElementById("ce");
        var newtab = util.getProperty("ShowTab");
        var w = 0;
        while (items.moveNext()) {
            var event = items.get_current(); var eTitle = event.get_item("Title");
            arrTitle[w] = eTitle;
            var eStart = event.get_item("EventDate");
            var clockStart = eStart;
            arrStart[w] = clockStart;
            var j = util.formatMonthDate(eStart);
            var clockEnd = event.get_item("EndDate");
            arrEnd[w] = clockEnd;
          
            var eDesc = event.get_item("Description"); if (eDesc === null) { eDesc = ""; }
            arrDesc[w] = eDesc;
            var eId = event.get_item("ID"); var eUrl = ceui.formatUrl(eId);
            arrId[w] = eId;
            var sul = event.get_item("SignUpTitle");
            arrSign[w] = sul;
            App.cache.limit = event.get_item("Limit");
            arrLimit[w] = App.cache.limit;
            var eholder = document.createElement(h);
            eholder.setAttribute(clAss, "ceItemDiv"); placeholder.appendChild(eholder);
            var ediv = document.createElement(h); eholder.appendChild(ediv);
            ediv.setAttribute(clAss, "ceDiv nl"); var elink = document.createElement("a"); elink.innerHTML = j + " " + eTitle;

            //opens a new tab
            
            var elink = document.createElement("a");
            if (newtab === "true") {
                elink.setAttribute("href", eUrl); elink.setAttribute("target", "_blank");
            }
            else {
                var eventTitleClick = "ceui.showCalItem(" + w + ");";
                elink.setAttribute("href", "#");
                elink.setAttribute("onclick", eventTitleClick);
                elink.setAttribute("href", "#ceItem");
            }
            elink.innerHTML = eTitle;
           
            ediv.appendChild(elink);
            if (eDesc !== "") {
                var eDescDiv = document.createElement(h);
                eholder.appendChild(eDescDiv); eDescDiv.innerHTML = eDesc; eDescDiv.setAttribute(clAss, "ceDescDiv");
            }
            var eCnt = event.get_item("EventDetails");
            if (eCnt === null) {
                eCnt = "";
            }
            arrContent[w] = eCnt;
            var eLoc = event.get_item("Location"); if (eLoc === null) { eLoc = ""; }
           
            arrLoc[w] = eLoc;
            var ePic = event.get_item("Image");

            if (ePic !== null) {
                ePic = ePic.get_url();
               
            }

            arrImage[w] = ePic;
            var eventContact = event.get_item('Event_x0020_Contact');
            if (eventContact === null) { eventContact = ""; } else {
                eventContact = eventContact.get_lookupValue();

            }
            arrContact[w] = eventContact;
            var hasAttachments = event.get_fieldValues()['Attachments'];
            arrAtt[w] = hasAttachments;
            if (vars.IE8 > -1 || vars.IE7 > -1) { eDescDiv.innerHTML = eDesc + "&nbsp;&nbsp;&nbsp;"; }
            ceui.propsPart(eId, t, a, s, sul, eholder,w);
            w += 1;

        } util.resize();
    };
    var appendTo = function (eId, t, a, s, sul, placeholder) {
        
        var pdiv = document.createElement(h); placeholder.appendChild(pdiv); pdiv.setAttribute("id", "pdiv_" + sul); pdiv.setAttribute("class", "people");
        var odiv = document.createElement(h); placeholder.appendChild(odiv); odiv.setAttribute("id", "odiv_" + sul); odiv.setAttribute("class", "outlook");
        var sdiv = document.createElement(h); placeholder.appendChild(sdiv); sdiv.setAttribute("id", "sdiv_" + sul); sdiv.setAttribute("class", "sig");
        var attdiv = document.createElement(h); placeholder.appendChild(attdiv); attdiv.setAttribute("id", "att_" + sul); attdiv.setAttribute("class", "attendees");
        attdiv.style.display = "none";
        if (t.toLowerCase() === "true") { if (sul !== null) { ceui.showattendees(pdiv, sul); $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px"); } }
        if (a.toLowerCase() === "true") {
            $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");
            ceui.shoUtlook(odiv, sul, eId);
        }
        if (s.toLowerCase() === "true") {
            if (sul !== null) {
                $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");
                              
                    ceui.showSigning(sdiv, sul, eId);                
            }
        }
        //var slink = document.createElement("a"); sdiv.appendChild(slink);
        //slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id", "link_" + sul);
        //slink.setAttribute("name", "");
    };
    var appendToPart = function (eId, t, a, s, sul, placeholder,x) {
        var pdiv = document.createElement(h); placeholder.appendChild(pdiv); pdiv.setAttribute("id", "pdiv_" + sul); pdiv.setAttribute("class", "people");
        var odiv = document.createElement(h); placeholder.appendChild(odiv); odiv.setAttribute("id", "odiv_" + sul); odiv.setAttribute("class", "outlook");
        var sdiv = document.createElement(h); placeholder.appendChild(sdiv); sdiv.setAttribute("id", "sdiv_" + sul); sdiv.setAttribute("class", "sig");
        var attdiv = document.createElement(h); placeholder.appendChild(attdiv); attdiv.setAttribute("id", "att_" + sul); attdiv.setAttribute("class", "attendees");
        attdiv.style.display = "none";
        if (t.toLowerCase() === "true") { if (sul !== null) { ceui.showattendees(pdiv, sul); $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px"); } }
        if (a.toLowerCase() === "true") {
            $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");
            ceui.shoUtlook(odiv, sul, eId);
        }
        if (s.toLowerCase() === "true") {
            if (sul !== null) {
                $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");

                ceui.showSigningPart(sdiv, sul,x);
            }
        }
       //var slink = document.createElement("a"); sdiv.appendChild(slink);
       // slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id", "link_" + sul);
        //slink.setAttribute("name", x);
    };
    var appendToExpanded = function (eId, t, a, s, sul, placeholder,x) {
        var pdiv = document.createElement(h); placeholder.appendChild(pdiv);
        pdiv.setAttribute("id", "pdivx_" + sul); pdiv.setAttribute("class", "people");
        var odiv = document.createElement(h); placeholder.appendChild(odiv); odiv.setAttribute("id", "odivx_" + sul);
        odiv.setAttribute("class", "outlook");
        var sdiv = document.createElement(h); placeholder.appendChild(sdiv);
        sdiv.setAttribute("id", "sdivx_" + sul); sdiv.setAttribute("class", "sig");
        var attdiv = document.createElement(h); placeholder.appendChild(attdiv);
        attdiv.setAttribute("id", "attx_" + sul); attdiv.setAttribute("class", "attendees");
        attdiv.style.display = "none";
        console.info("sul: " + sul);
        if (t.toLowerCase() === "true") {
            if (sul !== null) {
                ceui.showattendeesExt(pdiv, sul);
                $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");
            }
        }
        if (a.toLowerCase() === "true") {
            $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");
            ceui.shoUtlook(odiv, sul, eId);
        }
        if (s.toLowerCase() === "true") {
            if (sul !== null) {
                $("div.controls").css("height", "20px"); $("div.controls").css("margin-bottom", "25px");

                ceui.showSigningExt(sdiv, sul,x);
            }
        }
        //var slink = document.createElement("a"); sdiv.appendChild(slink);
        //slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id","link_" + sul);
        //slink.setAttribute("name", x);
    };
    var attView = function (ediv, sul) {
        var peopleicon = document.createElement("div"); peopleicon.setAttribute("id", "p_" + sul);
        ediv.appendChild(peopleicon); peopleicon.innerHTML = '<i class="fa fa-users fa-lg"></i>' + res.Attendees();
        peopleicon.setAttribute("onmouseenter", "ceui.showdees('" + sul + "');");
        peopleicon.setAttribute("onmouseout", "ceui.hidedees('" + sul + "');");
    };
    var attViewExt = function (ediv, sul) {
        var peopleicon = document.createElement("div"); peopleicon.setAttribute("id", "px_" + sul);
        ediv.appendChild(peopleicon); peopleicon.innerHTML = '<i class="fa fa-users fa-lg"></i>' + res.Attendees();
        peopleicon.setAttribute("onmouseenter", "ceui.showdeesx('" + sul + "');");
        peopleicon.setAttribute("onmouseout", "ceui.hidedeesx('" + sul + "');");
    };
    var deesHide = function (r) {
        var st = document.getElementById("att_" + r).style.display = "none";
    };
    var deesShow = function (io) {
        var holder = document.getElementById("att_" + io); holder.style.display = "block";
        holder.innerHTML = ""; holder.style.backgroundColor = "#333"; holder.style.color = "#FFF"; holder.style.padding = "5px";
        var dropd = document.createElement("div"); holder.appendChild(dropd); dropd.setAttribute("id", "dees_" + io);
        cequery.getPeople(io);
    };
    var deesHidex = function (r) {
        var st = document.getElementById("attx_" + r).style.display = "none";
    };
    var deesShowx = function (io) {
        var holder = document.getElementById("attx_" + io); holder.style.display = "block";
        holder.innerHTML = ""; holder.style.backgroundColor = "#333"; holder.style.color = "#FFF"; holder.style.padding = "5px";
        var dropd = document.createElement("div"); holder.appendChild(dropd); dropd.setAttribute("id", "deesx_" + io);
        cequery.getPeoplex(io);
    };
    var showDeeThem = function (oia, people) {
        var items = people.getEnumerator();
        var f = document.getElementById("att_" + oia);
        while (items.moveNext()) {
            var dee = items.get_current(); var dTitle = dee.get_item("Title");
            f.innerHTML += "<div>" + dTitle + "</div>";
            if (location.href.indexOf('Display.aspx?ID=') === -1) {
                util.resize();
            }
        }
    };
    var showDeeThemx = function (oia, people) {
        var items = people.getEnumerator();
        var f = document.getElementById("attx_" + oia);
        while (items.moveNext()) {
            var dee = items.get_current(); var dTitle = dee.get_item("Title");
            f.innerHTML += "<div>" + dTitle + "</div>";
            if (location.href.indexOf('Display.aspx?ID=') === -1) {
                util.resize();
            }
        }
    };
    var peopleCount = function (eSignUpTitle, lId) {
        this.slist = context.get_web().get_lists().getById(eSignUpTitle);
        context.load(this.slist);
        context.executeQueryAsync(function (sender,args) {
            this.slist = context.get_web().get_lists().getById(eSignUpTitle);
            var controls = document.getElementById(lId + eSignUpTitle);
            var itemcount = this.slist.get_itemCount();
            App.cache.itemcount = itemcount;
            App.cache.eSignUpTitle = eSignUpTitle;
            var slink = document.createElement("a"); controls.appendChild(slink);
            slink.setAttribute("class", "ceSignUpLink");
            //slink.setAttribute("name", App.cache.limit);
            
           
            if (App.cache.limit === undefined) {
                App.cache.limit = null;
            }
            
            if (App.cache.expanded) {               
                slink.setAttribute("id", "linkx_" + eSignUpTitle);
            }else{
                slink.setAttribute("id", "link_" + eSignUpTitle);
            }

            if (itemcount === App.cache.limit) {
                
                already = cequery.findAlready(context, eSignUpTitle);
                context.load(already, 'Include(ID)'); context.executeQueryAsync(cequery.onFindAlreadySignUpSuccess, util.onFail);
            }
            else if (itemcount > 0 && App.cache.limit === null) {
                
                already = cequery.findAlready(context, eSignUpTitle);
                context.load(already, 'Include(ID)'); context.executeQueryAsync(cequery.onFindAlreadySignUpSuccess, util.onFail);
            }
            else if (itemcount > 0 && itemcount < App.cache.limit) {
                
                already = cequery.findAlready(context, eSignUpTitle);
                context.load(already, 'Include(ID)'); context.executeQueryAsync(cequery.onFindAlreadySignUpSuccess, util.onFail);

            }
          
            else if (itemcount === 0) {
                var itemrow= parseInt(slink.parentNode.getAttribute("name"));
                slink.innerHTML = res.SignUp();
                slink.setAttribute("onclick", "partui.signUp('" + eSignUpTitle + "'," + itemrow + ")");
            }
        });
    };
    var cancelLink = function (dslink, eSignUpTitle) {
       
        var q="linkx_";
        if (!App.cache.expanded) {
            q = "link_";
        }
        var slink = document.getElementById(q + eSignUpTitle);
        var itemrow = parseInt(slink.parentNode.getAttribute("name"));
       
        slink.innerHTML = res.CancelSignUp();
        slink.setAttribute("onclick", "partui.cancelSignUp('" + eSignUpTitle + "'," + itemrow + ")");
     
    };
    var signLink = function (dslink, eSignUpTitle, lmt) {
        var q = "linkx_";
        var s = "seatsx_";
        if (!App.cache.expanded) {
            q = "link_";
            s = "seats_";
        }
        var slink = document.getElementById(q + eSignUpTitle);
        var itemrow = parseInt(slink.parentNode.getAttribute("name"));
        var seats = document.getElementById(s + eSignUpTitle);
      
        App.cache.limit = arrLimit[itemrow];
        lmt = arrLimit[itemrow];

        var pageloc = location.href;
        if (pageloc.indexOf('Display.aspx?ID=') > -1) {
            var tL = document.getElementById("lholder").innerHTML;
            
            if (tL !== "null") {
                lmt = parseInt(tL);
            } else {
                lmt = tL;
            }

        }
        
        if (lmt === "null") {
           lmt = null;
        }
        if (lmt !== null) {
            App.cache.left = parseInt(lmt) - App.cache.itemcount;
        } else {
            App.cache.left = null;
        }
       
    
        
            if (App.cache.left > 0) {
                slink.innerHTML = res.SignUp();
                slink.setAttribute("onclick", "partui.signUp('" + eSignUpTitle + "'," + itemrow + ")");
            }
            else if (lmt === null) {
                slink.innerHTML = res.SignUp();
                slink.setAttribute("onclick", "partui.signUp('" + eSignUpTitle + "'," + itemrow + ")");
                App.cache.left = null;
            }
            else if (App.cache.left===0) {
                seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
            }
      // }
    };
    var showSigningLinks = function (dh, lstid,y) {
        //how many
        var plimit=App.cache.limit;
        if (plimit !== null) {
            this.allowlist = context.get_web().get_lists().getById(lstid);

            context.load(this.allowlist);
            context.executeQueryAsync(
             Function.createDelegate(this, ceui.mitLim),
             Function.createDelegate(this, util.onFail)
         );
        }

        var signspan = document.createElement("span"); signspan.setAttribute(clAss, "addsignup");
        dh.appendChild(signspan); signspan.innerHTML = '<i class="fa fa-pencil-square-o fa-lg"></i>' + res.Attend();
        signspan.setAttribute("id", "s_" + lstid);
        signspan.setAttribute("onmouseenter", "ceui.shwhat('" + lstid + "'," + plimit + ");");
        var slinkspan = document.createElement("span"); slinkspan.setAttribute("class", "signuplinks");
        slinkspan.setAttribute("name", y);
        dh.appendChild(slinkspan); slinkspan.setAttribute("id", "linkh_" + lstid);
        //var slink = document.createElement("a"); slinkspan.appendChild(slink);
        //slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id", "link_" + lstid);
        
        var seats = document.createElement("div"); seats.setAttribute("class", "ceSeats");
        seats.setAttribute("id", "seats_" + lstid);
        dh.appendChild(seats);
    };
    
    var signInPart = function (dh, lstid, c) {
        //how many
        var plimit = arrLimit[c];
        var pL = parseInt(plimit);
        var seatsLeft = null;
        if (plimit !== null) {
            this.alist = context.get_web().get_lists().getById(lstid);
            context.load(this.alist);
            context.executeQueryAsync(
             function (sender, args) {
                 this.alist = context.get_web().get_lists().getById(lstid);
                 var pcount = this.alist.get_itemCount();
                 
                 var seats = document.getElementById("seats_" + lstid);
                 var pC = parseInt(pcount);
                
                 seatsLeft = pL - pC;
                 if (pL > pC) {
                     
                     seats.innerHTML = '<i class="fa fa-user-plus" title="' + res.SeatsLeft() + '" aria-hidden="true"></i> ' + seatsLeft; 
                     App.cache.left = seatsLeft;
                 } else {
                     seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
                     App.cache.left = 0;
                 }
                 if (pcount < plimit) {
                     App.cache.not = false;
                 } else {
                     App.cache.not = true;
                 }
             });
   
        }

        var signspan = document.createElement("span"); signspan.setAttribute(clAss, "addsignup");
        dh.appendChild(signspan); signspan.innerHTML = '<i class="fa fa-pencil-square-o fa-lg"></i>' + res.Attend();
        signspan.setAttribute("id", "s_" + lstid);
        signspan.setAttribute("onmouseenter", "ceui.shwhat('" + lstid + "'," + plimit + ");");
        var slinkspan = document.createElement("span"); slinkspan.setAttribute("class", "signuplinks");
        slinkspan.setAttribute("name", c);
        dh.appendChild(slinkspan); slinkspan.setAttribute("id", "linkh_" + lstid);
        //var slink = document.createElement("a"); slinkspan.appendChild(slink);
        //slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id", "link_" + lstid);
        var seats = document.createElement("div"); seats.setAttribute("class", "ceSeats");
        seats.setAttribute("id", "seats_" + lstid);
        dh.appendChild(seats);
    };
    var signInExt = function (dh, lstid,c) {
        //how many
        var plimit = arrLimit[c];
        
        if (plimit !== null) {
            var pL = parseInt(plimit);
            this.alist = context.get_web().get_lists().getById(lstid);
            context.load(this.alist);
            context.executeQueryAsync(
             function (sender, args) {
                 this.alist = context.get_web().get_lists().getById(lstid);
                 var pcount = this.alist.get_itemCount();
                 
                 var pC = parseInt(pcount);
                 var seats = document.getElementById("seatsx_" + lstid);
                 if (pL > pC) {
                     var seatsLeft = pL - pC;

                     seats.innerHTML = '<i class="fa fa-user-plus" title="' + res.SeatsLeft() + '" aria-hidden="true"></i> ' + seatsLeft;
                     App.cache.left = seatsLeft;
                 } else {
                     seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
                     App.cache.left = 0;
                 }
                 if (pcount < plimit) {
                     App.cache.not = false;
                 } else {
                     App.cache.not = true;
                 }
             });

        }

        var signspan = document.createElement("span"); signspan.setAttribute(clAss, "addsignup");
        dh.appendChild(signspan); signspan.innerHTML = '<i class="fa fa-pencil-square-o fa-lg"></i>' + res.Attend();
        signspan.setAttribute("id", "sx_" + lstid);
        signspan.setAttribute("onmouseenter", "ceui.shwhatx('" + lstid + "'," + plimit + ");");
        var slinkspan = document.createElement("span"); slinkspan.setAttribute("class", "signuplinks");
        slinkspan.setAttribute("name", c);
        dh.appendChild(slinkspan); slinkspan.setAttribute("id", "linkhx_" + lstid);
        //var slink = document.createElement("a"); slinkspan.appendChild(slink);
        //slink.setAttribute("class", "ceSignUpLink"); slink.setAttribute("id", "linkx_" + lstid);
        var seats = document.createElement("div"); seats.setAttribute("class", "ceSeats");
        seats.setAttribute("id", "seatsx_" + lstid);
        dh.appendChild(seats);
    };
    var getNumber = function (sender, args) {
       
        var peoplecount = this.allowlist.get_itemCount();
        
        var peopleLimit = App.cache.limit;
        //show that there is a limit and how many spaces left
        var placeHtml = document.getElementById("ceDisplayEvent");
        var seatsid = "seats_";
        var linkidx = "link_";
        if (App.cache.expanded) {
            seatsid = "seatsx_";
            var linkidx = "linkx_";
        }
        var seats = document.getElementById(seatsid + App.cache.listname);
       
        var pL = parseInt(peopleLimit);
        var pC = parseInt(peoplecount);
        
        var seatsLeft = pL - pC;
        if (pL > pC) {
            

            seats.innerHTML = '<i class="fa fa-user-plus" title="' + res.SeatsLeft() + '" aria-hidden="true"></i> ' + seatsLeft;
            App.cache.left = seatsLeft;
        } else {
            seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
            App.cache.left = 0;
        }
        if (peoplecount < peopleLimit) {
            App.cache.not = false;
        } else {
            App.cache.not = true;
        }
        
    };
    
    var shiowhatio = function (io,slimit) {
        App.cache.expanded = false;
        App.cache.limit = slimit;
        var doc = document.getElementById("linkh_" + io).innerHTML;
        
        if (doc === "") {         
            ceui.getSignUpCount(io, "linkh_");
        }
    };
    var shiowhatiox = function (io,xlimit) {
        App.cache.expanded = true;
        App.cache.limit = xlimit;
        var doc = document.getElementById("linkhx_" + io).innerHTML;
        if (doc === "") {
            ceui.getSignUpCount(io, "linkhx_");
        }
    };
    var outlookLink = function (div, eventcard, l) {
        context = new SP.ClientContext.get_current();
        var lender = vars.lendar();
        this.list = context.get_web().get_lists().getByTitle(lender);
        context.load(this.list);
        context.executeQueryAsync(function () {
            this.list = context.get_web().get_lists().getByTitle(lender);
            var listid = this.list.get_id();
            if (listid !== "") {
                var aspan = document.createElement("span"); aspan.setAttribute(clAss, "outlookspan");
                var appweburl = vars.SPAppWebUrl(); 
                if (appweburl === undefined) {
                    var locurl = location.href.split('/Lists');
                    appweburl = locurl[0];
                }
                aspan.innerHTML = '<i class="fa fa-calendar-times-o fa-lg"></i>' + res.AddToOutlook();
                var outUrl = appweburl + "/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List={" + listid + "}&CacheControl=1&ID=" + l + "&Using=event.ics";
                aspan.setAttribute("onclick", "window.open('" + outUrl + "','_parent','')"); div.appendChild(aspan);
            }
        });
    };
    var empty = function () {
        var placeholder = document.getElementById(p);
        placeholder.innerHTML = res.NoEventsAdmin();
    };
    var adminView = function (events) {
        var items = events.getEnumerator(); var placeholder = document.getElementById(p);
        var appweb = util.getProperty("SPAppWebUrl"); appweb = appweb.replace("#", "");
        while (items.moveNext()) {
            var event = items.get_current(); var eTitle = event.get_item("Title"); 
            var eStart = event.get_item("EventDate"); eStart = util.formatDateLocal(eStart); 
            var eSignUp = event.get_item("SignUp"); if (eSignUp === null) { eSignUp = ""; }
            var eId = event.get_item("ID");
            var eUrl = appweb + "/Lists/Calendar/Display.aspx?ID=" + eId + "&Source=" + appweb + "/Lists/Calendar/Calendar.aspx";
            var eLimit = event.get_item("Limit");
            var atitle = document.createElement(h); placeholder.appendChild(atitle);
            atitle.setAttribute(clAss, "atitle");
            var tlink = document.createElement("a"); tlink.setAttribute("target", "_blank");
            var r = ""; tlink.setAttribute("href", eUrl);
            atitle.appendChild(tlink); tlink.innerHTML = '<i class="fa fa-calendar" aria-hidden="true"></i> ' + eStart + "  " + eTitle;
            var SignUpTitle = event.get_item("SignUpTitle");
            
            if (eLimit !== null) {
                var numbers = document.createElement("div"); numbers.setAttribute("class", "numbers");
                placeholder.appendChild(numbers);
                numbers.innerHTML = res.Limit() + eLimit;
                var ups = document.createElement("div"); numbers.appendChild(ups);
                ups.setAttribute("id", "list_" + SignUpTitle);
                //how many are there
                coreapp.doListItemCount();
            }
            if (eSignUp !== "") {
                r = res.SignUp();
                var slink = document.createElement("a"); atitle.appendChild(slink); slink.innerHTML = '<i class="fa fa-list" aria-hidden="true"></i> ' + r;
                slink.setAttribute("href", eSignUp);
                
            }
        }
    };
    var calItem = function (y) {
        //recreate all app.cache for the item
        App.cache.left = null;
        $("#ceItem").show();
        $("#ce").addClass("left-pos");
        $("#ce").css("position", "absolute");
       
        $("#ceNext").hide();
        $("#ce").css("transform", "translateX(" + $(this).index() + 600 + "px)");
       
        var maindiv = document.getElementById("ceItem"); maindiv.innerHTML = "";
        var displayItem = document.createElement("div"); maindiv.appendChild(displayItem);
        displayItem.setAttribute("id", "ceDisplayEvent");

        var backBtn = document.createElement("div"); displayItem.appendChild(backBtn); backBtn.setAttribute("class", "ceBackBtn");
        backBtn.innerHTML = '<i class="fa fa-chevron-circle-left fa-2x" onclick="ceui.ceBack();" aria-hidden="true"></i>';
       
        var imageInfo = arrImage[y];
        if (imageInfo !== null) {
            var imageItem = document.createElement("div"); displayItem.appendChild(imageItem);
            imageItem.setAttribute("class", "eimage");
            var iI = new Image(); imageItem.appendChild(iI);
            iI.src = imageInfo;
        }
       
        var datediv = document.createElement("div"); displayItem.appendChild(datediv);
        datediv.setAttribute("class", "picdate");
        var startD = arrStart[y]; var endD = arrEnd[y];
        datediv.innerHTML = util.formatMonthDate(startD);
        var pictitle = document.createElement("div"); displayItem.appendChild(pictitle);
        pictitle.setAttribute("class", "pictitle"); pictitle.innerHTML = "<h2>" + arrTitle[y] + "</h2>";
        var timediv = document.createElement("div"); displayItem.appendChild(timediv);
        timediv.setAttribute("class", "timediv nl");
        var timeFormat = util.getProperty("Time");
        var starttime = util.formatAMPM(startD);
        var endtime=util.formatAMPM(endD)
        if (timeFormat === "false") {
            starttime = util.formatHoursDate(startD);
            endtime = util.formatHoursDate(endD);
        }
        timediv.innerHTML = util.formatMonthDate(startD) + " " + starttime + " - " + util.formatMonthDate(endD) + " " + endtime;
       

        var econtact = arrContact[y];
        if (econtact !== "") {
            var cnt = document.createElement("div"); displayItem.appendChild(cnt);
            cnt.setAttribute("class", "ceCnt"); cnt.innerHTML = res.Contact() + ": " + econtact;
        }
        var desc = arrDesc[y];
        if (desc !== "") {
            var dsc = document.createElement("div"); displayItem.appendChild(dsc);
            dsc.setAttribute("class", "picdesc");
            dsc.innerHTML = desc;
        }
        var picloc = arrLoc[y];
        if (picloc !== "") {
            var locdiv = document.createElement("div"); displayItem.appendChild(locdiv);
            locdiv.setAttribute("class", "picloc");
            locdiv.innerHTML = res.Location() + ": " + picloc;
        }
        var picdet = arrContent[y];
        if (picdet !== "") {
            var cdiv = document.createElement("div"); displayItem.appendChild(cdiv);
            cdiv.setAttribute("class", "picdet"); cdiv.innerHTML = picdet;
        }
        var controls = document.createElement("div"); controls.setAttribute(clAss, "controls nl");
        controls.setAttribute("name", "ctrl_" + y);
        displayItem.appendChild(controls);
        App.cache.limit = arrLimit[y];
        var id = arrId[y];
        var sGuid = arrSign[y];
        //ShowSignUp
        //ShowAdd
        //ShowAtt  
        
        var tendees = util.getProperty("ShowAtt");
        var outlk = util.getProperty("ShowAdd");
        var sgnup = util.getProperty("ShowSignUp");
        ceui.propsExpand(id, tendees, outlk, sgnup, sGuid, controls,y);
        var attachments = arrAtt[y];
        
        if (attachments) {
            partui.getAtt(id);
        }
        util.resize();
    };
    var getDisplayUrl = function (eId) {
        var appurl = vars.SPAppWebUrl();
        var eUrl = appurl + "/Lists/Calendar/Display.aspx?ID=" + eId; return eUrl;
        
    };
    var showCeAgain = function () {
        document.getElementById("ce").innerHTML = "";
        corepart.getItems();
        $("#ceItem").hide();
        $("#ce").css("transform", "translateX(" + "0" + "px)");
        $("#ce").css("position", "relative");
        $("#ceItem").css("position", "relative");
        $("#ceNext").show();
    };
    var resizeWS = function () {
        var senderId = vars.SenderId();
        var hosturl = vars.SPHostUrl();
        window.parent.postMessage('<message senderId=' + senderId + '>resize(' + ($(document).width()) + ',' + ($(document).height() + 50) + ')</message>', hosturl);
    };
    return{
        mitLim:getNumber,
        noEventsUI: noEvents,
        showEvents: dealEvents,
        showToday: todayView,
        getSignUpCount: peopleCount,
        showPictures: picturesView,
        showTile:tileView,
        showDefault: defaultView,
        props: appendTo,
        showattendees: attView,
        showattendeesExt: attViewExt,
        hidedees: deesHide,
        showdees: deesShow,
        hidedeesx: deesHidex,
        showdeesx: deesShowx,
        showThem: showDeeThem,
        showThemx: showDeeThemx,
        showSigning: showSigningLinks,
        shwhat: shiowhatio,
        shoUtlook: outlookLink,
        noEvents: empty,
        showAdminView: adminView,
        formatUrl: getDisplayUrl,
        resizeWSAppPart: resizeWS,
        doCancelLink: cancelLink,
        doSignLink: signLink,
        propsPart: appendToPart,
        showSigningPart: signInPart,
        showSigningExt: signInExt,
        showCalItem: calItem,
        ceBack: showCeAgain,
        propsExpand: appendToExpanded,
        shwhatx: shiowhatiox
    };
})();

