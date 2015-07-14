"use strict";

export {setModal};

let onModal;
let disasterModal = $("#disasterModal");
let disasterBody = $("#disasterModal .modal-body");

function setModal(callback) {
  onModal = callback;
}

(function() {
  disasterModal.on('show.bs.modal', function (e) {
    let data = onModal();
    let paragraph = $("<p/>");
    paragraph.html(data);
    disasterBody.empty();
    disasterBody.append(paragraph);
  })
})();

