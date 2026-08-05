/* ============================================================
   Gateway Intelligence — checklist page
   Live score, verdict highlight, print, and start-over. Answers
   persist in localStorage only — nothing ever leaves the browser.
   Without JS the page still works: native checkboxes plus the
   printed ranges under "find your range below".
   ============================================================ */
(function () {
  'use strict';

  var boxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  if (!boxes.length) return;

  var scoreLine = document.getElementById('score-line');
  var verdicts = document.querySelectorAll('.verdict');
  var STORE_KEY = 'gi-checklist-v1';

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { /* private mode — the page still works, answers just don't persist */ }
  }

  var saved = readSaved();
  Array.prototype.forEach.call(boxes, function (box) {
    if (saved[box.id]) box.checked = true;
  });

  function update() {
    var checked = 0;
    var state = {};

    Array.prototype.forEach.call(boxes, function (box) {
      if (box.checked) {
        checked += 1;
        state[box.id] = true;
      }
    });

    save(state);

    if (scoreLine) {
      scoreLine.textContent = 'You checked ' + checked + ' of ' + boxes.length + '.';
    }

    Array.prototype.forEach.call(verdicts, function (card) {
      var min = parseInt(card.dataset.min, 10);
      var max = parseInt(card.dataset.max, 10);
      card.classList.toggle('is-active', checked >= min && checked <= max);
    });
  }

  Array.prototype.forEach.call(boxes, function (box) {
    box.addEventListener('change', update);
  });
  update();

  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      Array.prototype.forEach.call(boxes, function (box) { box.checked = false; });
      update();
    });
  }
})();
