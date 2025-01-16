document.addEventListener("DOMContentLoaded", function () {
    // Fetch Data (example)
    fetchDashboardData();

    // Placeholder function for fetching dashboard data
    function fetchDashboardData() {
        // Example fetch data for total users, total schemes, pending grievances, and recent activities
        document.getElementById("totalUsers").textContent = "1200"; // Example data
        document.getElementById("totalSchemes").textContent = "30";  // Example data
        document.getElementById("pendingGrievances").textContent = "5"; // Example data

        // Dynamically populate recent activities
        const recentActivities = [
            { id: 1, activity: "New user registered", date: "2025-01-16" },
            { id: 2, activity: "New scheme added", date: "2025-01-15" },
            { id: 3, activity: "Grievance resolved", date: "2025-01-14" }
        ];

        const recentActivitiesTableBody = document.getElementById("recentActivities");
        recentActivities.forEach(activity => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${activity.id}</td>
                <td>${activity.activity}</td>
                <td>${activity.date}</td>
            `;
            recentActivitiesTableBody.appendChild(row);
        });
    }
});
