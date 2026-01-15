document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    let isValid = true;

    // Basic Email Validation
    if (!email.includes('@')) {
        document.getElementById('email').parentElement.parentElement.classList.add('error');
        isValid = false;
    } else {
        document.getElementById('email').parentElement.parentElement.classList.remove('error');
    }

    // Basic Phone Validation
    if (phone.length < 10) {
        document.getElementById('phone').parentElement.parentElement.parentElement.classList.add('error');
        isValid = false;
    } else {
        document.getElementById('phone').parentElement.parentElement.parentElement.classList.remove('error');
    }

    if (isValid) {
        alert("Form submitted successfully!");
    }
});

// Remove error styling when user starts typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.closest('.input-group').classList.remove('error');
    });
});