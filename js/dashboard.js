const API_BASE_URL = "https://ecocycle-backend-wakg.onrender.com";


// ============================================
// GET LOGGED-IN USER
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
// DISPLAY USER NAME
// ============================================

const userName =
    document.getElementById("userName");

if (userName && currentUser) {

    userName.textContent =
        currentUser.name || "User";
}


// ============================================
// LOAD DASHBOARD
// ============================================

loadUserDashboard();


// ============================================
// LOAD USER ASSESSMENT HISTORY
// ============================================

async function loadUserDashboard() {

    if (!currentUser || !currentUser.userId) {

        console.error(
            "User ID not found."
        );

        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/assessment/history/user/${currentUser.userId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load assessment history"
            );
        }

        const history =
            await response.json();

        console.log(
            "User assessment history:",
            history
        );

        updateDashboardStatistics(
            history
        );

        displayRecentActivity(
            history
        );

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        updateDashboardStatistics([]);

        displayRecentActivity([]);
    }
}


// ============================================
// UPDATE DASHBOARD STATISTICS
// ============================================

function updateDashboardStatistics(history) {

    if (!Array.isArray(history)) {

        history = [];
    }


    let recycledCount = 0;

    let totalWaste = 0;

    let actionsCompleted = 0;


    // ========================================
    // PROCESS ASSESSMENTS
    // ========================================

    history.forEach(
        function (assessment) {

            const recommendation =
                assessment.recommendation
                    ? assessment.recommendation.toUpperCase()
                    : "";


            // --------------------------------
            // RECYCLED DEVICES
            // --------------------------------

            if (
                recommendation ===
                "RECYCLE"
            ) {

                recycledCount++;
            }


            // --------------------------------
            // E-WASTE DIVERTED
            // --------------------------------

            const waste =
                Number(
                    assessment.eWasteDiverted
                ) || 0;

            totalWaste += waste;


            // --------------------------------
            // ACTIONS COMPLETED
            // --------------------------------

            if (
                recommendation &&
                recommendation !== "PENDING"
            ) {

                actionsCompleted++;
            }

        }
    );


    // ========================================
    // DEVICES ASSESSED
    // ========================================

    const deviceCount =
        document.getElementById(
            "deviceCount"
        );

    if (deviceCount) {

        deviceCount.textContent =
            history.length;
    }


    // ========================================
    // DEVICES RECYCLED
    // ========================================

    const recycledCountElement =
        document.getElementById(
            "recycledCount"
        );

    if (recycledCountElement) {

        recycledCountElement.textContent =
            recycledCount;
    }


    // ========================================
    // E-WASTE DIVERTED
    // ========================================

    const wasteDiverted =
        document.getElementById(
            "wasteDiverted"
        );

    if (wasteDiverted) {

        wasteDiverted.textContent =
            totalWaste.toFixed(1) +
            " kg";
    }


    // ========================================
    // ACTIONS COMPLETED
    // ========================================

    const actionCount =
        document.getElementById(
            "actionCount"
        );

    if (actionCount) {

        actionCount.textContent =
            actionsCompleted;
    }


    console.log(
        "Dashboard statistics:",
        {
            devicesAssessed: history.length,
            recycledDevices: recycledCount,
            eWasteDiverted: totalWaste,
            actionsCompleted: actionsCompleted
        }
    );
}


// ============================================
// DISPLAY RECENT ACTIVITY
// ============================================

function displayRecentActivity(history) {

    const activityContainer =
        document.getElementById(
            "recentActivity"
        );

    if (!activityContainer) {

        return;
    }


    // ========================================
    // NO HISTORY
    // ========================================

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        activityContainer.innerHTML = `

            <div class="empty-icon">
                📋
            </div>

            <p>
                No assessments yet.
            </p>

            <span>
                Your assessment history will appear here.
            </span>

        `;

        return;
    }


    // ========================================
    // SORT NEWEST FIRST
    // ========================================

    const recent =
        [...history]
            .sort(
                function (a, b) {

                    return new Date(
                        b.assessedAt
                    ) -
                    new Date(
                        a.assessedAt
                    );

                }
            )
            .slice(0, 5);


    // ========================================
    // CREATE RECENT ACTIVITY
    // ========================================

    activityContainer.innerHTML =
        recent.map(
            function (assessment) {

                const device =
                    assessment.device || {};


                const recommendation =
                    assessment.recommendation ||
                    "PENDING";


                const recommendationText =
                    recommendation
                        .charAt(0)
                        .toUpperCase() +
                    recommendation
                        .slice(1)
                        .toLowerCase();


                const assessedDate =
                    assessment.assessedAt
                        ? new Date(
                            assessment.assessedAt
                        ).toLocaleDateString()
                        : "";


                return `

                    <div class="activity-item">

                        <div class="activity-device">

                            <strong>
                                ${
                                    device.deviceName ||
                                    "Electronic Device"
                                }
                            </strong>

                            <span>

                                ${
                                    device.brand ||
                                    ""
                                }

                                ${
                                    device.model ||
                                    ""
                                }

                            </span>

                        </div>


                        <div class="activity-result">

                            <span class="activity-recommendation">

                                ${recommendationText}

                            </span>


                            <small>

                                ${assessedDate}

                            </small>

                        </div>

                    </div>

                `;

            }
        ).join("");
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
        function () {

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