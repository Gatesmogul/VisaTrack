document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("countryCode");
  if (!countrySelect) return;

  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "";

      history.back();
    });
  }

  const prevBtn = document.querySelector(".btn.secondary");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      window.location.href = "";
    });
  }

  fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd")
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then((data) => {
      countrySelect.innerHTML = "";

      const countries = data
        .filter(
          (c) =>
            c.cca2 &&
            c.idd &&
            c.idd.root &&
            Array.isArray(c.idd.suffixes) &&
            c.idd.suffixes.length
        )
        .map((c) => ({
          iso: c.cca2,
          code: `${c.idd.root}${c.idd.suffixes[0]}`,
        }))
        .sort((a, b) => a.iso.localeCompare(b.iso));

      countries.forEach(({ iso, code }) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${iso} ${code}`;
        if (iso === "US") option.selected = true;

        countrySelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Country code API failed:", err);
    });

  const photoInput = document.getElementById("photoInput");
  const avatar = document.getElementById("avatar");

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file || file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      avatar.innerHTML = `<img src="${reader.result}" alt="Profile photo">`;
    };
    reader.readAsDataURL(file);
  });

  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const emailGroup = document.getElementById("emailGroup");
  const phoneGroup = document.getElementById("phoneGroup");
  const verificationBox = document.getElementById("verificationBox");
  const nextBtn = document.querySelector(".primary");

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validatePhone(v) {
    return v.replace(/\D/g, "").length >= 10;
  }

  function updateVerification() {
    if (
      emailGroup.classList.contains("success") &&
      phoneGroup.classList.contains("success")
    ) {
      verificationBox.classList.add("success");
      nextBtn.disabled = false;
    } else {
      verificationBox.classList.remove("success");
      nextBtn.disabled = true;
    }
  }

  emailInput.addEventListener("input", () => {
    if (!emailInput.value) {
      emailGroup.classList.remove("error", "success");
    } else if (validateEmail(emailInput.value)) {
      emailGroup.classList.add("success");
      emailGroup.classList.remove("error");
    } else {
      emailGroup.classList.add("error");
      emailGroup.classList.remove("success");
    }
    updateVerification();
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneInput.value) {
      phoneGroup.classList.remove("error", "success");
    } else if (validatePhone(phoneInput.value)) {
      phoneGroup.classList.add("success");
      phoneGroup.classList.remove("error");
    } else {
      phoneGroup.classList.add("error");
      phoneGroup.classList.remove("success");
    }
    updateVerification();
  });

  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let hasError = false;

    if (!emailInput.value || !validateEmail(emailInput.value)) {
      emailGroup.classList.add("error");
      emailGroup.classList.remove("success");
      hasError = true;
    }

    if (!phoneInput.value || !validatePhone(phoneInput.value)) {
      phoneGroup.classList.add("error");
      phoneGroup.classList.remove("success");
      hasError = true;
    }

    if (hasError) return;

    console.log("Form valid — proceed to next step");

    window.location.href = "";
  });
});
