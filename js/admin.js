// ============================================
// ECOCYCLE ADMIN DASHBOARD
// ============================================

const API_BASE_URL = "https://ecocycle-backend-wakg.onrender.com";


// ============================================
// CHECK ADMIN LOGIN
// ============================================

const storedUser =
    localStorage.getItem("ecocycleUser");

if (!storedUser) {
    window.location.href = "login.html";
}

let currentUser;

try {

    currentUser = JSON.parse(storedUser);

} catch (error) {

    console.error(
        "Invalid login information:",
        error
    );

    localStorage.removeItem("ecocycleUser");

    window.location.href = "login.html";
}


// ============================================
// CHECK ADMIN ROLE
// ============================================

if (
    currentUser &&
    currentUser.role &&
    currentUser.role.toUpperCase() !== "ADMIN"
) {

    window.location.href = "dashboard.html";
}


// ============================================
// LOAD DASHBOARD
// ============================================

loadUsers();
loadDevices();
loadAssessments();


// ============================================
// LOAD USERS
// ============================================

async function loadUsers() {

    const loading =
        document.getElementById("usersLoading");

    const container =
        document.getElementById(
            "usersTableContainer"
        );

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/users`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load users"
            );
        }

        const users =
            await response.json();

        console.log(
            "Admin users:",
            users
        );


        // Total users

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        if (totalUsers) {
            totalUsers.textContent =
                users.length;
        }


        // Display users

        tableBody.innerHTML =
            users.map(function (user) {

                return `

                    <tr>

                        <td>
                            ${user.id}
                        </td>

                        <td>
                            ${user.name || "—"}
                        </td>

                        <td>
                            ${user.email || "—"}
                        </td>

                        <td>
                            ${user.phone || "—"}
                        </td>

                        <td>
                            <span class="role-badge">
                                ${user.role || "USER"}
                            </span>
                        </td>

                        <td>

                            <button
                                class="admin-delete-button"
                                onclick="deleteUser(${user.id})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");


        loading.style.display =
            "none";

        container.style.display =
            "block";


    } catch (error) {

        console.error(
            "Admin users error:",
            error
        );

        loading.textContent =
            "Unable to load users.";

    }
}


// ============================================
// LOAD DEVICES
// ============================================

async function loadDevices() {

    const loading =
        document.getElementById(
            "devicesLoading"
        );

    const container =
        document.getElementById(
            "devicesTableContainer"
        );

    const tableBody =
        document.getElementById(
            "devicesTableBody"
        );

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/devices`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load devices"
            );
        }

        const devices =
            await response.json();

        console.log(
            "Admin devices:",
            devices
        );


        // Total devices

        const totalDevices =
            document.getElementById(
                "totalDevices"
            );

        if (totalDevices) {
            totalDevices.textContent =
                devices.length;
        }


        // Display devices

        tableBody.innerHTML =
            devices.map(function (device) {

                const userName =
                    device.user &&
                    device.user.name
                        ? device.user.name
                        : "—";


                return `

                    <tr>

                        <td>
                            ${device.id}
                        </td>

                        <td>
                            ${device.deviceName || "—"}
                        </td>

                        <td>
                            ${device.brand || "—"}
                        </td>

                        <td>
                            ${device.condition || "—"}
                        </td>

                        <td>
                            ${userName}
                        </td>

                        <td>

                            <button
                                class="admin-delete-button"
                                onclick="deleteDevice(${device.id})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");


        loading.style.display =
            "none";

        container.style.display =
            "block";


    } catch (error) {

        console.error(
            "Admin devices error:",
            error
        );

        loading.textContent =
            "Unable to load devices.";

    }
}


// ============================================
// LOAD ASSESSMENT HISTORY
// ============================================

async function loadAssessments() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/assessment/history/all`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load assessment history"
            );
        }

        const assessments =
            await response.json();

        console.log(
            "Admin assessment history:",
            assessments
        );


        calculateAnalytics(
            assessments
        );


    } catch (error) {

        console.error(
            "Assessment history error:",
            error
        );

        calculateAnalytics([]);

    }
}


// ============================================
// CALCULATE ANALYTICS
// ============================================

function calculateAnalytics(
    assessments
) {

    if (!Array.isArray(assessments)) {
        assessments = [];
    }


    // ----------------------------------------
    // Recommendation counters
    // ----------------------------------------

    let repairCount = 0;
    let reuseCount = 0;
    let donateCount = 0;
    let sellCount = 0;
    let recycleCount = 0;


    // ----------------------------------------
    // Environmental impact
    // ----------------------------------------

    let totalWaste = 0;


    // ----------------------------------------
    // Process every assessment
    // ----------------------------------------

    assessments.forEach(
        function (assessment) {

            const recommendation =
                assessment.recommendation
                    ? assessment.recommendation.toUpperCase()
                    : "";


            switch (recommendation) {

                case "REPAIR":
                    repairCount++;
                    break;

                case "REUSE":
                    reuseCount++;
                    break;

                case "DONATE":
                    donateCount++;
                    break;

                case "SELL":
                    sellCount++;
                    break;

                case "RECYCLE":
                    recycleCount++;
                    break;

            }


            // E-waste diverted

            const waste =
                Number(
                    assessment.eWasteDiverted
                ) || 0;

            totalWaste += waste;

        }
    );


    // ========================================
    // UPDATE ANALYTICS CARDS
    // ========================================

    const repairElement =
        document.getElementById(
            "repairCount"
        );

    if (repairElement) {
        repairElement.textContent =
            repairCount;
    }


    const reuseElement =
        document.getElementById(
            "reuseCount"
        );

    if (reuseElement) {
        reuseElement.textContent =
            reuseCount;
    }


    const donateElement =
        document.getElementById(
            "donateCount"
        );

    if (donateElement) {
        donateElement.textContent =
            donateCount;
    }


    const sellElement =
        document.getElementById(
            "sellCount"
        );

    if (sellElement) {
        sellElement.textContent =
            sellCount;
    }


    const recycleElement =
        document.getElementById(
            "recycleCount"
        );

    if (recycleElement) {
        recycleElement.textContent =
            recycleCount;
    }


    // ========================================
    // UPDATE RECYCLED DEVICES
    // ========================================

    const recycledDevices =
        document.getElementById(
            "recycledDevices"
        );

    if (recycledDevices) {

        recycledDevices.textContent =
            recycleCount;
    }


    // ========================================
    // UPDATE TOTAL E-WASTE
    // ========================================

    const totalWasteElement =
        document.getElementById(
            "totalWaste"
        );

    if (totalWasteElement) {

        totalWasteElement.textContent =
            totalWaste.toFixed(1) + " kg";
    }


    // ========================================
    // RECOMMENDATION DISTRIBUTION
    // ========================================

    const totalRecommendations =
        repairCount +
        reuseCount +
        donateCount +
        sellCount +
        recycleCount;


    const safeTotal =
        totalRecommendations > 0
            ? totalRecommendations
            : 1;


    // ----------------------------------------
    // Calculate percentages
    // ----------------------------------------

    const repairPercentage =
        (repairCount / safeTotal) * 100;

    const reusePercentage =
        (reuseCount / safeTotal) * 100;

    const donatePercentage =
        (donateCount / safeTotal) * 100;

    const sellPercentage =
        (sellCount / safeTotal) * 100;

    const recyclePercentage =
        (recycleCount / safeTotal) * 100;


    // ----------------------------------------
    // Update Repair Bar
    // ----------------------------------------

    const repairBar =
        document.getElementById(
            "repairBar"
        );

    if (repairBar) {

        repairBar.style.width =
            repairPercentage + "%";
    }


    // ----------------------------------------
    // Update Reuse Bar
    // ----------------------------------------

    const reuseBar =
        document.getElementById(
            "reuseBar"
        );

    if (reuseBar) {

        reuseBar.style.width =
            reusePercentage + "%";
    }


    // ----------------------------------------
    // Update Donate Bar
    // ----------------------------------------

    const donateBar =
        document.getElementById(
            "donateBar"
        );

    if (donateBar) {

        donateBar.style.width =
            donatePercentage + "%";
    }


    // ----------------------------------------
    // Update Sell Bar
    // ----------------------------------------

    const sellBar =
        document.getElementById(
            "sellBar"
        );

    if (sellBar) {

        sellBar.style.width =
            sellPercentage + "%";
    }


    // ----------------------------------------
    // Update Recycle Bar
    // ----------------------------------------

    const recycleBar =
        document.getElementById(
            "recycleBar"
        );

    if (recycleBar) {

        recycleBar.style.width =
            recyclePercentage + "%";
    }


    // ========================================
    // UPDATE CHART COUNTS
    // ========================================

    const repairChartCount =
        document.getElementById(
            "repairChartCount"
        );

    if (repairChartCount) {

        repairChartCount.textContent =
            repairCount;
    }


    const reuseChartCount =
        document.getElementById(
            "reuseChartCount"
        );

    if (reuseChartCount) {

        reuseChartCount.textContent =
            reuseCount;
    }


    const donateChartCount =
        document.getElementById(
            "donateChartCount"
        );

    if (donateChartCount) {

        donateChartCount.textContent =
            donateCount;
    }


    const sellChartCount =
        document.getElementById(
            "sellChartCount"
        );

    if (sellChartCount) {

        sellChartCount.textContent =
            sellCount;
    }


    const recycleChartCount =
        document.getElementById(
            "recycleChartCount"
        );

    if (recycleChartCount) {

        recycleChartCount.textContent =
            recycleCount;
    }


    // ========================================
    // CONSOLE INFORMATION
    // ========================================

    console.log(
        "Recommendation Analytics:",
        {
            repair: repairCount,
            reuse: reuseCount,
            donate: donateCount,
            sell: sellCount,
            recycle: recycleCount,
            eWasteDiverted: totalWaste
        }
    );
}


// ============================================
// DELETE USER
// ============================================

async function deleteUser(
    userId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/users/${userId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete user"
            );

        }


        alert(
            "User deleted successfully."
        );


        loadUsers();


    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        alert(
            "Unable to delete user."
        );

    }
}


// ============================================
// DELETE DEVICE
// ============================================

async function deleteDevice(
    deviceId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this device?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/admin/devices/${deviceId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete device"
            );

        }


        alert(
            "Device deleted successfully."
        );


        loadDevices();


    } catch (error) {

        console.error(
            "Delete device error:",
            error
        );

        alert(
            "Unable to delete device."
        );

    }
}


// ============================================
// LOGOUT
// ============================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem(
                "ecocycleUser"
            );

            localStorage.removeItem(
                "latestAssessment"
            );

            window.location.href =
                "login.html";

        }
    );
}