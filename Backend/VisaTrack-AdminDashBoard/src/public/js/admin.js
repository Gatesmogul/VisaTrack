document.addEventListener('DOMContentLoaded', function() {
    const visaTableBody = document.getElementById('visa-requirements-table-body');
    const addVisaForm = document.getElementById('add-visa-form');
    const visaNameInput = document.getElementById('visa-name');
    const visaCountryInput = document.getElementById('visa-country');
    const visaRequirementsInput = document.getElementById('visa-requirements');

    // Fetch and display visa requirements
    function fetchVisaRequirements() {
        fetch('/api/visas')
            .then(response => response.json())
            .then(data => {
                visaTableBody.innerHTML = '';
                data.forEach(visa => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${visa.name}</td>
                        <td>${visa.country}</td>
                        <td>${visa.requirements}</td>
                        <td>
                            <button class="edit-btn" data-id="${visa._id}">Edit</button>
                            <button class="delete-btn" data-id="${visa._id}">Delete</button>
                        </td>
                    `;
                    visaTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching visa requirements:', error));
    }

    // Add new visa requirement
    addVisaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newVisa = {
            name: visaNameInput.value,
            country: visaCountryInput.value,
            requirements: visaRequirementsInput.value
        };

        fetch('/api/visas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVisa)
        })
        .then(response => response.json())
        .then(data => {
            fetchVisaRequirements();
            addVisaForm.reset();
        })
        .catch(error => console.error('Error adding visa requirement:', error));
    });

    // Event delegation for edit and delete buttons
    visaTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const visaId = event.target.getAttribute('data-id');
            fetch(`/api/visas/${visaId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    fetchVisaRequirements();
                }
            })
            .catch(error => console.error('Error deleting visa requirement:', error));
        }

        if (event.target.classList.contains('edit-btn')) {
            const visaId = event.target.getAttribute('data-id');
            // Logic for editing visa requirement can be implemented here
        }
    });

    // Initial fetch of visa requirements
    fetchVisaRequirements();
});