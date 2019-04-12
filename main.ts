(function () {
    chrome.storage.sync.get(['textSize', 'lineHeight'], function (e) {
        var textSize = e.textSize;
        var lineHeight = e.lineHeight;

        var arabicRegEx = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');

        function hasArabicScript(node: Node): boolean {
            return !!(node.nodeValue && (node.nodeValue.trim() != "") && (node.nodeValue.match(arabicRegEx)));
        }

        function getArabicTextNodes(): Array<Node> {

            var walker: TreeWalker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            var node: Node;
            var arabicTextNodes: Array<Node> = [];

            // noinspection JSAssignmentUsedAsCondition
            while (node = walker.nextNode()) {
                if (hasArabicScript(node)) {
                    arabicTextNodes.push(node);
                }
            }
            return arabicTextNodes;
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
            getArabicTextNodes().forEach((it: Node) => updateNode(it));
        }

        function updateNode(node: Node) {
            if (node.nodeValue) {
                var text: string = node.nodeValue.replace(arabicRegEx,
                    "<span class='ar' style='font-size:" + (textSize / 100) + "em;" + " line-height:" + (lineHeight / 100) + "em;'>$&</span>");
                setNodeHtml(node, text);
            }
        }

        function startObserver() {

            var documentBody: Node = document.body;

            var config: MutationObserverInit = {
                attributes: false,
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: false,
            };

            var callback: MutationCallback = function (mutationsList: MutationRecord[]) {
                mutationsList.forEach((record: MutationRecord) => {
                    if (record.addedNodes.length > 0 && record.removedNodes.length == 0) {
                        record.addedNodes.forEach((node: Node) => {
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