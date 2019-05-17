(function () {
    chrome.storage.sync.get(['textSize', 'lineHeight', 'onOffSwitch'], function (e) {
        let textSize = e.textSize;
        let lineHeight = e.lineHeight;
        let checked = e.onOffSwitch;

        let arabicRegEx = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+(' +
            ' [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');

        function hasArabicScript(node: Node): boolean {
            return !!(node.nodeValue && (node.nodeValue.trim() != "") && (node.nodeValue.match(arabicRegEx)));
        }

        function getArabicTextNodesIn(rootNode: Node): Array<Node> {

            let walker: TreeWalker = document.createTreeWalker(
                rootNode,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node: Node;
            let arabicTextNodes: Array<Node> = [];

            // noinspection JSAssignmentUsedAsCondition
            while (node = walker.nextNode()) {
                if (hasArabicScript(node)) {
                    arabicTextNodes.push(node);
                }
            }
            return arabicTextNodes;
        }

        function setNodeHtml(node: Node, html: string) {
            let parent: Node = node.parentNode;

            if (!parent || !node) return;

            let next = node.nextSibling;
            let parser = document.createElement('div');
            parser.innerHTML = html;
            while (parser.firstChild) {
                parent.insertBefore(parser.firstChild, next);
            }
            parent.removeChild(node);
        }

        function updateNode(node: Node) {
            if (node.nodeValue) {
                let text: string = node.nodeValue.replace(arabicRegEx,
                    "<span class='ar'' style='font-size:" + (textSize / 100) + "em;" + " line-height:" + (lineHeight / 100) + "em;'>$&</span>");
                setNodeHtml(node, text);
            }
        }

        function setLangAll() {
            getArabicTextNodesIn(document.body).forEach((it: Node) => updateNode(it));
        }

        function startObserver() {

            let config: MutationObserverInit = {
                attributes: false,
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: false,
            };

            let callback: MutationCallback = function (mutationsList: MutationRecord[]) {
                mutationsList.forEach((record: MutationRecord) => {
                    if (record.addedNodes.length > 0) {
                        record.addedNodes.forEach((node: Node) => {

                            // For each node with Arabic script in node
                            getArabicTextNodesIn(node).forEach((arabicNode: Node) => {

                                // Update arabicNode only if it hasn't been updated
                                if (arabicNode.parentElement && arabicNode.parentElement.getAttribute("class") != "ar") {
                                    updateNode(arabicNode);
                                }
                            });
                        });
                    }
                });
            };

            new MutationObserver(callback).observe(document.body, config);
        }

        if (checked) {
            setLangAll();
            startObserver();
        }

    });
})();