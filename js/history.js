// ============================================
// ECOCYCLE ASSESSMENT HISTORY
// ============================================

const API_BASE_URL = "http://localhost:8080";

// ============================================
// CHECK LOGGED-IN USER
// ============================================

const storedUser = localStorage.getItem("ecocycleUser");

if (!storedUser) {
    window.location.href = "login.html";
}


// ============================================
// PAGE ELEMENTS
// ============================================

const historyLoading =
    document.getElementById("historyLoading");

const historyEmpty =
    document.getElementById("historyEmpty");

const historyList =
    document.getElementById("historyList");


// ============================================
// LOAD USER HISTORY
// ============================================

if (storedUser) {

    try {

        const user = JSON.parse(storedUser);

        if (!user.userId) {
            throw new Error("User ID not found.");
        }

        loadHistory(user.userId);

    } catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

        window.location.href = "login.html";
    }
}


// ============================================
// FETCH ASSESSMENT HISTORY
// ============================================

async function loadHistory(userId) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/assessment/history/user/${userId}`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load assessment history"
            );
        }

        const assessments =
            await response.json();

        console.log(
            "Assessment history:",
            assessments
        );

        displayHistory(assessments);

    } catch (error) {

        console.error(
            "History error:",
            error
        );

        if (historyLoading) {
            historyLoading.textContent =
                "Unable to load your assessment history. Please make sure the backend is running.";
        }
    }
}


// ============================================
// DISPLAY HISTORY
// ============================================

function displayHistory(assessments) {

    if (historyLoading) {
        historyLoading.style.display = "none";
    }


    // ========================================
    // NO ASSESSMENTS
    // ========================================

    if (
        !Array.isArray(assessments) ||
        assessments.length === 0
    ) {

        if (historyEmpty) {
            historyEmpty.style.display = "block";
        }

        if (historyList) {
            historyList.style.display = "none";
        }

        return;
    }


    // ========================================
    // ASSESSMENTS FOUND
    // ========================================

    if (historyEmpty) {
        historyEmpty.style.display = "none";
    }

    if (historyList) {
        historyList.style.display = "flex";
    }


    // ========================================
    // SORT NEWEST FIRST
    // ========================================

    const sortedAssessments =
        assessments
            .slice()
            .sort(function (a, b) {

                return new Date(
                    b.assessedAt || 0
                ) - new Date(
                    a.assessedAt || 0
                );

            });


    // ========================================
    // CREATE HISTORY CARDS
    // ========================================

    historyList.innerHTML =
        sortedAssessments
            .map(function (assessment) {

                // --------------------------------
                // Device information
                // --------------------------------

                const device =
                    assessment.device || {};

                const deviceName =
                    device.deviceName ||
                    "Electronic Device";

                const brand =
                    device.brand ||
                    "Unknown Brand";

                const model =
                    device.model ||
                    "Unknown Model";

                const condition =
                    device.condition ||
                    "Not specified";


                // --------------------------------
                // Recommendation
                // --------------------------------

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


                // --------------------------------
                // Reason
                // --------------------------------

                const reason =
                    assessment.reason ||
                    "EcoCycle analyzed this device using multiple factors.";


                // --------------------------------
                // Environmental impact
                // --------------------------------

                const wasteValue =
                    Number(
                        assessment.eWasteDiverted
                    );

                const lifeValue =
                    Number(
                        assessment.usefulLifeExtension
                    );


                const waste =
                    Number.isFinite(wasteValue)
                        ? wasteValue.toFixed(1) + " kg"
                        : "—";


                const life =
                    Number.isFinite(lifeValue)
                        ? lifeValue.toFixed(1) + " years"
                        : "—";


                // --------------------------------
                // Date
                // --------------------------------

                let assessedDate = "";

                if (assessment.assessedAt) {

                    assessedDate =
                        new Date(
                            assessment.assessedAt
                        ).toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        );
                }


                // --------------------------------
                // History card
                // --------------------------------

                return `

                    <div class="history-item">

                        <div class="history-item-top">

                            <div class="history-device">

                                <div class="history-device-icon">
                                    💻
                                </div>

                                <div>

                                    <h3>
                                        ${deviceName}
                                    </h3>

                                    <p>
                                        ${brand} ${model}
                                    </p>

                                </div>

                            </div>


                            <div class="recommendation-badge">
                                ${recommendationText}
                            </div>

                        </div>


                        <div class="history-details">

                            <div class="history-detail">

                                <span>
                                    Condition
                                </span>

                                <strong>
                                    ${condition}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    E-Waste Diverted
                                </span>

                                <strong>
                                    ${waste}
                                </strong>

                            </div>


                            <div class="history-detail">

                                <span>
                                    Useful Life Extension
                                </span>

                                <strong>
                                    ${life}
                                </strong>

                            </div>

                        </div>


                        <div class="history-reason">

                            <strong>
                                Why this recommendation?
                            </strong>

                            <p>
                                ${reason}
                            </p>

                        </div>


                        ${
                            assessedDate
                                ? `
                                    <div class="history-date">
                                        Assessed on ${assessedDate}
                                    </div>
                                  `
                                : ""
                        }

                    </div>

                `;

            })
            .join("");
}


// ============================================
// LOGOUT
// ============================================

const logoutButton =
    document.getElementById("logoutButton");

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