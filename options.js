// Saves options to chrome.storage
function save_options() {
    var s = parseInt(document.getElementById('size').value);
  chrome.storage.sync.set({
    textSize: s,
  }, function() {
    // Update status to let user know options were saved.
    // var status = document.getElementById('status');
    // status.textContent = 'Options saved.';
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
      textSize: '130',
  }, function(items) {
      document.getElementById('size').value = items.textSize;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('size').addEventListener('mouseup',
    save_options);
