document.addEventListener("DOMContentLoaded", function () {
    // Example function to load user profile data
    loadUserProfile();

    function loadUserProfile() {
        // Normally this data would be fetched from the backend
        const userProfile = {
            name: "John Doe",
            email: "johndoe@example.com",
            occupation: "Software Developer",
            annualIncome: 75000
        };

        // Populate fields with profile data
        document.getElementById("userName").value = userProfile.name;
        document.getElementById("userEmail").value = userProfile.email;
        document.getElementById("userOccupation").value = userProfile.occupation;
        document.getElementById("userAnnualIncome").value = userProfile.annualIncome;
    }

    document.getElementById("profile-form").addEventListener("submit", function (e) {
        e.preventDefault();
        // Here, you would send a request to the backend to update the profile
        alert("Profile updated successfully!");
    });
});
