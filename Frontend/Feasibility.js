document.getElementById('addDestBtn').addEventListener('click', function() {
    const country = document.getElementById('countryInput').value;
    const entry = document.getElementById('entryDate').value;
    const exit = document.getElementById('exitDate').value;

    if (!country || !entry || !exit) {
        alert("Please fill in all fields");
        return;
    }

    const container = document.getElementById('destinationList');
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        ${country} (${entry} to ${exit}) 
        <i class="fas fa-times-circle remove-tag"></i>
    `;
    
    container.appendChild(tag);

    // Clear inputs
    document.getElementById('countryInput').value = '';
});

// Remove tag functionality
document.getElementById('destinationList').addEventListener('click', function(e) {
    if(e.target.classList.contains('remove-tag')) {
        e.target.parentElement.remove();
    }
});

// Feasibility Logic Mockup
document.getElementById('checkFeasibility').addEventListener('click', function() {
    const errorAlert = document.getElementById('errorAlert');
    // For demonstration, we toggle the error alert visibility
    if (errorAlert.style.display === 'none' || errorAlert.style.display === '') {
        errorAlert.style.display = 'flex';
    } else {
        errorAlert.style.display = 'none';
    }
});