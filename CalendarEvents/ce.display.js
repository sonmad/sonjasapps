var context; var App = {}; App.cache = {}; var there; var lendar = "Calendar"; var clAss = "class"; var loc = location.href.toLowerCase(); var my = "Mine"; $(document).ready(function () { partui.setSignUp(); });
var App = {}; App.cache = {};

var partui=(function () {
    var doSignUp = function () {
        var signupfield = $('input[title="Sign Up"]'); var signuptitle = $('input[title="Sign Up Title"]');
        
        var lUrl = signupfield.val();
        if (loc.indexOf("/display.aspx?") > -1) {
            var content = "";
            var sList = ""; var iId = vars.ID();
            context = new SP.ClientContext.get_current();
            this.list = context.get_web().get_lists().getByTitle(lendar);
            currentitem = this.list.getItemById(iId); context.load(currentitem);
            context.executeQueryAsync(Function.createDelegate(this, partui.onGotItem), Function.createDelegate(this, util.failToSP));
        }
    };
    var presentEventData = function (eventData) {
        var eventTitle = eventData.get_item('Title');
        var eventId = eventData.get_item('ID');
        var eventStart = eventData.get_item('EventDate');
        var es = util.formatMonthDate(eventStart);
        var esh = util.formatHoursDate(eventStart);
        var eventEnd = eventData.get_item('EndDate');
        var ee = util.formatMonthDate(eventEnd);
        var eeh = util.formatHoursDate(eventEnd);
        var c = "";
        var eventDesc = eventData.get_item('Description');
        var eventLoc = eventData.get_item('Location');
        var eventDetails = eventData.get_item('EventDetails');
        if (eventDetails === null) { eventDetails = ""; }
        var eventContact = eventData.get_item('Event_x0020_Contact');
        if (eventContact === null) { eventContact = ""; } else { eventContact = eventContact.get_lookupValue(); 
            c = "<div class='ceCnt'>" + res.Contact() + " " + eventContact + "</div>"; }
        var sul = eventData.get_item("SignUpTitle");
        App.cache.listname = sul;
        if (eventLoc === null) { eventLoc = ""; }
        var eventImage = eventData.get_item('Image');
        if (eventImage !== null) {
            eventImage = eventImage.get_url();
        }
        App.cache.limit = eventData.get_item("Limit");
        var pl = document.getElementById("ceDisplayEvent");
        var lholder = document.createElement("div");
        pl.appendChild(lholder); lholder.setAttribute("id", "lholder");
        lholder.innerHTML = App.cache.limit; lholder.setAttribute("style", "display:none");


        if (eventImage !== null) {
            var eimagediv = document.createElement("div"); pl.appendChild(eimagediv);
            eimagediv.setAttribute(clAss, "eimage");
            var eimage = new Image(); eimage.src = eventImage; eimagediv.appendChild(eimage);
        }
        var datediv = document.createElement("div"); datediv.setAttribute(clAss, "picdate");
        pl.appendChild(datediv); datediv.innerHTML = es;

        var eventtitlediv = document.createElement("div"); pl.appendChild(eventtitlediv);
        eventtitlediv.setAttribute(clAss, "pictitle");
        eventtitlediv.innerHTML = "<H2>" + eventTitle + "</H2>";
        var timediv = document.createElement("div"); pl.appendChild(timediv);
        timediv.setAttribute("class", "timediv nl"); timediv.innerHTML = es + " " + esh + " - " + ee + " " + eeh + " " + c;

        if (eventDesc !== "" && eventDesc!==null) {
            var descdiv = document.createElement("div"); descdiv.setAttribute(clAss, "picdesc");
            pl.appendChild(descdiv); descdiv.innerHTML = eventDesc;
        }
        if (eventLoc !== "") {
            var locdiv = document.createElement("div"); pl.appendChild(locdiv); locdiv.setAttribute(clAss, "picloc");
            var locstr = res.Location();
            locdiv.innerHTML = locstr + eventLoc;
        }
        if (eventDetails !== "") {
            var detdiv = document.createElement("div"); pl.appendChild(detdiv); detdiv.setAttribute(clAss, "picdet");
            detdiv.innerHTML = eventDetails;
        }
        
        var controls = document.createElement("div"); controls.setAttribute(clAss, "controls nl");
        pl.appendChild(controls);
        var d = "true";
        ceui.props(eventId, d, d, d, sul, controls);
        var hasAttachments = eventData.get_fieldValues()['Attachments'];
        if (hasAttachments) {
            partui.getAtt(eventId);
        }
        awatch.onl();
        awatch.onc(); 
    };
    var gotItem = function (sender, args) {
        var iId = vars.ID(); 
        var signupliste = currentitem.get_item('SignUpTitle');
        partui.presentItem(currentitem);
    };
    var idorName = function (e) {
        var h = e.split('-');
        if (h.length > 4) {
            this.signl = context.get_web().get_lists().getById(e);
        } else {
            this.signl = context.get_web().get_lists().getByTitle(e);
        }
        return this.signl;
    };
    var setupSign = function (signListName, irow) {
        context = new SP.ClientContext.get_current(); 
        this.signlist = partui.getName(signListName);
        //check if place
        var linkid = "link_";
        var seatsidx = "seats_";
        if (App.cache.expanded) {
            var linkid = "linkx_";
            var seatsidx = "seatsx_";
        }
        var slink = document.getElementById(linkid + signListName);
       
        var imitL = arrLimit[irow];

        var pageloc = location.href;
        if (pageloc.indexOf('Display.aspx?ID=') > -1) {
            var tL = document.getElementById("lholder").innerHTML;
            if (tL !== "null") {
                imitL = parseInt(tL);
            } else {
                imitL = null;
            }

        }

        
      
    
        App.cache.limit = imitL;
        if (App.cache.limit === "null") {
            App.cache.limit = null;
        }
        if (App.cache.limit !== null) {
            App.cache.left = parseInt(imitL) - App.cache.itemcount;
        }
       
       
        var avSeats = 0;
        if (App.cache.limit !== null) {
            partui.isAv(signListName);
        }
        else{
      
        var itemCreationInfo = new SP.ListItemCreationInformation();
        var newItem = this.signlist.addItem(itemCreationInfo);
        var user = context.get_web().get_currentUser(); context.load(user); context.executeQueryAsync(function () {
            var user = context.get_web().get_currentUser(); var currentuser = user.get_title();
            newItem.set_item("Title", currentuser); newItem.update();
            var linkid = "link_";
            var seatsidx = "seats_";
            if (App.cache.expanded) {
                var linkid = "linkx_";
                var seatsidx = "seatsx_";
            }
            var btnName = linkid + signListName;
            var cBtn = document.getElementById(btnName);
            cBtn.innerHTML = res.CancelSignUp();
            var slink = document.getElementById(linkid + signListName);
            ceui.doCancelLink(slink, signListName);
            App.cache.itemcount = App.cache.itemcount + 1;
            context.load(newItem); context.executeQueryAsync(function () {

            }, function () { util.onFail(); });
        });
    }
    };
    var isAvailable = function (listSignups) {
        var limitSetTo=parseInt(App.cache.limit);
        this.sl = partui.getName(listSignups);
        var l = limitSetTo + 2;
        var howMany = 0;
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><RowLimit>' + l + '</RowLimit></View>');
        var collListItem = this.sl.getItems(camlQuery);
        context.load(collListItem);
        context.executeQueryAsync(function (sender,args) {
            howMany = collListItem.get_count();
            if (howMany < limitSetTo) {
                var itemCreationInfo = new SP.ListItemCreationInformation();
                this.sl = partui.getName(listSignups);
              
                var newItem = this.sl.addItem(itemCreationInfo);
                var user = context.get_web().get_currentUser(); context.load(user); context.executeQueryAsync(function () {
                    var user = context.get_web().get_currentUser(); var currentuser = user.get_title();
                    newItem.set_item("Title", currentuser); newItem.update();
                    var liidx = "link_";
                    var seatsidx = "seats_";
                    if (App.cache.expanded) {
                        liidx = "linkx_";
                        var seatsidx = "seatsx_";
                    }
                    var btnName = liidx + listSignups;
                    var cBtn = document.getElementById(btnName);
                    cBtn.innerHTML = res.CancelSignUp();
                    var slink = document.getElementById(liidx + listSignups);
                    ceui.doCancelLink(slink, listSignups);
                    context.load(newItem); context.executeQueryAsync(function () {
                        //update no seats left text and app.cache
                        var seats = document.getElementById(seatsidx + listSignups);
                        if (seats !== null) {
                            var newSignupsNo = howMany + 1;
                            var nowLeft = limitSetTo - newSignupsNo;
                            App.cache.left = nowLeft;
                            if (nowLeft>0) {
                                seats.innerHTML = '<i class="fa fa-user-plus" title="' + res.SeatsLeft() + '" aria-hidden="true"></i> ' + nowLeft;
                            } else {
                                seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
                                App.cache.not = true;
                            }
                        }
                    }, function () { util.onFail(); });
                });
            } else {
                alert(res.Booked());
            }
        });
    };
    var deleteSignUp = function (signListName,irow) {
        var limitation= arrLimit[irow];
       
        context = new SP.ClientContext.get_current();
        this.signlist = partui.getName(signListName);
        var checkUserQuery = '<View><Query><Where><Eq><FieldRef Name="Author" /><Value Type="Integer"><UserID/></Value></Eq></Where></Query></View>';
        var pageloc = location.href;
        if (pageloc.indexOf('Display.aspx?ID=') <0) {
            App.cache.limit = limitation;
        }
       
        App.cache.listname = signListName;
        var query = new SP.CamlQuery(); query.set_viewXml(checkUserQuery); items = this.signlist.getItems(query);
        context.load(items, 'Include(ID)');
        context.executeQueryAsync(partui.onFindItemSuccess, util.onFail);
    };
    var findItemSuccess = function (sender, args) {
        var noItemsFound = items.get_count();
        App.cache.itemcount = noItemsFound;

        if (noItemsFound > 0) {

            var iitems = items.getEnumerator(); var itemid = "";
            while (iitems.moveNext()) { var usersignup = iitems.get_current(); itemid = usersignup.get_item("ID"); }
            usersignup.deleteObject();

            context.executeQueryAsync(function () {
                var linkidx = "link_";
                var seatsidx = "seats_";
                if (App.cache.expanded) {
                    linkidx = "linkx_";
                    seatsidx = "seatsx_";
                }
                var btnName = linkidx + App.cache.listname;
                var slink = document.getElementById(linkidx + App.cache.listname);
                // var imitL = irow;

                // var imitL = slink.getAttribute("name");

                App.cache.left = undefined;
                if (App.cache.limit === 1) {
                    App.cache.itemcount = App.cache.itemcount - 1;
                }

                if (App.cache.limit !== "null" || App.cache.limit !== null) {
                    App.cache.left = App.cache.limit - App.cache.itemcount;

                    //update number of seats and cache

                    var seats = document.getElementById(seatsidx + App.cache.listname);


                    if (seats !== null && App.cache.left !== undefined) {


                        if (App.cache.left > 0) {
                            seats.innerHTML = '<i class="fa fa-user-plus" title="' + res.SeatsLeft() + '" aria-hidden="true"></i> ' + App.cache.left;
                            App.cache.not = false;
                        } else if (App.cache.left === 0 && App.cache.limit !== null) {

                            seats.innerHTML = '<i class="fa fa-user-times" title="No seats left" aria-hidden="true"></i> ' + res.Booked();
                            App.cache.not = true;
                        }
                    }
                }
                ceui.doSignLink(slink, App.cache.listname, App.cache.limit);
            });
        }
    };
    var att = function (itemId) {
        var attachmentFolder = context.get_web().getFolderByServerRelativeUrl('Lists/Calendar/Attachments/' + itemId);
       var attachmentFiles = attachmentFolder.get_files();
       context.load(attachmentFiles);
       context.executeQueryAsync(function (sender, args) {
           var place = document.getElementById("ceDisplayEvent");
           var no = attachmentFiles.get_count();
           if (no > 0) {
               for (var f = 0; f < no; f++) {
                   var file=attachmentFiles.itemAt(f);
                   var aFileUrl = file.get_serverRelativeUrl();
                   var aFileName = file.get_name();
                  
                   place.innerHTML += '<br /><i class="fa fa-paperclip" aria-hidden="true"></i><a href="' + aFileUrl + '"> ' + aFileName + '</a>';
               }
           }
       });

    };
    return{
        setSignUp: doSignUp,
        onGotItem: gotItem,
        getName: idorName,
        signUp: setupSign,
        cancelSignUp: deleteSignUp,
        onFindItemSuccess: findItemSuccess,
        presentItem: presentEventData,
        getAtt: att,
        isAv:isAvailable
    };
})();

