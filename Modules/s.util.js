

var context; var mem = {}; mem.cache = {};
var util = (function () {
    var onError = function (sender, args) {
        var m = args.get_message();
        var s = args.get_stackTrace();
        var context = SP.ClientContext.get_current();
        var user = context.get_web().get_currentUser();
        context.load(user); context.executeQueryAsync(function (sender, args) {
            var user = context.get_web().get_currentUser(); var email = user.get_email(); var name = user.get_title();
            name = encodeURI(name);
            var hostweburl = util.getProperty("SPHostUrl"); var appweburl = util.getProperty("SPAppWebUrl");
            $("#emessage").html("Error: " + m + '\n' + s + '\n' + 'Click <a class="btn btn-danger btn-xs" href="http://drizzzle.azurewebsites.net/home/errors?message=' + m + '&trace=' + s + '&site=' + hostweburl + '&app=' + appweburl + '&name=' + name + '&email=' + email + '" target="_blank">here</a> to report this error to SONJAsAPPS');
            util.logToSP(context, args.get_message());
        });
    };
    var monthDateTime = function (timestamp) {
        //IE 11 fix
        //2017-02-12T22:53:36+0000
        var evdate = String(timestamp);

        if (navigator.appName === 'Microsoft Internet Explorer') {
            //new Date("2012-11-02T19:30:00.000Z");
            //new Date(2012, 11, 2, 19, 30, 0)
            evdate = evdate.replace("+0000", "");
            evdate = evdate.replace(/-/, ",");
            evdate = evdate.replace(/:/, ",");

        }
        if (navigator.appVersion.indexOf('MSIE 8') > -1 || navigator.appVersion.indexOf('MSIE 7') > -1) {
            timestamp = evdate.substring(0, 10);
        }
        else {
            timestamp = timestamp.replace("+0000", "+0100"); var rdate = new Date(timestamp);
            var q = rdate.toLocaleDateString();
            var month = rdate.getMonth();

            var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var m = mlist[month];
            var hours = util.formatAMPM(rdate);
            timestamp = m + ", " + q + " " + hours;
        } return timestamp;
    };
    var AMPM = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };
    var failToConsole = function (sender, args) {
        var m = args.get_message();
        var s = args.get_stackTrace();
        var message = "Error: " + m + " Stack trace: " + s;
        console.info(message);
        util.logToSP(context, message);

    };
    var logToSharePoint = function (context, message) {
        SP.Utilities.Utility.logCustomAppError(context, message); context.executeQueryAsync();
    };
    var getPropertyValue = function (pName) {
        var url = unescape(location.href); var link = ""; if (url.indexOf(pName + "=") > -1 && url.indexOf(pName + "=&") === -1) { link = ""; link = url.substring(url.indexOf(pName + "=")); link = link.replace(pName + "=", ""); var linkL = link.split('&'); link = linkL[0]; return unescape(link); }
    };
    var formatToLocalDate = function (eDate) {
        var evdate = String(eDate); if (navigator.appVersion.indexOf('MSIE 8') > -1 || navigator.appVersion.indexOf('MSIE 7') > -1) { eDate = evdate.substring(0, 10); }
        else { eDate = evdate.replace("+0000", "+0100"); var rdate = new Date(eDate); eDate = rdate.toLocaleDateString(); } return eDate;
    };
    var formatMMDD = function (eDate) {
       // console.info("eDate: " + eDate);
        var evdate = String(eDate); if (vars.IE8() > -1 || vars.IE7() > -1) {
            eDate = evdate.substring(0, 10);
        }
        else {
            eDate = evdate.replace("+0000", "+0100"); var rdate = new Date(eDate);
            var q = rdate.getMonth();
            var m = res.Month(q);
            eDate = m + " " + rdate.getDate();
        } return eDate;
    };
    var formatHHDate = function (eDate) {
        var evdate = String(eDate); if (vars.IE8() > -1 || vars.IE7() > -1) {
            eDate = evdate.substring(0, 10);
        }
        else {
            eDate = evdate.replace("+0000", "+0100"); var rdate = new Date(eDate);
            var hour = rdate.getHours();
            var minute = rdate.getMinutes(); var min = minute.toString();
            if (min.length < 2) { min = "0" + min; }
            eDate = hour + ":" + min;
        } return eDate;
    };
    var resizeAppPart = function () {

        var senderId = util.getProperty("SenderId"); var hosturl = util.getProperty("SPHostUrl");

        window.parent.postMessage('<message senderId=' + senderId + '>resize(' + ($(document).width()) + ',' + ($(document).height()) + ')</message>', hosturl);

    };
    var resizePlus20 = function () {

        var senderId = util.getProperty("SenderId"); var hosturl = util.getProperty("SPHostUrl");

        window.parent.postMessage('<message senderId=' + senderId + '>resize(' + ($(document).width() + 20) + ',' + ($(document).height() + 20) + ')</message>', hosturl);
    };
    var resizeAdPart = function () {

        var senderId = util.getProperty("SenderId"); var hosturl = util.getProperty("SPHostUrl");

        window.parent.postMessage('<message senderId=' + senderId + '>resize(' + ($(document).width() + 30) + ',' + ($(document).height() + 30) + ')</message>', hosturl);
    };
    var setWhatsNew = function () {
        var hostweburl = util.getProperty("SPHostUrl");
        var appurl = util.getProperty("SPAppWebUrl");
        document.getElementById("whats").setAttribute("href", "http://www.sonjasapps.com/Home/New?url=" + hostweburl + "&app=" + appurl);

    };
    var outornot = function (kind) {
        mem.cache.kind = kind;
        var hosturl = util.getProperty("SPHostUrl");
        var hosturlL = hosturl.split('/');
        var siteUrl = hosturlL[2];
        siteUrl = siteUrl.replace(/\./g, '');
        var appurl = util.getProperty("SPAppWebUrl");
        var appSiteL = appurl.split('/');

        var getUrl = "https://sfactory.azurewebsites.net/api/Lites/" + siteUrl;

        $.ajax({
            url: getUrl,
            method: "GET",
            headers: {
                "ACCEPT": "application/json;odata=verbose",
                "Access-Control-Allow-Origin": "*"
            },
            success: util.onGetSuccess,
            error: util.getError
        });
    };
    var getSuccess = function (data) {
        var whtugot = data;

        var loc = location.href.toLowerCase();
        if (whtugot.indexOf('Internal Server Error') > -1 && loc.indexOf('default.aspx?') === -1) {
            
            document.getElementsByTagName("body")[0].innerHTML = "You did not sign up for a free one-month trial. Open Site Contents and click on the add-in (app).";
        } else {
           

            if (data.length === 0) {
                if (mem.cache.kind) {
                    modal.deliver();
                    about.launch();
                    notSigned();
                } else {
                    document.getElementsByTagName("body")[0].innerHTML = "You did not sign up for a free one-month trial. Open Site Contents and click on the add-in (app).";
                }
            }
            if (data !== null) {
                var appurl = util.getProperty("SPAppWebUrl");
                var appSiteL = appurl.split('/');
                var appName = appSiteL[appSiteL.length - 1];
                if (appName.indexOf('#') > -1) {
                    appName = appName.replace("#", "");
                }
                var match = false;
                var timestamp = "";
                var xfactor = "";
                $.each(data, function (index, item) {
                    var currentApp = item.liteApp;

                    if (currentApp === appName && !match) {
                        xfactor = item.x;
                        match = true;
                        timestamp = item.liteDate;
                    }

                });

                if (match) {
                    if (xfactor === "ad") {
                        doad();
                        
                    } else {


                        var today = new Date();
                        var appDate = new Date(timestamp);
                        var aNo = appDate.getTime(); var tNo = today.getTime();
                        var diff = (tNo - aNo) / (1000 * 3600 * 24);
                        if (diff > 30) {
                            
                            if (mem.cache.kind) {
                                upgrade.show();
                               
                                //expensecam part();
                            } else {
                               //  part();
                                // cwu 7.0.1.0
                              //  <link href='https://spfxcloud.azureedge.net/spfxcloud/core/white.s.min.css' rel='stylesheet' />
                                var prchs = "" +
                                    "<div class='prchsdiv'><img src='../Images/SONJASAPPS_Lite.jpg' alt='SONJASAPPS ConnectWithUs' width='280' height='210' />" +
                                    "<div class='prices'>" +
                                    "<b>$239.99</b> <a style='color:#c00000' href='https://store.office.com/en-us/app.aspx?assetid=WA104380416' target='_blank' title='Office Store'>Office Store</a>" +
                                    "</div><br /><div class='prices'><b>$199.99</b> <a style='color:#c00000' target='_blank' href='https://sonjasapps.myshopify.com/products/connect-with-us'>SONJASAPPS Store</a>" +
                                    "</div><div class='prices'><a target='_blank' style='color:#FFF;' class='btn okbtn' href='https://sonjasapps.myshopify.com/products/connect-with-us'>BUY NOW</a></div></div>" +
                                    "<h2>OR</h2>" +
                                    "<div>Continue for free with an ad in the bottom</div>" +
                                    "<div class='buyad'>Yes, I want to continue with ads - Send email to dev@sonjasapps.com</div>";

                                document.getElementsByTagName("body")[0].innerHTML = "Your trial has expired.<br />" + prchs;
                                util.resize();
                              
                            }
                        } else {
                            //cwu trial message
                           // document.getElementsByTagName("body")[0].innerHTML += "30 day trial version";
                          //  $('body').prepend('<style>a,a:visited{color:#333;display:block;text-decoration:none;visibility:visible;font-size:0.9em;font-family:Segoe UI,sans-serif;}</style><div Style="width:200px;display:block;visibility:visible;font-size:0.9em;color:#333;background-color:#fff;padding:10px;" id="cwutr"><a target="_blank" href="http://www.sonjasapps.com/home/connectwithus"><span style="margin-right:5px;" class="icon-sonjasapps_brand"></span>30 day free trial<a/></div>');
                          //  util.resize();
                        }

                    }
                } else {
                    if (mem.cache.kind) {
                        modal.deliver();
                        about.launch();
                        // notSigned();
                        
                    } else {
                       
                        document.getElementsByTagName("body")[0].innerHTML = "You did not sign up for a free one-month trial. Open Site Contents and click on the add-in (app).";
                    }


                }


            }
        }
        
    };

    var countDays = function (appDate) {

    };
    var onError = function (err) {
       
        console.info(err);
       
    }
    var customCSS = function () {
        var css = util.getProperty("CustomCSS");
        if (css !== undefined) {
            document.getElementById("ccss").href = css;
        }
    };
    var updateAds = function () {
        alert("ads please");
    };
    return {
        onFail: onError,
        logToSP: logToSharePoint,
        failToSP: failToConsole,
        getProperty: getPropertyValue,
        formatMonthDate: formatMMDD,
        formatHoursDate: formatHHDate,
        formatDateLocal: formatToLocalDate,
        resize: resizeAppPart,
        resizeAd: resizeAdPart,
        setWhats: setWhatsNew,
        lite: outornot,
        dayCounter: countDays,
        insertCustomCSS: customCSS,
        onGetSuccess: getSuccess,
        getError: onError,
        formatAMPM: AMPM,
        formatMonthDateTime: monthDateTime,
        resize20: resizePlus20,
        goads: updateAds
    };
})();

function setWhatsNew() {
    var hostweburl = util.getProperty("SPHostUrl");
    var appurl = util.getProperty("SPAppWebUrl");
    document.getElementById("whats").setAttribute("href", "http://www.sonjasapps.com/Home/New?url=" + hostweburl + "&app=" + appurl);
}

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-83904582-1', 'auto');
ga('send', 'pageview');


function doad() {
    
    var body = document.getElementsByTagName("body")[0];
    var addiv = document.createElement("div"); body.appendChild(addiv);
    //var docH = ($(document).height() + 30);
    //adsense
   // addiv.setAttribute("style", "width:300px;height:250px;overflow:hidden;margin-top:15px;");
   // var s1 = document.createElement("script"); addiv.appendChild(s1);
   // s1.setAttribute("async", "");
   // s1.setAttribute("src", "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
   //// s1.setAttribute("src", "https://localhost:44391/Scripts/ConnectWithUs/ad.js");
   // var ins = document.createElement("ins"); addiv.appendChild(ins);
   // ins.setAttribute("class", "adsbygoogle"); ins.setAttribute("style", "display:inline-block;width:300px;height:250px");
   // ins.setAttribute("data-ad-client", "ca-pub-0068769237761347");
   // ins.setAttribute("data-ad-slot", "4437451005");
   // (adsbygoogle = window.adsbygoogle || []).push({});

    //placeanad
    var linkad = "javascript:window.open('http://www.sonjasapps.com/home/advertise','_blank','');";
    addiv.setAttribute("style", "width:80%;position:absolute;bottom:0;background-color:#fff;color:#c00000;border:5px dashed #c00000;margin-top:20px;padding:15px;font-family:Consolas,Arial,Verdana,sans-serif;cursor:pointer;");
    addiv.setAttribute("onclick", linkad);

    addiv.innerHTML = "<h2>Place an ad</h2><div><b style='font-size:0.9em;font-family:Arial;'>Everywhere I go</b></div>";
    var wloc = location.href;
    if (wloc.indexOf('TwitterAppPart.aspx') === -1 && wloc.indexOf('Default.aspx') === -1) {
        util.resizeAd();
    }
    
}
function daod() { }

