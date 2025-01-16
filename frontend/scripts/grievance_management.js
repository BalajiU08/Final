document.addEventListener("DOMContentLoaded", function () {
    // Fetch grievances from the server and display them in the table
    fetchGrievances();

    // Handle resolving grievances
    document.getElementById('grievances-table-body').addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('resolve-button')) {
            const grievanceId = event.target.dataset.id;
            resolveGrievance(grievanceId);
        }
    });
});

function fetchGrievances() {
    fetch('/api/grievances') // Endpoint to fetch grievances
        .then(response => response.json())
        .then(data => {
            const grievancesTableBody = document.getElementById('grievances-table-body');
            grievancesTableBody.innerHTML = '';

            data.grievances.forEach(grievance => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${grievance.userName}</td>
                    <td>${grievance.type}</td>
                    <td>${grievance.description}</td>
                    <td>${grievance.status}</td>
                    <td>
                        <button class="btn btn-success resolve-button" data-id="${grievance._id}">Resolve</button>
                    </td>
                `;

                grievancesTableBody.appendChild(row);
            });
        })
        .catch(error => {
            alert('Error fetching grievances: ' + error);
        });
}

function resolveGrievance(grievanceId) {
    fetch(`/api/grievances/${grievanceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Resolved' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Grievance resolved successfully!');
            fetchGrievances(); // Refresh grievances after resolution
        } else {
            alert('Error resolving grievance: ' + data.error);
        }
    })
    .catch(error => {
        alert('Error resolving grievance: ' + error);
    });
}
