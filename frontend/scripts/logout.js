document.addEventListener("DOMContentLoaded", function () {
    // Here, you can clear any session or localStorage items related to user authentication
    localStorage.removeItem("user");

    // Optionally, redirect after a few seconds
    setTimeout(function () {
        window.location.href = "login.html";
    }, 5000);  // Redirects after 5 seconds
});
