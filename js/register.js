// ============================================
// ECOCYCLE REGISTRATION
// ============================================

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");

const registerButton =
    document.getElementById("registerButton");


// ============================================
// REGISTRATION FORM
// ============================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            registerMessage.textContent = "";
            registerMessage.style.color = "#16834f";

            const name =
                document.getElementById("name")
                    .value.trim();

            const email =
                document.getElementById("email")
                    .value.trim();

            const phone =
                document.getElementById("phone")
                    .value.trim();

            const password =
                document.getElementById("password")
                    .value;

            const confirmPassword =
                document.getElementById("confirmPassword")
                    .value;


            // =================================
            // VALIDATION
            // =================================

            if (
                !name ||
                !email ||
                !phone ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "Please fill in all fields.",
                    "#c0392b"
                );

                return;
            }


            if (phone.length !== 10) {

                showMessage(
                    "Please enter a valid 10-digit phone number.",
                    "#c0392b"
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "#c0392b"
                );

                return;
            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "#c0392b"
                );

                return;
            }


            // =================================
            // DISABLE BUTTON
            // =================================

            registerButton.disabled = true;

            registerButton.textContent =
                "Creating Account...";


            try {

                // =================================
                // SEND DATA TO SPRING BOOT
                // =================================

                const response = await fetch(
                    "https://ecocycle-backend-wakg.onrender.com/api/users",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            phone: phone,

                            password: password,

                            role: "USER"

                        })
                    }
                );


                // Read response safely
                const responseText =
                    await response.text();


                if (!response.ok) {

                    let errorMessage =
                        "Unable to create account.";

                    try {

                        const errorData =
                            JSON.parse(responseText);

                        if (
                            typeof errorData === "string"
                        ) {
                            errorMessage =
                                errorData;
                        }

                        else if (
                            errorData.message
                        ) {
                            errorMessage =
                                errorData.message;
                        }

                    } catch {

                        if (responseText) {
                            errorMessage =
                                responseText;
                        }

                    }

                    throw new Error(
                        errorMessage
                    );
                }


                // =================================
                // SUCCESS
                // =================================

                console.log(
                    "Registration successful:",
                    responseText
                );


                showMessage(
                    "Account created successfully! Redirecting to login...",
                    "#16834f"
                );


                registerForm.reset();


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to create account. Please try again.",
                    "#c0392b"
                );


            } finally {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Create Account";
            }

        }
    );
}


// ============================================
// MESSAGE FUNCTION
// ============================================

function showMessage(
    message,
    color
) {

    if (registerMessage) {

        registerMessage.textContent =
            message;

        registerMessage.style.color =
            color;
    }
}