(function () {
    var textSize = 115;
    var lineHeight = 115;
    var arabicRegEx = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');
    function getArabicTextNodes() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        var textNodes = [];
        // noinspection JSAssignmentUsedAsCondition
        while (node = walker.nextNode()) {
            if ((node.nodeValue.trim() != "") && (node.nodeValue.match(arabicRegEx))) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }
    function setNodeHtml(node, html) {
        var parent = node.parentNode;
        if (!parent || !node)
            return;
        var next = node.nextSibling;
        var parser = document.createElement('div');
        parser.innerHTML = html;
        while (parser.firstChild) {
            parent.insertBefore(parser.firstChild, next);
        }
        parent.removeChild(node);
    }
    function setLangAll() {
        setLangNodesArray(getArabicTextNodes());
    }
    function updateNode(node) {
        var text = node.nodeValue.replace(arabicRegEx, "<span class='ar' style='font-size:" + (textSize / 100) + "em;" + " line-height:" + (lineHeight / 100) + "em;'>$&</span>");
        setNodeHtml(node, text);
    }
    function setLangNodesArray(nodes) {
        nodes.forEach(function (it) { return updateNode(it); });
    }
    function setLangNodesList(nodes) {
        nodes.forEach(function (it) { return updateNode(it); });
    }
    function startObserver() {
        var node = document;
        var config = {
            attributes: false,
            childList: true,
            subtree: true,
        };
        var callback = function (mutationsList, observer) {
            mutationsList.forEach(function (it) {
                setLangNodesList(it.addedNodes);
            });
        };
        new MutationObserver(callback).observe(node, config);
    }
    setLangAll();
})();
