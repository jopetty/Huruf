(function () {
    var textSize = 115;
    var lineHeight = 115;

    var arabicRegEx = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');

    function getArabicTextNodes(): Array<Node> {

        var walker: TreeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        var node: Node;
        var textNodes: Array<Node> = [];

        // noinspection JSAssignmentUsedAsCondition
        while (node = walker.nextNode()) {
            if ((node.nodeValue.trim() != "") && (node.nodeValue.match(arabicRegEx))) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    function setNodeHtml(node: Node, html: string) {
        var parent: Node = node.parentNode;

        if (!parent || !node) return;

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

    function updateNode(node: Node) {
        var text: string = node.nodeValue.replace(arabicRegEx,
            "<span class='ar' style='font-size:" + (textSize / 100) + "em;" + " line-height:" + (lineHeight / 100) + "em;'>$&</span>");
        setNodeHtml(node, text);
    }

    function setLangNodesArray(nodes: Array<Node>) {
        nodes.forEach((it: Node) => updateNode(it));
    }

    function setLangNodesList(nodes: NodeList) {
        nodes.forEach((it: Node) => updateNode(it));
    }

    function startObserver() {

        var node: Node = document;

        var config: MutationObserverInit = {
            attributes: false,
            childList: true,
            subtree: true,
        };

        var callback: MutationCallback = function (mutationsList: MutationRecord[], observer: MutationObserver) {
            mutationsList.forEach((it: MutationRecord) => {
                setLangNodesList(it.addedNodes);
            });
        };

        new MutationObserver(callback).observe(node, config);
    }

    setLangAll();

})();