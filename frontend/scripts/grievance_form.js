document.addEventListener("DOMContentLoaded", function () {
    const grievanceForm = document.getElementById('grievance-form');

    grievanceForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const grievanceType = document.getElementById('grievance-type').value;
        const description = document.getElementById('description').value;

        const grievanceData = {
            type: grievanceType,
            description: description
        };

        fetch('/api/grievances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(grievanceData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Grievance submitted successfully!');
                window.location.href = 'user_dashboard.html'; // Redirect to User Dashboard after submission
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
    });
});
