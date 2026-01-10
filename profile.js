document.addEventListener('DOMContentLoaded', () => {
    // Use the IDs present in the HTML
    const startBtn = document.getElementById('starttracking');
    const profileBtn = document.getElementById('viewprofile');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Navigation to profile page...');
            // uncomment to navigate:
            // window.location.href = '/profile';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            console.log('Navigating to Profile Page...');
        });
    }
});