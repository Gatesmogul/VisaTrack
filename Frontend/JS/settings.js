document.getElementById("editProfileBtn").addEventListener("click", () => {
  window.location.href = "profile.html";
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    const page = item.dataset.page;
    console.log("Navigate to:", page);
    if (page === "home") window.location.href = "";
    if (page === "trip") window.location.href = "";
    if (page === "track") window.location.href = "";
    if (page === "settings") window.location.href = "";
  });
});

const userData = {
  name: "User Name",
  avatar: "",
  passportCountry: "",
  residenceCountry: "",
  email: "",
  language: "",
  currency: "",
  dateFormat: "",
  tripView: "",
};

if (userData.avatar) {
  const avatar = document.createElement("img");
  avatar.src = userData.avatar;
  avatar.alt = "Profile Photo";
  avatar.className = "profile-avatar";
  document.querySelector(".profile-info").prepend(avatar);
}

document.getElementById("userName").textContent = userData.name;
document.getElementById("passportCountry").textContent =
  userData.passportCountry || "—";
document.getElementById("residenceCountry").textContent =
  userData.residenceCountry || "—";
document.getElementById("emailAddress").textContent = userData.email || "—";
document.getElementById("language").textContent = userData.language || "—";
document.getElementById("currency").textContent = userData.currency || "—";
document.getElementById("dateFormat").textContent = userData.dateFormat || "—";
document.getElementById("tripView").textContent = userData.tripView || "—";
