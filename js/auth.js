
 // ============================================
 // ECOCYCLE LOGIN
 // ============================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");
        const button = loginForm.querySelector("button");

        message.textContent = "";

        // VALIDATION
        if (!email || !password) {
            message.textContent = "Please enter your email and password.";
            return;
        }

        button.disabled = true;
        button.textContent = "Logging in...";

        try {
            const response = await fetch(
                "https://ecocycle-backend-wakg.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const responseText = await response.text();

            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                data = responseText;
            }

            // LOGIN FAILED
            if (!response.ok) {
                message.textContent =
                    typeof data === "string"
                        ? data
                        : "Invalid email or password.";
                return;
            }

            // LOGIN SUCCESSFUL
            console.log("Login successful:", data);

            localStorage.setItem(
                "ecocycleUser",
                JSON.stringify(data)
            );

            message.textContent =
                "Login successful! Redirecting...";

            // ROLE-BASED REDIRECT
            setTimeout(function () {
                if (
                    data.role &&
                    data.role.toUpperCase() === "ADMIN"
                ) {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }, 800);

        } catch (error) {
            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the server. Please try again.";
        } finally {
            button.disabled = false;
            button.textContent = "Login";
        }
    });
}
