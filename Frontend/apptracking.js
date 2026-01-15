document.addEventListener('DOMContentLoaded', () => {
    // Select all action buttons (+ and -)
    const buttons = document.querySelectorAll('.btn-round');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.innerText;
            console.log(`Action clicked: ${action}`);
            
            // Add a simple click effect
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // View Details Button logic
    const viewDetailsBtn = document.querySelector('.view-details');
    if(viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', () => {
            alert('Navigating to detailed application view...');
        });
    }
});