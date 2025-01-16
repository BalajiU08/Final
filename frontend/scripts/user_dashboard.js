document.addEventListener("DOMContentLoaded", function () {
    // Fetch applied schemes from backend API
    fetch('/api/users/applied-schemes')
        .then(response => response.json())
        .then(schemes => {
            const appliedTableBody = document.getElementById('applied-schemes-table-body');

            schemes.forEach(scheme => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${scheme.name}</td>
                    <td>${scheme.eligibility}</td>
                    <td>${scheme.status}</td>
                `;
                appliedTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching applied schemes:', error);
        });

    // Fetch available schemes from backend API
    fetch('/api/schemes')
        .then(response => response.json())
        .then(schemes => {
            const availableTableBody = document.getElementById('available-schemes-table-body');

            schemes.forEach(scheme => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${scheme.name}</td>
                    <td>${scheme.eligibility}</td>
                    <td><button class="btn btn-primary" onclick="applyForScheme('${scheme._id}')">Apply</button></td>
                `;
                availableTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching available schemes:', error);
        });

    // Apply for scheme functionality
    window.applyForScheme = function (schemeId) {
        const userAadhar = prompt("Please enter your Aadhaar number:");

        if (userAadhar) {
            fetch(`/api/schemes/${schemeId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ aadharNumber: userAadhar })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('You have successfully applied for the scheme.');
                } else {
                    alert('Error applying for the scheme: ' + data.error);
                }
            })
            .catch(error => {
                alert('Error: ' + error);
            });
        }
    }
});
