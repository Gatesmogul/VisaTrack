function formatDate(date) {
  return (
    date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function updateStep(stepName, state, date = null) {
  const step = document.querySelector(`[data-step="${stepName}"]`);
  const timeEl = step.querySelector(".time");

  step.setAttribute("data-state", state);

  if (date) {
    timeEl.textContent = formatDate(date);
    timeEl.classList.remove("hidden");
  }
}
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
  window.location.href = "";
});
