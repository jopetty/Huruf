function save_options() {
    var s = parseInt(document.getElementById('size').value);
    var h = parseInt(document.getElementById('height').value);
    chrome.storage.sync.set({
        textSize: s,
        lineHeight: h,
    }, function () {
    });
}

function restore_options() {
    chrome.storage.sync.get({
        textSize: '130',
        lineHeight: '190',
    }, function (items) {
        document.getElementById('size').value = items.textSize;
        document.getElementById('sizeValue').innerHTML = items.textSize + '%';
        document.getElementById('height').value = items.lineHeight;
        document.getElementById('heightValue').innerHTML = items.lineHeight + '%';
    });
}

function updateSize() {
    document.getElementById('sizeValue').innerHTML = document.getElementById('size').value + '%';
}

function updateHeight() {
    document.getElementById('heightValue').innerHTML = document.getElementById('height').value + '%';
}

function toggleSwitch() {
    var checkbox = document.getElementById("onOffSwitch");
    var checked = checkbox.checked;
    console.log(checkbox.checked);
    chrome.storage.sync.set({
        onOffSwitch: checked,
    }, function () {
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('size').addEventListener('mouseup', save_options);
document.getElementById('height').addEventListener('mouseup', save_options);
document.getElementById('size').addEventListener('mousemove', updateSize);
document.getElementById('height').addEventListener('mousemove', updateHeight);
