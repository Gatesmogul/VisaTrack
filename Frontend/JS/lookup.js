const passportSelect = document.getElementById("passportFrom");
const travelSelect = document.getElementById("travelTo");
const backBtn = document.getElementById("backBtn");
const navItems = document.querySelectorAll(".nav-item");

backBtn.addEventListener("click", () => {
  history.back();
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;

    navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    console.log(`Navigate to: ${page}`);
  });
});

fetch("https://restcountries.com/v3.1/all?fields=name")
  .then((res) => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  })
  .then((data) => {
    const countries = data
      .map((c) => c.name.common)
      .sort((a, b) => a.localeCompare(b));

    countries.forEach((name) => {
      passportSelect.add(new Option(name, name));
      travelSelect.add(new Option(name, name));
    });
  })
  .catch((err) => {
    console.error("Country API failed:", err);
  });
