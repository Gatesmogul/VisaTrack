'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screening');
    const successScreen = document.getElementById('success-screen');

    // If the expected elements aren't present, don't run the animation
    if (!loadingScreen || !successScreen) return;

    // Ensure we have a smooth fade transition even without CSS
    if (!loadingScreen.style.transition) {
        loadingScreen.style.transition = 'opacity 0.5s ease';
    }

    // Simulate a loading delay, then fade out the loading screen and show success
    setTimeout(() => {
        loadingScreen.style.opacity = '0';

        // Wait for the fade to finish before hiding the element and revealing content
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            successScreen.classList.remove('hidden');
        }, 500);

    }, 3000);
});