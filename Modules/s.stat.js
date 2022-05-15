var alist = "awatch"; var context; var clickHours = []; var hitHours = []; var clickHrefs = {}; var userHits = {}; var userClicks = {}; var clickTxt = {};
var App = {}; App.cache = {};
var displayViewsQuery = '<View><Query><Where><And><Eq><FieldRef Name="Modified" /><Value Type="DateTime"><Today /></Value></Eq><Eq><FieldRef Name="Title" /><Value Type="Text">view</Value></Eq></And></Where><OrderBy><FieldRef Name="Editor" Ascending="True"/></OrderBy></Query></View>';
var displayClicksQuery = '<View><Query><Where><And><Eq><FieldRef Name="Modified" /><Value Type="DateTime"><Today /></Value></Eq><Eq><FieldRef Name="Title" /><Value Type="Text">click</Value></Eq></And></Where><OrderBy><FieldRef Name="Editor" Ascending="True"/></OrderBy></Query></View>';
var hourValues = ["12 AM","1 AM","2 AM","3 AM","4 AM","5 AM","6 AM","7 AM","8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM","11 PM"];
//query to display only views
//google charts
//https://developers.google.com/chart/interactive/docs/gallery
var astat = (function () {
    var views = function () {
        context = SP.ClientContext.get_current();
        var awlist = context.get_web().get_lists().getByTitle(alist);
        var camlQuery = new SP.CamlQuery(); camlQuery.set_viewXml(displayViewsQuery);
        viewItems = awlist.getItems(camlQuery);
        context.load(viewItems, 'Include(Title,Wq,Xyz,Cvbn,Modified,Editor)');
        context.executeQueryAsync(astat.gotViews, onFail);
    };
    var clicks = function () {
        //context = SP.ClientContext.get_current();
        
        var aclist = context.get_web().get_lists().getByTitle(alist);
        var camlQuery = new SP.CamlQuery(); camlQuery.set_viewXml(displayClicksQuery);
        clickItems = aclist.getItems(camlQuery);
        context.load(clickItems, 'Include(Title,Wq,Xyz,Cvbn,Modified,Editor)');
        context.executeQueryAsync(astat.gotClicks, onFail);
    };
    var viewsData = function (sender, args) {
        var viewsCount = viewItems.get_count();
        App.cache.views = viewsCount;
        var viewDiv = document.getElementById("hits");
        viewDiv.innerHTML = "<h4>" + resources.Today() + "</h4><h1>" + viewsCount + "</h1>";
       
        //users
        if (viewsCount > 0) {
            
            var eitems = viewItems.getEnumerator();
            var cuser = "";
            var userCount = 0;
            var sameUser = 0;
            while (eitems.moveNext()) {
                var hval = 0;
                var item = eitems.get_current();
                var currentUser = item.get_item("Editor").get_lookupValue();
               
                if (currentUser !== cuser) {
                    cuser = currentUser;
                    userCount += 1;
                    sameUser = 1;
                    
                }
                else {
                    sameUser += 1;
                    
                }
                userHits[cuser] = sameUser;
                var viewTime = item.get_item("Modified");
                var vt = new Date(viewTime);
                var vth = vt.getHours();
                if (hitHours[vth] === undefined) {
                    hitHours[vth] = hval + 1;
                } else {
                    hitHours[vth] += 1;
                }
                               
            }
           
            astat.uiHours(hitHours);
            astat.uiUsers(userHits);
            document.getElementById("users").innerHTML = "<h4>" + resources.Today() + "</h4><h1>" + userCount + "</h1>";
            astat.getClicks();
        }
        
    };
    var clickData = function (sender, args) {
        var clickCount = clickItems.get_count();
        App.cache.clicks = clickCount;
    
        var clickDiv = document.getElementById("eng");
        clickDiv.innerHTML = "<h4>" + resources.Today() + "</h4><h1>" + clickCount + "</h1>";
        
        if (clickCount > 0) {
            
            var citems = clickItems.getEnumerator();
            var cluser = "";
            var cuserCount = 0;
            var sameCUser = 0;
            var coNo = 0;
            var apploc = location.href;
            while (citems.moveNext()) {
                var chval = 0;
                var citem = citems.get_current();
                var currUser = citem.get_item("Editor").get_lookupValue();
                var currContent = citem.get_item("Xyz");              
                var currUrl = citem.get_item("Cvbn");
                
               
                if (currUrl !== "undefined" && currUrl !== null) {
                    if (apploc.indexOf('SimpleNews') > -1) {
                        clickTxt[currContent] = citem.get_item("Xyz");
                    } else {
                        if (currUrl.indexOf('#') > -1) {
                            var cu = currUrl.split('#');
                            if (cu.length > 1) {
                                currUrl = cu[1];
                            }
                        }

                        //calev                  
                        if (apploc.indexOf('CalendarEvents') < 0) {
                            currContent = currUrl;
                        }
                       

                        clickTxt[currContent] = citem.get_item("Xyz");
                    }
                
                } else {
                    clickTxt[currContent] = "";
                }
               
               
                if (clickHrefs[currContent] === undefined) {
                    clickHrefs[currContent] = 1;                   
                }else{
                    var t = clickHrefs[currContent];
                    clickHrefs[currContent] = t+1;
                }
                
                if (currUser !== cluser) {
                    cluser = currUser;
                    cuserCount += 1;
                    sameCUser = 1;
                }
                else {
                    sameCUser += 1;

                }
                userClicks[currUser] = sameCUser;
                var clickTime = citem.get_item("Modified");
                var ct = new Date(clickTime);
                var cth = ct.getHours();
                if (clickHours[cth] === undefined) {
                    clickHours[cth] = chval + 1;
                } else {
                    clickHours[cth] += 1;
                }
               

            }
            
            astat.uiClickHours(clickHours);
            astat.uiClickUsers(userClicks);
            astat.uiContent(clickHrefs);
            document.getElementById("engus").innerHTML = "<h4>" + resources.Today() + "</h4><h1>" + cuserCount + "</h1>";
        }

    };
    var allowWrite = function (listname) {
    context = SP.ClientContext.get_current();
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
                            var list = context.get_web().get_lists().getByTitle(listname);
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
    var uiU = function (uh) {
        var usershitlist = document.getElementById("userschart");
        astat.uiEngCount(usershitlist, uh);
       
    };
    var uiH = function (hHits) {
        var hitsBlock = document.getElementById("hitschart");
        astat.uiCountChart(hitsBlock, hHits,App.cache.views);
    };
    var uiCH = function (clickh) {
        var clickBlock = document.getElementById("engchart");
        astat.uiCountChart(clickBlock, clickh,App.cache.clicks);
    };
    var uiCU = function (clicku) {
        var clickUserBlock = document.getElementById("enguschart");
        astat.uiEngCount(clickUserBlock, clicku);
    };
    var uiEC = function (eblock, eArr) {
        var th = document.createElement("div"); eblock.appendChild(th);
        th.innerHTML = '<div class="ulabel fl"><h4>User Name</h4></div><div class="fl"><h4>' + resources.Count() + '</h4></div>';
        for (var k in eArr) {
            eblock.innerHTML += "<div class='ulabel'>" + k + "</div><div class='uval'>" + eArr[k] + "</div>";
        }
    };
    var uiCC = function (block, arr,total) {
        var th = document.createElement("div"); block.appendChild(th);
        th.innerHTML = '<div class="rlbl fl"><h4>' + resources.Time() + '</h4></div><div class="fl"><h4>' + resources.Count() + '</h4></div>';
        
        for (var b in arr) {
            var hitResult = document.createElement("div"); block.appendChild(hitResult);
            hitResult.setAttribute("class", "hitr");
            var rLbl = document.createElement("div"); hitResult.appendChild(rLbl);
            rLbl.setAttribute("class", "rlbl fl");
            rLbl.innerHTML = hourValues[b];

            var rVal = document.createElement("div"); hitResult.appendChild(rVal);
            var noHits = arr[b];
        
            var divW = parseInt(noHits) / total*60;
            divW = parseInt(divW);
            
            rVal.setAttribute("class", "rval fl"); rVal.innerHTML = ".";
            rVal.setAttribute("style", "width:" + divW + "%;");
            var rNo = document.createElement("div"); hitResult.appendChild(rNo);
            rNo.setAttribute("class", "rno fl");
            rNo.innerHTML = noHits;
        }
    };
    var uiCo = function (coArr) {
        
        var clickUserBlock = document.getElementById("engCnt");
        var th = document.createElement("div"); clickUserBlock.appendChild(th);
        th.innerHTML = '<div class="elbl fl"><h4>URL</h4></div><div class="fl"><h4>' + resources.Count() +  '</h4></div>';
        
        var eng = App.cache.clicks;
        
        for (var c in coArr) {
            
            var hitResult = document.createElement("div"); clickUserBlock.appendChild(hitResult);
            hitResult.setAttribute("class", "hitr");
            var rLbl = document.createElement("div"); hitResult.appendChild(rLbl);
            rLbl.setAttribute("class", "elbl fl");
            var clickurl = clickTxt[c];
            if (clickurl === null) {
                clickurl = "";
            }
            
            var linkcL = c.split("#");
            var linkc = linkcL[0];
            if (linkcL.length > 1) {
                linkc = linkcL[1];
                
            }
            
            var wholec = linkc + " " + clickurl;
            if (linkc === "ceItem") {
                linkc = "";
            }
            var apploc = location.href;
            var tipc = clickurl + " \n" + linkc;
            if (apploc.indexOf('SimpleNews') > -1) {
                tipc = "News item";
            }

            if (apploc.indexOf('CalendarEvents') > -1 ) {
                tipc = clickurl;
            }
            rLbl.setAttribute("title", tipc);
          
            
            var cLbl = c;
            if (linkcL.length > 1) {
                cLbl = wholec;
            }
            
            if (cLbl.length > 40) {
                cLbl = cLbl.substring(0, 40) + "...";
            }
            
            if (cLbl === "ceItem") {
                cLbl = clickurl;
            }
            
            if (apploc.indexOf('CalendarEvents') > -1) {
                rLbl.innerHTML = cLbl;
            
            } else if (apploc.indexOf('SimpleNews') > -1) {
                if (clickurl.length > 40) {
                    clickurl = clickurl.substring(0, 40) + "...";
                }
                rLbl.innerHTML = clickurl;
            }
            else if (apploc.indexOf('QuickPoll') > -1){
                rLbl.innerHTML = cLbl;
            }
            
            else if (apploc.indexOf('ConnectWithUs') > -1 && cLbl == "slideshow") {
                
                rLbl.innerHTML = cLbl;
            }
            else {
                rLbl.innerHTML = '<a target="_blank" href="' + linkc + '">' + cLbl + '</a>';
            }
           


            var rVal = document.createElement("div"); hitResult.appendChild(rVal);
            var noHits = coArr[c];

            var divW = parseInt(noHits) / eng * 60;
            divW = parseInt(divW);
            
            rVal.setAttribute("class", "rval fl"); rVal.innerHTML = ".";
            rVal.setAttribute("style", "width:" + divW + "%;");
            var rNo = document.createElement("div"); hitResult.appendChild(rNo);
            rNo.setAttribute("class", "rno fl");
            rNo.innerHTML = noHits;
        }
    };
return {
    watch: allowWrite,
    getViews: views,
    gotViews: viewsData,
    gotClicks: clickData,
    getClicks: clicks,
    uiUsers: uiU,
    uiHours: uiH,
    uiClickHours: uiCH,
    uiCountChart: uiCC,
    uiEngCount: uiEC,
    uiClickUsers: uiCU,
    uiContent:uiCo
};
})();

function onFail(sender, args) {
    console.info(args.get_message());
}