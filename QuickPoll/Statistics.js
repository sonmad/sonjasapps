var listTitle = "QuickPolls"; var cq; var context; var App = {}; App.cache = {};
var qpstat = (function () {
    var getStatistics = function (question) {
        context = new SP.ClientContext.get_current(); this.answers = qpquery.getAnswersQuery(context, question);
        qpf.saveVarProps(question);
        context.load(this.answers, 'Include(qpAnswers, Answer)');
        context.executeQueryAsync(Function.createDelegate(this, onSuccessStat), Function.createDelegate(this, util.onFail));
    };
    var onSuccessStat = function (sender, args) {
        var aitems = this.answers.getEnumerator(); var noAnswers = this.answers.get_count(); if (noAnswers > 0) {
            var resultStr = "";
            var result = new Array(); var counter = 0; var noChoice = 0; var answertitle = ""; var temp = "";
            var attempt = 1;
            var rightAnswer = "";
            var qpQ = qpf.getQuestionProps();
            if (aitems !== null) {
                while (aitems.moveNext()) {
                    var item = aitems.get_current(); var qptitle = item.get_item("qpAnswers");
                    rightAnswer = item.get_item("Answer");
                    if (attempt === 1) { answertitle = qptitle; } if (answertitle === qptitle) {
                        counter += 1;
                        if (attempt === noAnswers) { result[noChoice] = answertitle + "|" + counter; }
                    } if (answertitle !== qptitle) {
                        result[noChoice] = answertitle + "|" + counter; noChoice += 1; counter = 1;
                        answertitle = qptitle; if (attempt === noAnswers) { result[noChoice] = answertitle + "|" + counter; }
                    } attempt += 1;
                } var appUrl = location.href; if (appUrl.indexOf("Stat=") > -1) {
                    stat = qpf.getsProperty("Stat"); stat = unescape(stat);
                    var psize = util.getProperty("PieSize"); if (psize === undefined) { psize = 200; }
                    App.cache.result = result;
                    App.cache.qpQ = qpQ;
                    App.cache.psize = psize;
                    switch (stat) {
                        case "IE8":
                            qpui.displayStatBarUI(qpQ, "Bar", result, noAnswers);
                            break;
                        case "Pie":
                            if (navigator.appVersion.indexOf('MSIE 8') > -1 || navigator.appVersion.indexOf('MSIE 7') > -1) {
                                qpui.displayStatBarUI(qpQ, "IE8", result, noAnswers);
                            }
                            else { qpui.displayStatPieUI(qpQ, result, noAnswers, rightAnswer); }
                            break;
                        case "Donut":                           
                            chart.loadDonut();
                            break;
                        case "Bar":
                            chart.loadBar();
                    }
                    
                }
            }
        }
    };
    var getAllStatistics = function () {
        context = new SP.ClientContext.get_current();
        this.allqs = qpquery.getAllStatQuery(context); context.load(this.allqs, 'Include(Title)');
        context.executeQueryAsync(Function.createDelegate(this, qpstat.onSucceededAllQ), Function.createDelegate(this, util.onFail));
    };
    var onSuccessAllQ = function (sender, args) {
        var qTitle = ""; var items = this.allqs.getEnumerator(); var noqs = this.allqs.get_count(); var allTitles = ""; var qTitleNow = ""; var i = 1; if (noqs > 0) {
            var resultStr = ""; var linkDiv = document.getElementById("qpAllStatTitles"); linkDiv.innerHTML = "";
            var navdiv = document.createElement("div"); navdiv.setAttribute("class", "air");
            while (items.moveNext()) {
                var item = items.get_current(); qTitle = item.get_item(title);
                var div = document.createElement("div"); div.setAttribute("id", i);
                var counterText = document.createElement("div"); counterText.setAttribute("id", "qpCounterText");
                counterText.setAttribute("class", "ms-webpart-titleText");
                counterText.innerHTML = res.qpResultA() + i + res.qpResultB() + noqs; div.appendChild(counterText);
                var qexpldiv = document.createElement("div");
                qexpldiv.setAttribute("id", "qexpl"); qexpldiv.innerHTML = res.StatQPQuestion();

                div.appendChild(qexpldiv);
                div.appendChild(navdiv);
                if (i === 1) { qTitleNow = qTitle; } if (i !== 1) {
                    var prev = document.createElement("a"); prev.setAttribute("href", "#"); prev.setAttribute("class", "rightair"); prev.setAttribute("onClick", "qpstat.prevQP(" + i + "," + noqs + ");");
                    prev.innerHTML = res.qpPrev(); qexpldiv.appendChild(prev);
                }
                if (i !== noqs) {
                    var next = document.createElement("a"); next.setAttribute("href", "#");
                    next.setAttribute("onClick", "qpstat.nextQP(" + i + "," + noqs + ");"); next.innerHTML = res.qpNext();
                    qexpldiv.appendChild(next);
                }
                var titleDiv = document.createElement("div");
                titleDiv.setAttribute("class", "ms-webpart-titleText");
                titleDiv.setAttribute("id", "currentQPTitle_" + i); titleDiv.setAttribute("class", "currenttitle");
                var listlink = "";
                if (App.cache.manage === "Yes") {
                    var appweburl = util.getProperty("SPAppWebUrl");
                    var listlink = "<a target='_parent' class='listlink' href='#' onclick='qpstat.gotolist(" + i + ");' title='List'><span class='glyphicon glyphicon-folder-close' aria-hidden='true'></span></a>";
                }

                titleDiv.innerHTML = unescape(qTitle);
                var ttdiv = document.createElement("div");
                ttdiv.setAttribute("class", "currenttitle");
                ttdiv.innerHTML = listlink;
                div.appendChild(ttdiv);

                div.appendChild(titleDiv);


                linkDiv.appendChild(div); $("#" + i).hide(); i += 1;
            } $("#1").show(); qpstat.displayStat(qTitleNow);
        } else { qpui.displayNoResultsUI(); }
    };
    var goToTheList = function (i) {
        cq = escape($("#currentQPTitle_" + i).html());
        context = new SP.ClientContext.get_current();
        var rlist = web.get_lists().getByTitle(cq);
        var rootFolder = rlist.get_rootFolder();
        context.load(rootFolder, 'ServerRelativeUrl');
        context.executeQueryAsync(function () {
            var rlist = web.get_lists().getByTitle(cq);
            var rootFolder = rlist.get_rootFolder();
            var lopen = rootFolder.get_serverRelativeUrl();
            window.open(lopen, "_parent", "");
        });
    };
    var nextQPoll = function (i, noqs) {
        var e = i; i = i + 1; var question = escape($("#currentQPTitle_" + i).html());
        if (i > noqs) { i = 1; } var titleId = "#" + i;
        var prevId = "#" + e; $(titleId).show();
        $(prevId).hide("slow"); qpstat.displayStat(question);
    };
    var prevQPoll = function (i, noqs) {
        var e = i; i = i - 1;
        var question = escape($("#currentQPTitle_" + i).html());
        if (i < 1) { i = noqs; } var titleId = "#" + i;
        var prevId = "#" + e; $(titleId).show(); $(prevId).hide("slow");
        qpstat.displayStat(question);
    };
    var displayStatistics = function (question) {
        context = new SP.ClientContext.get_current();
        $("#qpTemp").text(question);
        this.answers = qpquery.displayStatQuery(context, question);
        context.load(this.answers, 'Include(qpAnswers)');
        context.executeQueryAsync(Function.createDelegate(this, qpstat.onSucceededDisplay), Function.createDelegate(this, util.onFail));
    };
    var onSuccessDisplay = function (sender, args) {
        var aitems = this.answers.getEnumerator(); var noAnswers = this.answers.get_count();
        var question = $("#qpTemp").text(); if (noAnswers > 0) {
            var resultStr = ""; var result = new Array(); var counter = 0; var noChoice = 0;
            var answertitle = ""; var temp = ""; var attempt = 1; if (aitems !== null) {
                while (aitems.moveNext()) {
                    var item = aitems.get_current();
                    var qptitle = item.get_item("qpAnswers");
                    if (attempt === 1) { answertitle = qptitle; }
                    if (answertitle === qptitle) {
                        counter += 1;
                        if (attempt === noAnswers) { result[noChoice] = answertitle + "|" + counter; }
                    }
                    if (answertitle !== qptitle) {
                        result[noChoice] = answertitle + "|" + counter; noChoice += 1; counter = 1; answertitle = qptitle;
                        if (attempt === noAnswers) { result[noChoice] = answertitle + "|" + counter; }
                    }
                    attempt += 1;
                }
                qpui.displayAllStatBarUI(question, result, noAnswers);
            }
        } else { qpui.displayAllEmptyStatBarUI(question); }
    };
    return {
        getStat: getStatistics,
        onSucceededStat: onSuccessStat,
        getAllStat: getAllStatistics,
        onSucceededAllQ: onSuccessAllQ,
        gotolist: goToTheList,
        nextQP: nextQPoll,
        prevQP: prevQPoll,
        displayStat: displayStatistics,
        onSucceededDisplay: onSuccessDisplay
    };
})();

