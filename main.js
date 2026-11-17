// Wiring: toolbar buttons, brief box, search, starting state.
(function () {
  const A = window.AWSDATA, S = window.S, R = window.R, I = window.I, X = window.X;
  const $ = id => document.getElementById(id);

  $('search').addEventListener('input', e => R.renderPalette(e.target.value));

  const toggle = $('brief-toggle'), body = $('brief-body');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open)); body.hidden = open;
  });

  $('btn-export').addEventListener('click', () => {
    if (!X.png()) flash('Add something to the canvas first.');
  });
  $('btn-save').addEventListener('click', () => X.saveJson($('brief-text').value));
  $('btn-load').addEventListener('click', () => $('file-input').click());
  $('file-input').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { $('brief-text').value = A.load(String(r.result)); I.refresh(); }
      catch (err) { flash('Could not open that file: ' + err.message); }
    };
    r.readAsText(f); e.target.value = '';
  });

  // Two-step clear without confirm() dialogs.
  let armed = null;
  $('btn-clear').addEventListener('click', e => {
    const b = e.currentTarget;
    if (armed) { clearTimeout(armed); armed = null; b.textContent = 'Clear'; A.clear(); I.refresh(); return; }
    b.textContent = 'Click again to clear';
    armed = setTimeout(() => { armed = null; b.textContent = 'Clear'; }, 2500);
  });

  function flash(msg) {
    const t = $('mode-tip'); t.hidden = false; t.textContent = msg;
    setTimeout(() => { t.hidden = S.tool !== 'connect'; if (S.tool === 'connect') t.textContent = 'Connect mode: click the first service.'; }, 2500);
  }

  R.renderPalette('');
  I.refresh();
})();
