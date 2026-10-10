// ============================================
// ECOCYCLE DEVICE ASSESSMENT
// ============================================

const API_BASE_URL = "http://localhost:8080";


// ============================================
// GET LOGGED-IN USER
// ============================================

const storedUser =
    localStorage.getItem("ecocycleUser");


// ============================================
// PROTECT ASSESSMENT PAGE
// ============================================

if (!storedUser) {
    window.location.href = "login.html";
}


// ============================================
// FORM ELEMENTS
// ============================================

const assessmentForm =
    document.getElementById("assessmentForm");

const assessmentMessage =
    document.getElementById("assessmentMessage");

const assessmentButton =
    document.getElementById("assessmentButton");

const categorySelect =
    document.getElementById("categoryId");


// ============================================
// LOAD DEVICE CATEGORIES
// ============================================

loadCategories();


async function loadCategories() {

    if (!categorySelect) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/categories`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load device categories"
            );

        }


        const categories =
            await response.json();


        console.log(
            "Device categories:",
            categories
        );


        // ----------------------------------------
        // Clear existing options
        // ----------------------------------------

        categorySelect.innerHTML = `
            <option value="">
                Select Device Category
            </option>
        `;


        // ----------------------------------------
        // Add categories from database
        // ----------------------------------------

        categories.forEach(
            function (category) {

                const option =
                    document.createElement("option");

                option.value =
                    category.id;

                option.textContent =
                    category.name;

                categorySelect.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Category loading error:",
            error
        );


        categorySelect.innerHTML = `
            <option value="">
                Unable to load categories
            </option>
        `;
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


// ============================================
// SUBMIT ASSESSMENT
// ============================================

if (assessmentForm) {

    assessmentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ----------------------------------------
            // Clear previous message
            // ----------------------------------------

            assessmentMessage.textContent = "";

            assessmentMessage.style.color =
                "#16834f";


            // ----------------------------------------
            // Disable button
            // ----------------------------------------

            assessmentButton.disabled = true;

            assessmentButton.textContent =
                "Analyzing Device...";


            try {

                // ----------------------------------------
                // Read logged-in user
                // ----------------------------------------

                const user =
                    JSON.parse(storedUser);


                // ----------------------------------------
                // Get form values
                // ----------------------------------------

                const deviceName =
                    document
                        .getElementById("deviceName")
                        .value
                        .trim();


                const brand =
                    document
                        .getElementById("brand")
                        .value
                        .trim();


                const model =
                    document
                        .getElementById("model")
                        .value
                        .trim();


                const categoryId =
                    Number(
                        document
                            .getElementById("categoryId")
                            .value
                    );


                const ageYears =
                    Number(
                        document
                            .getElementById("ageYears")
                            .value
                    );


                const condition =
                    document
                        .getElementById("condition")
                        .value;


                const expectedRemainingLife =
                    Number(
                        document
                            .getElementById(
                                "expectedRemainingLife"
                            )
                            .value
                    );


                const purchasePrice =
                    Number(
                        document
                            .getElementById(
                                "purchasePrice"
                            )
                            .value
                    );


                const currentValue =
                    Number(
                        document
                            .getElementById(
                                "currentValue"
                            )
                            .value
                    );


                const repairCost =
                    Number(
                        document
                            .getElementById(
                                "repairCost"
                            )
                            .value
                    );


                // ----------------------------------------
                // Validate category
                // ----------------------------------------

                if (!categoryId) {

                    assessmentMessage.style.color =
                        "#c0392b";

                    assessmentMessage.textContent =
                        "Please select a device category.";

                    return;
                }


                // ----------------------------------------
                // Prepare assessment data
                // ----------------------------------------

                const assessmentData = {

                    deviceName:
                        deviceName,

                    brand:
                        brand,

                    model:
                        model,

                    ageYears:
                        ageYears,

                    condition:
                        condition,

                    purchasePrice:
                        purchasePrice,

                    currentValue:
                        currentValue,

                    repairCost:
                        repairCost,

                    expectedRemainingLife:
                        expectedRemainingLife,

                    categoryId:
                        categoryId,

                    userId:
                        user.userId

                };


                console.log(
                    "Assessment data:",
                    assessmentData
                );


                // ----------------------------------------
                // Send to Spring Boot
                // ----------------------------------------

                const response =
                    await fetch(
                        `${API_BASE_URL}/api/assessment`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    assessmentData
                                )
                        }
                    );


                // ----------------------------------------
                // Read response
                // ----------------------------------------

                const responseText =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        "Assessment failed"
                    );
                }


                // ----------------------------------------
                // Parse response
                // ----------------------------------------

                let result;

                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    result =
                        responseText;
                }


                console.log(
                    "Assessment result:",
                    result
                );


                // ----------------------------------------
                // Success
                // ----------------------------------------

                assessmentMessage.style.color =
                    "#16834f";

                assessmentMessage.textContent =
                    "Assessment completed successfully!";


                // ----------------------------------------
                // Save latest result
                // ----------------------------------------

                localStorage.setItem(
                    "latestAssessment",
                    JSON.stringify(result)
                );


                // ----------------------------------------
                // Redirect to recommendation
                // ----------------------------------------

                setTimeout(
                    function () {

                        window.location.href =
                            "recommendation.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Assessment error:",
                    error
                );


                assessmentMessage.style.color =
                    "#c0392b";

                assessmentMessage.textContent =
                    "Unable to complete the assessment. Please check your details and try again.";

            } finally {

                assessmentButton.disabled =
                    false;

                assessmentButton.textContent =
                    "Analyze My Device →";

            }

        }
    );
}