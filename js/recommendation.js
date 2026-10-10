// ============================================
// ECOCYCLE RECOMMENDATION PAGE
// ============================================

// Check logged-in user
const storedUser = localStorage.getItem("ecocycleUser");

if (!storedUser) {
    window.location.href = "login.html";
}


// ============================================
// LOAD SAVED ASSESSMENT RESULT
// ============================================

const storedAssessment =
    localStorage.getItem("latestAssessment");

if (!storedAssessment) {

    document.getElementById("recommendationTitle").textContent =
        "No Assessment Found";

    document.getElementById("recommendationReason").textContent =
        "Please assess a device first.";

} else {

    try {

        const result = JSON.parse(storedAssessment);

        console.log("Recommendation result:", result);

        displayRecommendation(result);

    } catch (error) {

        console.error(
            "Unable to read recommendation:",
            error
        );

        document.getElementById("recommendationTitle").textContent =
            "Unable to Load Result";

    }

}


// ============================================
// DISPLAY RECOMMENDATION
// ============================================

function displayRecommendation(result) {

    // ----------------------------------------
    // Main recommendation
    // ----------------------------------------

    const recommendation =
        result.recommendation || "Unknown";

    const title =
        document.getElementById("recommendationTitle");

    title.textContent = recommendation;


    // ----------------------------------------
    // Recommendation reason
    // ----------------------------------------

    const reason =
        document.getElementById("recommendationReason");

    reason.textContent =
        result.reason ||
        "EcoCycle analyzed your device using multiple factors.";


    // ----------------------------------------
    // Icon
    // ----------------------------------------

    const icon =
        document.getElementById("resultIcon");

    const icons = {

        REPAIR: "🔧",

        REUSE: "🔄",

        DONATE: "🤝",

        SELL: "💰",

        RECYCLE: "♻️"

    };

    icon.textContent =
        icons[recommendation.toUpperCase()] || "♻️";


    // ----------------------------------------
    // Scores
    // ----------------------------------------

    updateScore(
        "repair",
        result.repairScore
    );

    updateScore(
        "reuse",
        result.reuseScore
    );

    updateScore(
        "donate",
        result.donateScore
    );

    updateScore(
        "sell",
        result.sellScore
    );

    updateScore(
        "recycle",
        result.recycleScore
    );


    // ----------------------------------------
    // Environmental Impact
    // ----------------------------------------

    if (result.environmentalImpact) {

        const impact =
            result.environmentalImpact;


        // Backend property:
        // estimatedEwasteDivertedKg

        const waste =
            impact.estimatedEwasteDivertedKg;


        // Backend property:
        // estimatedUsefulLifeExtensionYears

        const life =
            impact.estimatedUsefulLifeExtensionYears;


        // ------------------------------------
        // Display E-Waste Diverted
        // ------------------------------------

        if (waste !== undefined) {

            const wasteElement =
                document.getElementById(
                    "wasteImpact"
                );

            if (wasteElement) {

                wasteElement.textContent =
                    Number(waste).toFixed(1) + " kg";

            }

        }


        // ------------------------------------
        // Display Useful Life Extension
        // ------------------------------------

        if (life !== undefined) {

            const lifeElement =
                document.getElementById(
                    "lifeExtension"
                );

            if (lifeElement) {

                lifeElement.textContent =
                    Number(life).toFixed(1) + " years";

            }

        }

    }

}


// ============================================
// UPDATE SCORE
// ============================================

function updateScore(name, score) {

    const value =
        Number(score || 0);


    const scoreElement =
        document.getElementById(
            name + "Score"
        );


    const barElement =
        document.getElementById(
            name + "ScoreBar"
        );


    if (scoreElement) {

        scoreElement.textContent =
            value;

    }


    if (barElement) {

        // Scores are displayed as percentages
        // using a maximum visual value of 150.

        const percentage =
            Math.min(
                (value / 150) * 100,
                100
            );

        barElement.style.width =
            percentage + "%";

    }

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