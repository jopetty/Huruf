// This is a modified version of the javascript written by James Padolsey (http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/) and GM port by Arminius99 (https://www.reddit.com/r/learn_arabic/comments/2zpobd/arabic_font_size/)
var elArray = [];
var s;
var n;
function restore_options() {
  chrome.storage.sync.get('textSize', function(items) {
      s = items.textSize;

    function contains(a, obj) {
        var i = a.length;
        while (i--) {
           if (a[i] === obj) {
               return true;
           }
        }
        return false;
    }

    function far(searchText, replacement, searchNode) {
      //Make sure that the far actually has good arguments
      if (!searchText || typeof replacement === 'undefined') {
        return; //Error thrown
      }

      var regex = typeof searchText === 'string' ?
        new RegExp(searchText, 'g') : searchText,
        childNodes = (searchNode || document.body).childNodes,
        cnLength = childNodes.length,
        excludes = 'html';

      while (cnLength--) {
        var currentNode = childNodes[cnLength];
        if (currentNode.nodeType == 1 && (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
          arguments.callee(searchText, replacement, currentNode);
        }
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data)) {
          continue;
        }
        var parent = currentNode.parentNode,
            frag = (function() {
              var html = currentNode.data.replace(regex, replacement),
                  wrap = document.createElement('div'),
                  frag = document.createDocumentFragment();
              wrap.innerHTML = html;
              while (wrap.firstChild) {
                frag.appendChild(wrap.firstChild);
              }
              return frag;
            })();
        parent.insertBefore(frag, currentNode);
        parent.removeChild(currentNode);
        var c = parent.childNodes;
        for (var i = 0; i < c.length; i++) {
            if (c[i].nodeType == 1) {
                if (c[i].attributes != typeof undefined) {
                    if (c[i].hasAttribute("lang")) {
                        if (c[i].getAttribute("lang") == "ar") {
                            elArray.push(c[i]);
                        }
                    }
                }
            }
        }
      }
    }
    //Identify text in the Arabic Unicode Ranges
    //Added the extended range to support more Arabic characters.
    far('([\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+( [\u0600-\u06FF\u0750-\u077F\u08a0-\u08ff\uFB50-\uFDFF\uFE70-\uFEFF]+)*)', '<span lang="ar">$1</span>');

    var el = document.getElementsByTagName("*");
    var n = parseFloat(s)/100;
    n = n.toString() + "em";
    s += "%";
    for (var i = 0; i < elArray.length; i++) {
        elArray[i].style.fontSize = s;
        elArray[i].style.lineHeight = n;

    }
});
}
restore_options();
