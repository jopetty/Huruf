(function () {
	chrome.storage.sync.get(['textSize', 'lineHeight'], function(e) {
		var textSize = e.textSize;
		var lineHeight = e.lineHeight;

		var regex_arabic_script = new RegExp('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF\W\d]+)*)', 'g');

		function getTextNodes() {

			var walker = document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				null,
				false
			);

			var node;
			var textNodes = [];

			while (node = walker.nextNode()) {
				if ((node.nodeValue.trim() != "") && (node.nodeValue.match(regex_arabic_script))) {
					textNodes.push(node);
				}
			}
			return textNodes;
		}

		function setClass(node, html) {
			var parent = node.parentNode;
			if (!parent) return;
			var next = node.nextSibling;
			var parser = document.createElement('div');
			parser.innerHTML = html;
			while (parser.firstChild) {
				parent.insertBefore(parser.firstChild, next);
			}
			parent.removeChild(node);
		}

		function setLang() {

			var textNodes = getTextNodes();
			for (var i = 0; i < textNodes.length; i++) {
				setClass(
					textNodes[i],
					textNodes[i].nodeValue.replace(regex_arabic_script, "<span class='ar' style='font-size:" + (textSize / 100) + "em; line-height:" + (lineHeight / 100) + "em'>$&</span>")
				);
			}
		}

		// Call setLang()
		setLang();
	});
})();
