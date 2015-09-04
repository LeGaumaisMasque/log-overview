function displayTree() {
    var queries = {};
    $.each(document.location.search.substr(1).split('&'), function (c, q) {
        var i = q.split('=');
        if (i && i.length == 2)
            queries[i[0].toString()] = i[1].toString();
    });

    function getTree() {
        return $('#file-tree').jstree(true);
    }

    function getFile(node) {
        var file = '/';
        if (node.id != '#') {
            var elements = node.parents.filter(function(e) { return e !== "#" })
                .map(function (id) { return getTree().get_node(id).text; });
            elements.reverse().push(node.text);
            file = '/' + elements.join('/');
        }
        return file;
    }

    $('#file-tree').jstree({
        "core" : {
            "animation" : 0,
            "check_callback" : true,
            "themes" : { "stripes" : true },
            'data' : {
                'url' : function (node) { return 'nav'; }, // could need to check node.id === '#',
                'data' : function (node) {
                    var file = '/';
                    if (node.id != '#') {
                        var elements = node.parents.filter(function(e) { return e !== "#" })
                            .map(function (id) { return getTree().get_node(id).text; });
                        elements.reverse().push(node.text);
                        file = '/' + elements.join('/');
                    }
                    return { 'file' : file };
                }
            }
        },
        "types" : {
            "#" : {
                "max_children" : 40,
                "max_depth" : 100,
                "valid_children" : ["root"]
            },
            "root" : {
                "icon" : "/static/3.2.0/assets/images/tree_icon.png",
                "valid_children" : ["default"]
            },
            "default" : {
                "valid_children" : ["default","file"]
            },
            "file" : {
                "icon" : "glyphicon glyphicon-file",
                "valid_children" : []
            }
        },
        "plugins" : [
            "search",
            "state", "types", "wholerow"
        ]
    });

    $("#analyze-btn").on("click", function() {
        window.location.href = "./?file=" + selectedFile;
    });
    $("#download-btn").on("click", function() {
        window.location.href = selectedFile;
    });
    $(".action-btn").prop("disabled", true);

    var selectedFile;
    $('#file-tree').on("changed.jstree", function (e, data) {
        var selected = (data.selected.length == 1);
        console.log("selected " + selected)
        $(".action-btn").prop("disabled", !selected);
        if (selected) {
            selectedFile = getFile(getTree().get_node(data.selected[0]));
        }
    });
}
