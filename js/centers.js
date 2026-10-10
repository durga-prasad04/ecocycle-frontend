// ============================================
// ECOCYCLE CENTERS PAGE
// ============================================

// Check logged-in user
const storedUser = localStorage.getItem("ecocycleUser");

if (!storedUser) {
    window.location.href = "login.html";
}


// ============================================
// PAGE ELEMENTS
// ============================================

const centersLoading =
    document.getElementById("centersLoading");

const centersEmpty =
    document.getElementById("centersEmpty");

const centersList =
    document.getElementById("centersList");

const centerType =
    document.getElementById("centerType");

const centerCity =
    document.getElementById("centerCity");

const searchCentersButton =
    document.getElementById("searchCentersButton");


// ============================================
// LOAD ALL CENTERS
// ============================================

loadCenters();


// ============================================
// FETCH CENTERS
// ============================================

async function loadCenters() {

    centersLoading.style.display = "block";
    centersEmpty.style.display = "none";
    centersList.style.display = "none";

    try {

        const response = await fetch(
            "http://localhost:8080/api/centers"
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load centers"
            );
        }

        const centers =
            await response.json();

        console.log(
            "Centers loaded:",
            centers
        );

        displayCenters(centers);

    } catch (error) {

        console.error(
            "Centers error:",
            error
        );

        centersLoading.textContent =
            "Unable to load centers. Please make sure the backend is running.";
    }
}


// ============================================
// SEARCH CENTERS
// ============================================

if (searchCentersButton) {

    searchCentersButton.addEventListener(
        "click",
        function () {

            searchCenters();

        }
    );
}


async function searchCenters() {

    const type =
        centerType.value;

    const city =
        centerCity.value.trim();


    centersLoading.style.display = "block";
    centersEmpty.style.display = "none";
    centersList.style.display = "none";


    try {

        let url =
            "http://localhost:8080/api/centers";


        // Type + City
        if (
            type !== "ALL" &&
            city !== ""
        ) {

            url =
                `http://localhost:8080/api/centers/type/${encodeURIComponent(type)}/city/${encodeURIComponent(city)}`;

        }

        // Type only
        else if (
            type !== "ALL"
        ) {

            url =
                `http://localhost:8080/api/centers/type/${encodeURIComponent(type)}`;

        }

        // City only
        else if (
            city !== ""
        ) {

            url =
                `http://localhost:8080/api/centers/city/${encodeURIComponent(city)}`;

        }


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to search centers"
            );

        }


        const centers =
            await response.json();


        console.log(
            "Search results:",
            centers
        );


        displayCenters(centers);


    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        centersLoading.textContent =
            "Unable to search centers.";

    }
}


// ============================================
// DISPLAY CENTERS
// ============================================

function displayCenters(centers) {

    centersLoading.style.display = "none";


    if (
        !centers ||
        centers.length === 0
    ) {

        centersEmpty.style.display = "block";

        centersList.style.display = "none";

        return;
    }


    centersEmpty.style.display = "none";

    centersList.style.display = "grid";


    centersList.innerHTML =
        centers.map(function (center) {

            const type =
                center.type || "CENTER";


            let icon = "📍";


            if (type === "REPAIR") {
                icon = "🔧";
            }

            else if (type === "RECYCLING") {
                icon = "♻️";
            }

            else if (type === "DONATION") {
                icon = "🤝";
            }


            return `

                <article class="center-card">

                    <div class="center-card-top">

                        <div class="center-icon">
                            ${icon}
                        </div>

                        <span class="center-type">
                            ${type}
                        </span>

                    </div>


                    <h2>
                        ${center.name || "Unnamed Center"}
                    </h2>


                    <p class="center-description">
                        ${center.description || "Electronic support center."}
                    </p>


                    <div class="center-info">

                        <div class="center-info-item">

                            <span class="info-icon">
                                📍
                            </span>

                            <span>
                                ${center.address || "Address unavailable"},
                                ${center.city || ""},
                                ${center.state || ""}
                            </span>

                        </div>


                        <div class="center-info-item">

                            <span class="info-icon">
                                📞
                            </span>

                            <span>
                                ${center.phone || "Phone unavailable"}
                            </span>

                        </div>


                        <div class="center-info-item">

                            <span class="info-icon">
                                ✉️
                            </span>

                            <span>
                                ${center.email || "Email unavailable"}
                            </span>

                        </div>

                    </div>

                </article>

            `;

        }).join("");
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