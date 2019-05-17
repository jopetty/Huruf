function save_options() {
    var s = parseInt(document.getElementById('size').value);
    var h = parseInt(document.getElementById('height').value);
    var sw = document.getElementById("onOffSwitch").checked;
    chrome.storage.sync.set({
        textSize: s,
        lineHeight: h,
        onOffSwitch: sw
    }, function () {
    });
}

function restore_options() {
    chrome.storage.sync.get({
        textSize: '130',
        lineHeight: '150',
        onOffSwitch: true,
    }, function (items) {
        document.getElementById('size').value = items.textSize;
        document.getElementById('sizeValue').innerHTML = items.textSize + '%';
        document.getElementById('height').value = items.lineHeight;
        document.getElementById('heightValue').innerHTML = items.lineHeight + '%';
        document.getElementById("onOffSwitch").checked = items.onOffSwitch;
    });
}

function updateSize() {
    document.getElementById('sizeValue').innerHTML = document.getElementById('size').value + '%';
}

function updateHeight() {
    document.getElementById('heightValue').innerHTML = document.getElementById('height').value + '%';
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('size').addEventListener('mouseup', save_options);
document.getElementById('height').addEventListener('mouseup', save_options);
document.getElementById('size').addEventListener('mousemove', updateSize);
document.getElementById('height').addEventListener('mousemove', updateHeight);
document.getElementById("onOffSwitch").onclick = () => {
    var checked = document.getElementById("onOffSwitch").checked;
    console.log(checked);
    chrome.storage.sync.set({
        onOffSwitch: checked,
    }, function () {
    });
};
