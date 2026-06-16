// Contact form → MKMBA metrics service (POST /contact).
// Progressive enhancement: the form keeps a mailto: fallback for no-JS;
// here we intercept submit and post JSON to the metrics endpoint, mirroring
// the web-matt pattern. See themes/pounamu/layouts/index.html for the markup.
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var endpoint = form.dataset.endpoint;
  var errorEl = document.getElementById("cf-error");
  var successEl = document.getElementById("cf-success");
  var button = document.getElementById("cf-submit");
  var label = button ? button.querySelector(".btn__label") : null;
  var honeypot = form.elements["company"];

  function setBusy(busy) {
    button.disabled = busy;
    if (label) label.textContent = busy ? "Sending…" : "Send";
  }

  function showSuccess() {
    form.hidden = true;
    successEl.hidden = false;
  }

  function showError() {
    errorEl.hidden = false;
    setBusy(false);
  }

  form.addEventListener("submit", function (e) {
    // Native validation (required / type=email) has already passed by the
    // time submit fires; take over from the mailto: fallback.
    e.preventDefault();
    errorEl.hidden = true;

    // Honeypot tripped → looks like a bot. Pretend success, send nothing.
    if (honeypot && honeypot.value) {
      showSuccess();
      return;
    }

    if (!endpoint) {
      showError();
      return;
    }

    var payload = {
      Name: form.elements["name"].value.trim(),
      Org: form.elements["org"].value.trim(),
      Details: form.elements["email"].value.trim(),
      Msg: form.elements["problem"].value.trim()
    };

    setBusy(true);

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (response.ok) {
          showSuccess();
        } else {
          showError();
        }
      })
      .catch(function () {
        showError();
      });
  });
})();
