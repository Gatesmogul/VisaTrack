 // Select elements
const inputs = document.querySelectorAll("input, select, textarea");
const saveBtn = document.querySelector(".primary-btn");
const editBtn = document.querySelector(".secondary-btn");

// Load saved data on page load
window.addEventListener("DOMContentLoaded", loadData);

// Save data
saveBtn.addEventListener("click", () => {
  const data = {};

  inputs.forEach((input, index) => {
    data[index] = input.value;
    input.disabled = true;
  });

  localStorage.setItem("visaData", JSON.stringify(data));
  alert("Visa history saved successfully");
});

// Enable edit mode
editBtn.addEventListener("click", () => {
  inputs.forEach(input => {
    input.disabled = false;
  });
});

// Load saved data function
function loadData() {
  const savedData = JSON.parse(localStorage.getItem("visaData"));

  if (!savedData) return;

  inputs.forEach((input, index) => {
    input.value = savedData[index] || "";
    input.disabled = true;
  });
}
