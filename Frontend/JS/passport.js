const passportInput = document.getElementById("passportNumber");
const countrySelect = document.getElementById("issuingCountry");
const issueDate = document.getElementById("issueDate");
const expiryDate = document.getElementById("expiryDate");

const passportGroup = document.getElementById("passportGroup");
const countryGroup = document.getElementById("countryGroup");
const issueDateGroup = document.getElementById("issueDateGroup");
const expiryDateGroup = document.getElementById("expiryDateGroup");

fetch("https://restcountries.com/v3.1/all?fields=name")
  .then((res) => res.json())
  .then((data) => {
    const countries = data
      .map((c) => c.name.common)
      .sort((a, b) => a.localeCompare(b));

    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });
  })
  .catch((err) => {
    console.error("Failed to load countries", err);
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
