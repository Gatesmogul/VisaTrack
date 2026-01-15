const visaData = {
    us: { tourist: 185, student: 185, work: 205, biometric: 0, health: 0 },
    uk: { tourist: 120, student: 615, work: 820, biometric: 25, health: 980 },
    ca: { tourist: 75, student: 110, work: 115, biometric: 65, health: 0 },
    au: { tourist: 125, student: 480, work: 210, biometric: 0, health: 350 }
};

function updateEstimator() {
    const dest = document.getElementById('destination').value;
    const type = document.getElementById('visaType').value;
    const speed = document.getElementById('processing').value;

    const data = visaData[dest];
    let base = data[type];
    let bio = data[biometric];
    let health = data.health;
    
    // Add Priority Fee logic
    let priorityAddon = (speed === 'priority') ? 250 : 0;

    // Display logic
    document.getElementById('baseFee').innerText = `$${base.toFixed(2)}`;
    document.getElementById('biometricFee').innerText = `$${data.biometric.toFixed(2)}`;
    document.getElementById('healthFee').innerText = `$${health.toFixed(2)}`;
    
    const total = base + data.biometric + health + priorityAddon;
    document.getElementById('totalFee').innerText = `$${total.toFixed(2)}`;

    // Hide health row if $0
    const healthRow = document.getElementById('healthSurchargeRow');
    healthRow.style.display = (health > 0) ? 'flex' : 'none';
}

// Initialize on load
window.onload = updateEstimator;