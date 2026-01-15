document.addEventListener('DOMContentLoaded', () => {
  const fullName = document.getElementById('fullName');
  const dob = document.getElementById('dob');
  const nationality = document.getElementById('nationality');
  const residence = document.getElementById('residence');
  const genderHidden = document.getElementById('gender');
  const genderBtns = Array.from(document.querySelectorAll('.gender-btn'));
  const nextBtn = document.getElementById('nextBtn');

  const errorBox = document.querySelector('.error-box');
  const fullNameError = document.getElementById('fullNameError');
  const nationalityError = document.getElementById('nationalityError');
  const residenceError = document.getElementById('residenceError');

  // Initialize: hide error box if fields ok
  function showErrorBox(show) {
    if (!errorBox) return;
    errorBox.style.display = show ? 'block' : 'none';
  }

  showErrorBox(false);

  // Gender selection
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.getAttribute('data-value') || '';
      genderHidden.value = val;
    });
  });

  function validate() {
    let valid = true;

    // Full name required
    if (!fullName.value.trim()) {
      fullName.parentElement.classList.add('error');
      fullNameError.style.display = 'block';
      valid = false;
    } else {
      fullName.parentElement.classList.remove('error');
      fullNameError.style.display = 'none';
    }

    // Nationality
    if (!nationality.value) {
      nationality.parentElement.classList.add('error');
      nationalityError.style.display = 'block';
      valid = false;
    } else {
      nationality.parentElement.classList.remove('error');
      nationalityError.style.display = 'none';
    }

    // Residence
    if (!residence.value.trim() || residence.value.trim().toLowerCase() === 'country') {
      residence.parentElement.classList.add('error');
      residenceError.style.display = 'block';
      valid = false;
    } else {
      residence.parentElement.classList.remove('error');
      residenceError.style.display = 'none';
    }

    // DOB basic check
    if (!dob.value) {
      dob.parentElement.classList.add('error');
      valid = false;
    } else {
      dob.parentElement.classList.remove('error');
    }

    showErrorBox(!valid);
    return valid;
  }

  // On Next click
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const ok = validate();
    if (!ok) return;

    // Simulate saving and move to next step
    nextBtn.disabled = true;
    nextBtn.textContent = 'Saving...';

    setTimeout(() => {
      // Show a simple success state
      const container = document.querySelector('.container');
      container.innerHTML = `
        <div class="success-screen">
          <h2>All set — Personal info saved</h2>
          <p>Your profile draft has been saved. Click continue to proceed to Step 2.</p>
          <button id="continueBtn">Continue</button>
        </div>
      `;

      const continueBtn = document.getElementById('continueBtn');
      continueBtn.addEventListener('click', () => {
        // For demo: reload the page or show step 2 placeholder
        container.innerHTML = `<div style="padding:40px;text-align:center"><h2>Step 2 — Contact Details (placeholder)</h2><p>Work in progress...</p></div>`;
      });
    }, 900);
  });

  // Live validation as user types
  fullName.addEventListener('input', () => {
    if (fullName.value.trim()) {
      fullName.parentElement.classList.remove('error');
      fullNameError.style.display = 'none';
      showErrorBox(false);
    }
  });

  nationality.addEventListener('change', () => {
    if (nationality.value) {
      nationality.parentElement.classList.remove('error');
      nationalityError.style.display = 'none';
      showErrorBox(false);
    }
  });

  residence.addEventListener('input', () => {
    if (residence.value.trim() && residence.value.trim().toLowerCase() !== 'country') {
      residence.parentElement.classList.remove('error');
      residenceError.style.display = 'none';
      showErrorBox(false);
    }
  });

});
