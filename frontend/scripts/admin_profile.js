document.addEventListener("DOMContentLoaded", function () {
    // Example function to load admin profile data
    loadAdminProfile();

    function loadAdminProfile() {
        // Normally this data would be fetched from the backend
        const adminProfile = {
            name: "Admin User",
            email: "admin@example.com",
            role: "Administrator"
        };

        // Populate fields with profile data
        document.getElementById("adminName").value = adminProfile.name;
        document.getElementById("adminEmail").value = adminProfile.email;
        document.getElementById("adminRole").value = adminProfile.role;
    }

    document.getElementById("profile-form").addEventListener("submit", function (e) {
        e.preventDefault();
        // Here, you would send a request to the backend to update the profile
        alert("Profile updated successfully!");
    });
});
