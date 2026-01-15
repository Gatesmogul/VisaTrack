const reviewsData = [
  {
    visa: "schengen",
    outcome: "approved",
    title: "Schengen Visa – Germany",
    text: "Approved in 12 days.",
  },
  {
    visa: "h1b",
    outcome: "approved",
    title: "H1B Visa – USA",
    text: "Interview was smooth.",
  },
  {
    visa: "schengen",
    outcome: "rejected",
    title: "Schengen – France",
    text: "Rejected due to documents.",
  },
];

const reviewsContainer = document.getElementById("reviews");
const visaFilter = document.getElementById("visaFilter");
const outcomeFilter = document.getElementById("outcomeFilter");

function renderReviews() {
  reviewsContainer.innerHTML = "";

  const filtered = reviewsData.filter((r) => {
    return (
      (visaFilter.value === "all" || r.visa === visaFilter.value) &&
      (outcomeFilter.value === "all" || r.outcome === outcomeFilter.value)
    );
  });

  filtered.forEach((review) => {
    const div = document.createElement("div");
    div.className = "review";
    div.innerHTML = `
      <strong>${review.title}</strong>
      <p>${review.text}</p>
    `;
    reviewsContainer.appendChild(div);
  });
}

visaFilter.addEventListener("change", renderReviews);
outcomeFilter.addEventListener("change", renderReviews);

// Initial render
renderReviews();
