/* Enrolment popup (index.html).
 *
 * Opens the #rec-popup <dialog> shortly after load. A native modal dialog
 * gives focus trapping, Esc-to-close and the ::backdrop for free; this file
 * only decides *when* to open it and adds click-outside-to-close.
 *
 * Once dismissed it stays closed for the rest of the browsing session, so a
 * visitor returning to the home page isn't interrupted again. Storage can be
 * unavailable (private mode, blocked site data) — then it simply shows each
 * time, which is harmless.
 *
 * Without JS the dialog never opens and the hero banner carries the message.
 */
(function () {
  var KEY = 'rec-popup-dismissed';
  var dlg = document.getElementById('rec-popup');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  dlg.addEventListener('close', function () {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  });

  /* A click that lands on the dialog element itself (not its contents) is a
     click on the backdrop. */
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) dlg.close();
  });

  setTimeout(function () { dlg.showModal(); }, 700);
})();
