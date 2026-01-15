// ...existing code...
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const uploadedList = document.getElementById('uploadedList');
  const missingList = document.getElementById('missingList');
  const alertBox = document.getElementById('alertBox');
  const uploadBtn = document.getElementById('uploadBtn');
  const continueBtn = document.getElementById('continueBtn');
  const fileInput = document.getElementById('fileInput');

  // derive required doc names from missingList initial items
  const requiredDocs = Array.from(missingList.querySelectorAll('li')).map(li => li.textContent.trim().toLowerCase());

  // helpers
  const normalize = s => s.trim().toLowerCase();
  const saveState = () => {
    const items = Array.from(uploadedList.querySelectorAll('li')).map(li => {
      return { text: li.querySelector('span').innerText.trim() };
    });
    localStorage.setItem('auth_uploaded', JSON.stringify(items));
  };
  const loadState = () => {
    const raw = localStorage.getItem('auth_uploaded');
    if (!raw) return;
    try {
      const items = JSON.parse(raw);
      uploadedList.innerHTML = '';
      items.forEach(it => {
        const li = createUploadedItem(it.text);
        uploadedList.appendChild(li);
      });
    } catch (e) { /* ignore */ }
  };

  const formatSize = bytes => {
    if (bytes >= 1024*1024) return (bytes/(1024*1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes/1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  function createUploadedItem(filename, sizeText) {
    const li = document.createElement('li');
    const spanLeft = document.createElement('span');
    spanLeft.innerHTML = `&#10004; ${escapeHtml(filename)} ${sizeText ? '<small class="megabyte">(' + escapeHtml(sizeText) + ')</small>' : ''}`;
    const actions = document.createElement('span');
    actions.className = 'actions';
    actions.innerHTML = `<a href="#" class="view-link">View</a> | <a href="#" class="remove-link">Remove</a>`;
    li.appendChild(spanLeft);
    li.appendChild(actions);
    attachItemHandlers(li);
    return li;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function attachItemHandlers(li) {
    const view = li.querySelector('.view-link');
    const remove = li.querySelector('.remove-link');
    view && view.addEventListener('click', e => {
      e.preventDefault();
      const name = li.querySelector('span').innerText.trim();
      // show a simple preview placeholder
      alert('Viewing file:\n' + name);
    });
    remove && remove.addEventListener('click', e => {
      e.preventDefault();
      const name = li.querySelector('span').innerText.trim();
      if (!confirm(`Remove ${name} from uploaded documents?`)) return;
      li.remove();
      saveState();
      evaluateMissing();
    });
  }

  function evaluateMissing() {
    // build lowercase set of uploaded filenames for matching
    const uploadedNames = Array.from(uploadedList.querySelectorAll('li span')).map(s => normalize(s.innerText));
    // find which required docs are still missing
    const stillMissing = requiredDocs.filter(req => !uploadedNames.some(up => up.includes(req) || up.includes(req.split(' ')[0])));
    // update missingList UI
    missingList.innerHTML = '';
    if (stillMissing.length === 0) {
      alertBox.style.display = 'none';
      continueBtn.disabled = false;
    } else {
      alertBox.style.display = '';
      continueBtn.disabled = true;
      stillMissing.forEach(name => {
        const li = document.createElement('li');
        li.textContent = capitalizeWords(name);
        missingList.appendChild(li);
      });
    }
  }

  function capitalizeWords(s) {
    return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // wire upload button -> file input
  uploadBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInput.click();
  });

  // when file selected, add to uploaded list and try to match missing docs
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const name = file.name;
    const sizeText = formatSize(file.size || 0);

    // add item
    const li = createUploadedItem(name, sizeText);
    uploadedList.appendChild(li);
    saveState();

    // try to auto-match to missing docs by keywords
    // check if filename contains any required doc keywords
    const lower = normalize(name);
    for (const req of requiredDocs) {
      const keyword = req.split(' ').slice(0,2).join(' ');
      if (lower.includes(req) || lower.includes(keyword) || lower.includes(keyword.split(' ')[0])) {
        // re-evaluate missing; evaluateMissing will remove it from missing if matched
        break;
      }
    }

    evaluateMissing();
    // feedback
    alert(`Uploaded: ${name} (${sizeText})`);
  });

  // Continue button behavior
  continueBtn.addEventListener('click', () => {
    if (continueBtn.disabled) return;
    // placeholder action - replace with actual navigation if needed
    console.log('All required documents present. Proceeding to next step.');
    alert('All documents present. Proceeding to the application.');
    // example navigation:
    // window.location.href = '/next-step.html';
  });

  // initialize
  loadState();
  // attach handlers for any pre-existing list items
  Array.from(uploadedList.querySelectorAll('li')).forEach(attachItemHandlers);
  evaluateMissing();
});
// ...existing code...