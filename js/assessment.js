
const API_BASE_URL = "https://ecocycle-backend-wakg.onrender.com";

// Get logged-in user
const storedUser = localStorage.getItem("ecocycleUser");

// Protect assessment page
if (!storedUser) {
    window.location.href = "login.html";
}

let loggedInUser = null;

try {
    loggedInUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
    console.error("Invalid logged-in user data:", error);
}

if (!loggedInUser || !loggedInUser.userId) {
    localStorage.removeItem("ecocycleUser");
    window.location.href = "login.html";
}

// Form elements
const assessmentForm = document.getElementById("assessmentForm");
const assessmentMessage = document.getElementById("assessmentMessage");
const assessmentButton = document.getElementById("assessmentButton");
const categorySelect = document.getElementById("categoryId");

// Convert a blank optional numeric field to null.
// Do not turn blank fields into zero.
function optionalNumber(fieldId) {
    const element = document.getElementById(fieldId);

    if (!element || element.value.trim() === "") {
        return null;
    }

    const value = Number(element.value);

    return Number.isFinite(value) ? value : null;
}

// Load device categories from backend
async function loadCategories() {
    if (!categorySelect) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/categories`
        );

        if (!response.ok) {
            throw new Error("Unable to load device categories");
        }

        const categories = await response.json();

        categorySelect.innerHTML =
            '<option value="">Select Device Category</option>';

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Category loading error:", error);

        categorySelect.innerHTML =
            '<option value="">Unable to load categories</option>';

        showMessage(
            "Unable to load device categories. Check that the backend is running.",
            false
        );
    }
}

loadCategories();

// Show a message to the user
function showMessage(message, success) {
    if (!assessmentMessage) {
        return;
    }

    assessmentMessage.textContent = message;
    assessmentMessage.style.color = success ? "#16834f" : "#c0392b";
}

// Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("ecocycleUser");
        localStorage.removeItem("latestAssessment");
        window.location.href = "login.html";
    });
}

// Submit assessment
if (assessmentForm) {
    assessmentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        showMessage("", true);

        if (assessmentButton) {
            assessmentButton.disabled = true;
            assessmentButton.textContent = "Analyzing Device...";
        }

        try {
            const deviceName =
                document.getElementById("deviceName")?.value.trim() || "";

            const brand =
                document.getElementById("brand")?.value.trim() || "";

            const model =
                document.getElementById("model")?.value.trim() || "";

            const categoryValue =
                categorySelect?.value || "";

            const categoryId =
                categoryValue === "" ? null : Number(categoryValue);

            const ageYears = optionalNumber("ageYears");

            const condition =
                document.getElementById("condition")?.value || "";

            const problemDescription =
                document.getElementById("problemDescription")?.value.trim() || "";

            const purchasePrice = optionalNumber("purchasePrice");
            const currentValue = optionalNumber("currentValue");
            const repairCost = optionalNumber("repairCost");
            const expectedRemainingLife =
                optionalNumber("expectedRemainingLife");

            // Validate required fields
            if (!deviceName) {
                showMessage("Please enter the device name.", false);
                return;
            }

            if (!categoryId || !Number.isInteger(categoryId)) {
                showMessage("Please select a device category.", false);
                return;
            }

            if (ageYears !== null && (!Number.isInteger(ageYears) || ageYears < 0)) {
                showMessage("Device age must be a non-negative whole number.", false);
                return;
            }

            if (purchasePrice !== null && purchasePrice < 0) {
                showMessage("Purchase price cannot be negative.", false);
                return;
            }

            if (currentValue !== null && currentValue < 0) {
                showMessage("Current value cannot be negative.", false);
                return;
            }

            if (repairCost !== null && repairCost < 0) {
                showMessage("Repair cost cannot be negative.", false);
                return;
            }

            if (
                expectedRemainingLife !== null &&
                (!Number.isInteger(expectedRemainingLife) ||
                    expectedRemainingLife < 0)
            ) {
                showMessage(
                    "Expected remaining life must be a non-negative whole number.",
                    false
                );
                return;
            }

            // Prepare request for Spring Boot
            const assessmentData = {
                deviceName: deviceName,
                brand: brand || null,
                model: model || null,
                ageYears: ageYears,
                condition: condition || null,
                problemDescription: problemDescription || null,
                purchasePrice: purchasePrice,
                currentValue: currentValue,
                repairCost: repairCost,
                expectedRemainingLife: expectedRemainingLife,
                categoryId: categoryId,
                userId: loggedInUser.userId
            };

            console.log("Assessment data:", assessmentData);

            const response = await fetch(
                `${API_BASE_URL}/api/assessment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(assessmentData)
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                console.error("Assessment API error:", responseText);

                throw new Error(
                    responseText || "Assessment failed"
                );
            }

            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                result = responseText;
            }

            console.log("Assessment result:", result);

            showMessage("Assessment completed successfully!", true);

            localStorage.setItem(
                "latestAssessment",
                JSON.stringify(result)
            );

            window.setTimeout(function () {
                window.location.href = "recommendation.html";
            }, 1000);

        } catch (error) {
            console.error("Assessment error:", error);

            showMessage(
                error.message && error.message !== "Failed to fetch"
                    ? "Assessment failed. Please check the form and try again."
                    : "Unable to connect to the backend. Make sure Spring Boot is running.",
                false
            );
        } finally {
            if (assessmentButton) {
                assessmentButton.disabled = false;
                assessmentButton.textContent = "Analyze My Device →";
            }
        }
    });
}
