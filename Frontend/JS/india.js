const reminderBtn = document.querySelector(".btn.secondary");
const reminderSection = document.querySelector(".reminder");

let reminders = JSON.parse(localStorage.getItem("visaReminders")) || [];

function renderReminders() {
  reminderSection
    .querySelectorAll(".dynamic-reminder")
    .forEach((el) => el.remove());

  reminders.forEach((reminder) => {
    const p = document.createElement("p");
    p.classList.add("dynamic-reminder");
    p.innerHTML = `
      <img src="https://unpkg.com/lucide-static/icons/calendar.svg" 
           alt="calendar" 
           class="icon-rem" />
      ${reminder.date}: ${reminder.text}
    `;
    reminderSection.appendChild(p);
  });
}

reminderBtn.addEventListener("click", () => {
  const date = prompt("Enter reminder date (e.g. March 10, 2026)");
  if (!date) return;

  const text = prompt("Enter reminder description");
  if (!text) return;

  reminders.push({ date, text });
  localStorage.setItem("visaReminders", JSON.stringify(reminders));
  renderReminders();
});

renderReminders();

const exportBtn = document.querySelector(".btn.primary");

exportBtn.addEventListener("click", () => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  let output = "VISA APPLICATION TIMELINE\n\n";

  timelineItems.forEach((item) => {
    const title = item.querySelector("h3")?.innerText || "Step";
    const date = item.querySelector(".timeline-date")?.innerText || "—";
    const status = item.classList.contains("completed")
      ? "Completed"
      : "Upcoming";

    output += `${title}\nStatus: ${status}\nDate: ${date}\n\n`;
  });

  if (reminders.length) {
    output += "REMINDERS\n";
    reminders.forEach((r) => {
      output += `- ${r.date}: ${r.text}\n`;
    });
  }

  const blob = new Blob([output], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "visa-timeline.txt";
  link.click();

  URL.revokeObjectURL(url);
});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    const page = item.dataset.page;
    console.log("Navigate to:", page);

    if (page === "home") window.location.href = "";
    if (page === "timeline") window.location.href = "";
    if (page === "new") window.location.href = "";
    if (page === "tracker") window.location.href = "";
    if (page === "profile") window.location.href = "";
  });
});
