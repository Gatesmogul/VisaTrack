const form = document.getElementById("visaForm");
const visaInfo = document.getElementById("visaInfo");
const passportInput = document.getElementById("passportUpload");
const passportPreview = document.getElementById("passportPreview");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show the visa section
  visaInfo.classList.remove("hidden");

  // Fill profile details
  document.getElementById("nameDisplay").textContent =
    document.getElementById("fullName").value;
  document.getElementById("passportDisplay").textContent =
    document.getElementById("passportCountry").value;
  document.getElementById("residenceDisplay").textContent =
    document.getElementById("residenceCountry").value;
  document.getElementById("emailDisplay").textContent =
    document.getElementById("email").value;

  // Passport preview
  const passportFile = passportInput.files[0];
  if (passportFile) {
    const reader = new FileReader();
    reader.onload = () => (passportPreview.src = reader.result);
    reader.readAsDataURL(passportFile);
  }
});
