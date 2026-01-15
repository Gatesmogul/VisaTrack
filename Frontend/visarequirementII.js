// Simple interactive behavior for visa requirement lookup
(function () {
  const lookup = {
    "united kingdom": { outcome: 'eVisa', note: 'Apply online up to 3 months before travel' },
    "japan": { outcome: 'Visa Free', note: 'No visa required for short stays' },
    "uae": { outcome: 'Visa Required', note: 'Check embassy entry requirements' },
    "canada": { outcome: 'eTA / eVisa', note: 'Electronic Travel Authorization may be required' },
    "india": { outcome: 'eVisa / Visa Required', note: 'Tourist eVisa available for many nationalities' }
  };

  function normalize(s) {
    return (s || '').toString().trim().toLowerCase();
  }

  function renderRecent() {
    const list = document.getElementById('recentList');
    const data = JSON.parse(localStorage.getItem('visa_recent') || '[]');
    list.innerHTML = '';
    data.slice(0, 6).forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.passport.toUpperCase()} → ${item.destination}`;
      li.addEventListener('click', () => {
        document.getElementById('destination').value = item.destination;
        document.getElementById('passport').value = item.passport;
      });
      list.appendChild(li);
    });
  }

  function saveRecent(entry) {
    const key = 'visa_recent';
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    raw.unshift(entry);
    // unique and limit 10
    const uniq = [];
    raw.forEach(r => {
      const k = r.passport + '|' + r.destination.toLowerCase();
      if (!uniq.some(x => x.key === k)) uniq.push({ key: k, v: r });
    });
    const result = uniq.map(x => x.v).slice(0, 10);
    localStorage.setItem(key, JSON.stringify(result));
  }

  function showResult(passport, destination) {
    const results = document.getElementById('results');
    const dest = normalize(destination);
    const found = lookup[dest];
    results.style.display = 'block';
    results.innerHTML = '';
    const title = document.createElement('h4');
    title.textContent = `Results for ${destination}`;
    results.appendChild(title);

    if (found) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>Outcome:</strong> ${found.outcome}`;
      const note = document.createElement('p');
      note.innerHTML = `<strong>Note:</strong> ${found.note}`;
      results.appendChild(p);
      results.appendChild(note);
    } else {
      const p = document.createElement('p');
      p.innerHTML = `<strong>Outcome:</strong> Unknown`;
      const note = document.createElement('p');
      note.textContent = 'We do not have data for that destination in this demo. Try one of the popular routes.';
      results.appendChild(p);
      results.appendChild(note);
    }

    // sample actions
    const actions = document.createElement('div');
    actions.style.marginTop = '10px';
    actions.innerHTML = `<button id="saveBtn" style="padding:8px 12px;border-radius:8px;border:none;background:#2563eb;color:#fff;cursor:pointer">Save to My Routes</button>`;
    results.appendChild(actions);

    document.getElementById('saveBtn').addEventListener('click', () => {
      alert('Saved to your routes (demo).');
    });

    saveRecent({ passport: passport, destination: destination });
    renderRecent();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('checkBtn');
    const destInput = document.getElementById('destination');
    const passport = document.getElementById('passport');

    renderRecent();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const destination = destInput.value.trim();
      const pass = passport.value;
      if (!destination) {
        alert('Please enter a destination.');
        destInput.focus();
        return;
      }
      showResult(pass, destination);
    });

    // quick-enter: press Enter in destination to trigger check
    destInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });
  });
})();
