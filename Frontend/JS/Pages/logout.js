document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.querySelector(".btn.cancel");
  const logoutBtn = document.querySelector(".btn.logout");

  cancelBtn.addEventListener("click", () => {
    history.back();
  });

  logoutBtn.addEventListener("click", () => {
    cancelBtn.disabled = true;
    logoutBtn.disabled = true;
    logoutBtn.style.opacity = "0.7";

    setTimeout(() => {
      window.location.href = "signin.htm";
    }, 600);
  });
});
