document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const aadhaar = document.getElementById('aadhaar').value.trim();

    try {
        // Send login data to backend
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, aadhaar }),
        });

        // Handle non-JSON responses (e.g., empty response or error message)
        let responseData;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            throw new Error('Invalid response format');
        }

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(responseData.message || 'Login failed. Please try again.');
        }

        // Check if the response has a token and role
        if (!responseData.token || !responseData.role) {
            throw new Error('Invalid response format');
        }

        // Save JWT token
        localStorage.setItem('token', responseData.token);

        // Redirect based on role
        if (responseData.role === 'Admin') {
            window.location.href = 'admin_dashboard.html';
        } else if (responseData.role === 'User') {
            window.location.href = 'user_dashboard.html';
        } else {
            throw new Error('Invalid user role');
        }
    } catch (error) {
        // Display error message
        alert(error.message);
    }
});
