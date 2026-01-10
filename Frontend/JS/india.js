/* ===============================
   VISA TIMELINE FUNCTIONALITY
   Real Project – No Demo Logic
================================ */

/* ---------- REMINDERS ---------- */
const reminderBtn = document.querySelector(".btn.secondary");
const reminderSection = document.querySelector(".reminder");

let reminders = JSON.parse(localStorage.getItem("visaReminders")) || [];

/* Render reminders safely */
function renderReminders() {
  // Remove only dynamically added reminders
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

/* Add reminder (real-time user action) */
reminderBtn.addEventListener("click", () => {
  const date = prompt("Enter reminder date (e.g. March 10, 2026)");
  if (!date) return;

  const text = prompt("Enter reminder description");
  if (!text) return;

  reminders.push({ date, text });
  localStorage.setItem("visaReminders", JSON.stringify(reminders));
  renderReminders();
});

/* Initial render */
renderReminders();

/* ---------- EXPORT TIMELINE ---------- */
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

/* ---------- BOTTOM NAV (REAL-TIME ONLY) ---------- */
const navItems = document.querySelectorAll(".nav-item");

/*
  Active state exists ONLY while user is on this page.
  No storage. No memory. No fake persistence.
*/
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
  });
});
