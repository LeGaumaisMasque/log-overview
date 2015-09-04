function fetchThenDisplay() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'),function(c,q) {
        var i = q.split('=');
        if (i && i.length == 2)
            queries[i[0].toString()] = i[1].toString();
    });

    var file = queries['file']
    if (!file)
        window.location.href = "./selection.html";
    else
        fetch(file).done(function(data) { display(data, summary(data)); });
}


function fetch(file) {
    return $.getJSON("/analyze?file=" + encodeURIComponent(file))
        .fail(function() { window.alert("Can't analyze " + file); });
}
