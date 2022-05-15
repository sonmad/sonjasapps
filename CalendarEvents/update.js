var update = (function () {
    var load = function () {
        var isUpdated = update.getUpdateStatus();
        if (isUpdated) {
            var ul = document.getElementById("navul");
            var li7 = document.createElement("li"); ul.appendChild(li7); var a7 = document.createElement("a");
            li7.appendChild(a7); a7.setAttribute("target", "_blank"); a7.setAttribute("href", "#");
            a7.setAttribute("id", "updatemessage"); a7.innerHTML = update.getUpdateLink();
            a7.setAttribute("title", "Update");
        }
    };
    var updateLink = function () {
        var updateIcon = '<span class="glyphicon glyphicon-bell" aria-hidden="true"></span>';
        return updateIcon;        
    };
    var status = function () {
        return false;
    };
    return {
        getUpdateLink: updateLink,
        getUpdateStatus: status,
        launch:load
    };
})();
update.launch();