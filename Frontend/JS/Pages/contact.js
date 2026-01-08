/* COUNTRY CODES */
const countries = [
  { name: "Nigeria", code: "+234" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Australia", code: "+61" },
  { name: "South Africa", code: "+27" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "UAE", code: "+971" },
];

const countrySelect = document.getElementById("countryCode");
countries.forEach((c) => {
  const option = document.createElement("option");
  option.value = c.code;
  option.textContent = `${c.name} (${c.code})`;
  countrySelect.appendChild(option);
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

  if (hasError) {
    return;
  }

  console.log("Form valid — proceed to next step");
});
