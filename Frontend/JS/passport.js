const passportInput = document.getElementById("passportNumber");
const countrySelect = document.getElementById("issuingCountry");
const issueDate = document.getElementById("issueDate");
const expiryDate = document.getElementById("expiryDate");

const passportGroup = document.getElementById("passportGroup");
const countryGroup = document.getElementById("countryGroup");
const issueDateGroup = document.getElementById("issueDateGroup");
const expiryDateGroup = document.getElementById("expiryDateGroup");

const countries = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
  "Germany",
  "France",
  "Australia",
  "South Africa",
  "Italy",
  "Spain",
  "Netherlands",
  "Brazil",
  "Japan",
  "China",
];

countries.forEach((c) => {
  const option = document.createElement("option");
  option.value = c;
  option.textContent = c;
  countrySelect.appendChild(option);
});

function isSixMonthsValid(expiry) {
  const today = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(today.getMonth() + 6);
  return new Date(expiry) >= sixMonthsLater;
}

document.getElementById("passportForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let error = false;

  if (!passportInput.value.match(/^[A-Za-z0-9]{6,}$/)) {
    passportGroup.classList.add("error");
    error = true;
  } else passportGroup.classList.remove("error");

  if (!countrySelect.value) {
    countryGroup.classList.add("error");
    error = true;
  } else countryGroup.classList.remove("error");

  if (!issueDate.value) {
    issueDateGroup.classList.add("error");
    error = true;
  } else issueDateGroup.classList.remove("error");

  if (!expiryDate.value || !isSixMonthsValid(expiryDate.value)) {
    expiryDateGroup.classList.add("error");
    error = true;
  } else expiryDateGroup.classList.remove("error");

  if (error) return;

  console.log("Passport details valid — ready for backend");
});
