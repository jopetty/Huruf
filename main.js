(function () {
    chrome.storage.sync.get(['textSize', 'lineHeight'], function (e) {
        var textSize = e.textSize;
        var lineHeight = e.lineHeight;
        var arabicRegEx = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');
        function hasArabicScript(node) {
            return !!(node.nodeValue && (node.nodeValue.trim() != "") && (node.nodeValue.match(arabicRegEx)));
        }
        function getArabicTextNodes() {
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            var node;
            var arabicTextNodes = [];
            // noinspection JSAssignmentUsedAsCondition
            while (node = walker.nextNode()) {
                if (hasArabicScript(node)) {
                    arabicTextNodes.push(node);
                }
            }
            return arabicTextNodes;
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
            getArabicTextNodes().forEach(function (it) { return updateNode(it); });
        }
        function updateNode(node) {
            if (node.nodeValue) {
                var text = node.nodeValue.replace(arabicRegEx, "<span class='ar' style='font-size:" + (textSize / 100) + "em;" + " line-height:" + (lineHeight / 100) + "em;'>$&</span>");
                setNodeHtml(node, text);
            }
        }
        function startObserver() {
            var documentBody = document.body;
            var config = {
                attributes: false,
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: false,
            };
            var callback = function (mutationsList) {
                mutationsList.forEach(function (record) {
                    if (record.addedNodes.length > 0 && record.removedNodes.length == 0) {
                        record.addedNodes.forEach(function (node) {
                            if (hasArabicScript(node)) {
                                console.log(node.nodeValue);
                                updateNode(node);
                            }
                        });
                    }
                });
            };
            new MutationObserver(callback).observe(documentBody, config);
        }
        setLangAll();
        startObserver();
    });
})();
