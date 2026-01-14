document.addEventListener("DOMContentLoaded", () => {
  const passportSelect = document.getElementById("passportCountry");
  const destinationSelect = document.getElementById("destinationCountry");
  const searchBtn = document.getElementById("searchBtn");
  const result = document.getElementById("result");
  const destName = document.getElementById("destName");
  const mapFrame = document.getElementById("mapFrame");

  fetch("https://restcountries.com/v3.1/all?fields=name")
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    })
    .then((data) => {
      const countries = data
        .map((c) => c.name.common)
        .sort((a, b) => a.localeCompare(b));

      passportSelect.innerHTML = "<option value=''>Select country</option>";
      destinationSelect.innerHTML = "<option value=''>Select country</option>";

      countries.forEach((country) => {
        passportSelect.add(new Option(country, country));
        destinationSelect.add(new Option(country, country));
      });
    })
    .catch((err) => {
      console.error("Country API failed:", err);
    });

  searchBtn.addEventListener("click", () => {
    const destination = destinationSelect.value;

    if (!destination) {
      alert("Please select a destination country");
      return;
    }

    destName.textContent = destination;
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(
      destination + " embassy"
    )}&output=embed`;

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth" });
  });
});
