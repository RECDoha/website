/* Shared video miniplayer.
 *
 * Any element carrying [data-vp-open] opens the player for its [data-vp-id]
 * (a Google Drive file id), labelled with [data-vp-title].
 *
 * The point of this file is that no video is embedded until someone asks for
 * it. A Drive iframe drags in the whole Drive player UI, so a page showing
 * five testimonials would pay that cost five times over on load, for viewers
 * who may watch none of them. Here the iframe is created on first open and
 * its src is cleared on close, so the cost scales with interest rather than
 * with the number of videos on the page.
 *
 * Adding another video is one element — no JS changes needed.
 */
(function () {
  var vp, frame, toggle, titleEl;

  function build() {
    vp = document.createElement('div');
    vp.className = 'rec-vp';
    vp.dataset.open = 'false';
    vp.dataset.mode = 'mini';
    vp.setAttribute('role', 'dialog');
    vp.setAttribute('aria-modal', 'false');
    vp.setAttribute('aria-label', 'Video player');
    vp.innerHTML =
      '<div class="rec-vp-backdrop" data-vp-close></div>' +
      '<div class="rec-vp-shell">' +
        '<div class="rec-vp-bar">' +
          '<span class="rec-vp-title"></span>' +
          '<button type="button" class="rec-vp-btn" data-vp-toggle aria-label="Expand video">⤢</button>' +
          '<button type="button" class="rec-vp-btn" data-vp-close aria-label="Close video">✕</button>' +
        '</div>' +
        '<div class="rec-vp-frame">' +
          '<iframe allow="autoplay" allowfullscreen title="Video"></iframe>' +
        '</div>' +
      '</div>';
    document.body.appendChild(vp);

    frame = vp.querySelector('iframe');
    toggle = vp.querySelector('[data-vp-toggle]');
    titleEl = vp.querySelector('.rec-vp-title');

    Array.prototype.forEach.call(vp.querySelectorAll('[data-vp-close]'), function (el) {
      el.addEventListener('click', close);
    });
    toggle.addEventListener('click', function () {
      setMode(vp.dataset.mode === 'full' ? 'mini' : 'full');
    });
  }

  function setMode(mode) {
    vp.dataset.mode = mode;
    var full = mode === 'full';
    /* Only the expanded state is a true modal — the miniplayer deliberately
       leaves the page usable behind it. */
    vp.setAttribute('aria-modal', full ? 'true' : 'false');
    toggle.textContent = full ? '⤡' : '⤢';
    toggle.setAttribute('aria-label', full ? 'Shrink to miniplayer' : 'Expand video');
  }

  function open(id, label) {
    if (!id) return;
    if (!vp) build();
    titleEl.textContent = label || 'Watch';
    frame.title = label || 'Video';
    frame.src = 'https://drive.google.com/file/d/' + id + '/preview';
    vp.dataset.open = 'true';
    setMode('mini');
  }

  function close() {
    vp.dataset.open = 'false';
    /* Dropping the src is what actually stops playback. Merely hiding the
       iframe leaves the Drive player running and audible. */
    frame.src = '';
  }

  /* Delegated, so triggers added to the page later work without rebinding. */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-vp-open]');
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-vp-id'), t.getAttribute('data-vp-title'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && vp && vp.dataset.open === 'true') close();
  });
})();
