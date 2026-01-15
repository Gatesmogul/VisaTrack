function completeStep() {
    const step = document.getElementById('step-payment');
    
    // UI Feedback for clicking the button
    step.classList.remove('pending');
    step.classList.add('completed');
    
    const content = step.querySelector('.timeline-content');
    
    // Update the HTML to reflect completion
    content.innerHTML = `
        <h4>Payment & Submission</h4>
        <span class="date">Completed Today</span>
        <p style="font-size: 0.85rem; color: green;">✔ Application Submitted</p>
    `;
    
    console.log("Visa status updated: Payment confirmed.");
}

// Optional: Add a subtle scroll reveal effect
window.addEventListener('scroll', () => {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
});