var menu = (function () {
    var launchMenu = function () {
        var p = document.getElementById("nav");
        var nav = document.createElement("nav"); nav.setAttribute("class", "navbar navbar-default"); p.appendChild(nav);
        var cont = document.createElement("div"); cont.setAttribute("class", "container-fluid"); nav.appendChild(cont);
        var nheader = document.createElement("div"); nheader.setAttribute("class", "navbar-header"); cont.appendChild(nheader);
        var button = document.createElement("button"); button.setAttribute("class", "navbar-toggle collapsed");
        button.setAttribute("type", "button"); button.setAttribute("data-toggle", "collapse"); nheader.appendChild(button);
        button.setAttribute("data-target", "#s-nav");
        button.innerHTML = '<span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>';
        var brand = document.createElement("a"); brand.setAttribute("class", "navbar-brand"); brand.setAttribute("target", "_blank");
        brand.setAttribute("title", "SONJASAPPS"); brand.setAttribute("href", "http://www.sonjasapps.com"); nheader.appendChild(brand);
        var logo = new Image(); logo.alt = "SONJASAPPS"; logo.width = "20"; logo.src = "../Images/SONJASAPPS_Brand30x30.png"; brand.appendChild(logo);
        var navbar = document.createElement("div"); navbar.setAttribute("class", "collapse navbar-collapse"); cont.appendChild(navbar);
        navbar.setAttribute("id", "s-navbar");
        var ul = document.createElement("ul"); ul.setAttribute("class", "nav navbar-nav"); navbar.appendChild(ul); ul.setAttribute("id", "navul");
        var li1 = document.createElement("li"); ul.appendChild(li1);
        var menuloc = location.href; menuloc = menuloc.replace("#", "");
        var a1 = document.createElement("a"); a1.setAttribute("id", "main"); a1.setAttribute("href", menuloc);
        li1.appendChild(a1); a1.innerHTML = "QuickPoll";
      //  var currentspan = document.createElement("span"); a1.appendChild(currentspan);

        var liw = document.createElement("li"); ul.appendChild(liw);
        var aw = document.createElement("a"); aw.setAttribute("id", "awatchmenu");
        var wloc = menuloc.replace("Default.aspx", "Analytics.aspx");
        aw.setAttribute("href", wloc); aw.innerHTML = '<span class="glyphicon glyphicon-record" aria-hidden="true"></span> ' + resources.Analytics();
        liw.appendChild(aw); aw.setAttribute("title", "Analytics");

        if (menuloc.indexOf('Default.aspx') > -1) {
            a1.setAttribute("href", menuloc);
            var currentspan = document.createElement("span"); a1.appendChild(currentspan);
            currentspan.setAttribute("class", "sr-only"); currentspan.innerHTML = "(current)";
            $("#main").parent("li").addClass("active");
        } else {
            var dloc = menuloc.replace("Analytics", "Default");
            a1.setAttribute("href", dloc);
            var currentspan = document.createElement("span"); aw.appendChild(currentspan);
            currentspan.setAttribute("class", "sr-only"); currentspan.innerHTML = "(current)";
            $("#awatchmenu").parent("li").addClass("active");
        }
        var li4 = document.createElement("li"); ul.appendChild(li4);
        var a4 = document.createElement("a"); a4.setAttribute("id", "support"); a4.setAttribute("target", "_blank");
        a4.setAttribute("href", "http://www.sonjasapps.com/Home/QuickPoll"); a4.innerHTML = resources.UserGuide();
        li4.appendChild(a4); a4.setAttribute("title", resources.UserGuide());
        var li5 = document.createElement("li"); ul.appendChild(li5);
        var a5 = document.createElement("a"); li5.appendChild(a5); a5.setAttribute("id", "EULA"); a5.setAttribute("style", "cursor:pointer");
        a5.setAttribute("data-toggle", "modal"); a5.setAttribute("data-target", "#EModal"); a5.innerHTML = "EULA";
        var li6 = document.createElement("li"); ul.appendChild(li6); var a6 = document.createElement("a");
        li6.appendChild(a6); a6.setAttribute("target", "_blank"); a6.setAttribute("href", "#");
        a6.setAttribute("id", "whats"); a6.innerHTML = resources.News(); a6.setAttribute("title", resources.News());
        
    };
    return {
        launch: launchMenu
      
    };
})();
menu.launch();