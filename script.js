
/* ======================================== */
/* ROCINANTE SHIP COMMAND INTERFACE         */
/* COMPLETE JAVASCRIPT                      */
/* ======================================== */

// All ship systems are simulated.


/* ======================================== */
/* SHIP SYSTEM STATE                        */
/* ======================================== */

const shipState = {
    authorized: false,
    driveOnline: false,
    reactorPower: 67
};


/* ======================================== */
/* NAVIGATION                               */
/* ======================================== */

const navButtons = document.querySelectorAll(".nav-button");
const viewPanels = document.querySelectorAll(".view-panel");

function showPanel(panelName) {

    navButtons.forEach(button => {

        const isActive = button.dataset.panel === panelName;

        button.classList.toggle("active", isActive);

    });

    viewPanels.forEach(panel => {

        panel.hidden = panel.id !== panelName;

    });

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPanel(button.dataset.panel);

    });

});


/* ======================================== */
/* COMMAND AUTHORIZATION                    */
/* ======================================== */

const authorizeButton =
    document.getElementById("authorize-command");

const commandStatus =
    document.getElementById("command-status");

const driveButton =
    document.getElementById("activate-drive");

const driveStatus =
    document.getElementById("drive-status");


authorizeButton.addEventListener("click", () => {

    if (shipState.authorized) return;

    shipState.authorized = true;

    commandStatus.textContent =
        "COMMAND AUTHORIZATION GRANTED";

    commandStatus.classList.add("authorized");

    authorizeButton.textContent = "COMMAND ACTIVE";

    authorizeButton.classList.add("authorized");

    authorizeButton.disabled = true;

    driveButton.disabled = false;

    driveButton.textContent = "ACTIVATE DRIVE";

});


/* ======================================== */
/* EPSTEIN DRIVE ACTIVATION                 */
/* ======================================== */

driveButton.addEventListener("click", () => {

    if (!shipState.authorized) return;

    shipState.driveOnline = !shipState.driveOnline;

    if (shipState.driveOnline) {

        driveStatus.textContent = "● DRIVE ONLINE";

        driveStatus.classList.remove("status-amber");
        driveStatus.classList.add("status-green");

        driveButton.textContent = "DEACTIVATE DRIVE";

    } else {

        driveStatus.textContent = "● STANDBY";

        driveStatus.classList.remove("status-green");
        driveStatus.classList.add("status-amber");

        driveButton.textContent = "ACTIVATE DRIVE";

    }

    updateShipTelemetry();

});


/* ======================================== */
/* TELEMETRY HELPERS                        */
/* ======================================== */

// Generate a random number in a range.

function randomReading(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


// Update a numerical readout and progress bar.

function updateMeter(valueId, barId, reading) {

    const valueElement =
        document.getElementById(valueId);

    const barElement =
        document.getElementById(barId);

    if (!valueElement || !barElement) return;

    valueElement.textContent = `${reading}%`;

    barElement.style.width = `${reading}%`;

}


/* ======================================== */
/* REACTOR TELEMETRY                        */
/* ======================================== */


/* ======================================== */
/* REACTOR AND DRIVE TELEMETRY              */
/* ======================================== */

// Simulated temperatures are normalized percentages.
let engineTemperature = 20;
let coreTemperature = 25;

// Generate a random number in a range.
function telemetryVariation(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gradually approach a target temperature.
function approachTemperature(current, target, step) {
    if (current < target) {
        return Math.min(current + step, target);
    }

    if (current > target) {
        return Math.max(current - step, target);
    }

    return current;
}

function updateReactorTelemetry() {

    const driveOnline = shipState.driveOnline;

    // Reactor maintains power for essential ship systems.
    const baseOutput = driveOnline ? 82 : 15;

    const variation = driveOnline
        ? telemetryVariation(-4, 4)
        : telemetryVariation(-2, 2);

    shipState.reactorPower = Math.max(
        0,
        Math.min(100, baseOutput + variation)
    );

    document.getElementById("reactor-output").textContent =
        `${shipState.reactorPower}%`;

    document.getElementById("reactor-gauge").style.setProperty(
        "--power",
        `${shipState.reactorPower}%`
    );

    updateMeter(
        "reactor-power-value",
        "reactor-power-bar",
        shipState.reactorPower
    );

    // Reactor remains warm while powering the ship.
    const coreTarget = driveOnline ? 58 : 25;

    coreTemperature = approachTemperature(
        coreTemperature,
        coreTarget,
        2
    );

    document.getElementById(
        "reactor-temperature-bar"
    ).style.width = `${coreTemperature}%`;

    document.getElementById(
        "reactor-temperature"
    ).textContent = driveOnline
        ? "NOMINAL"
        : "IDLE / COOLING";
}


function updateDriveTelemetry() {

    const driveOnline = shipState.driveOnline;

    const engineeringStatus =
        document.getElementById("drive-engineering-status");

    if (driveOnline) {

        updateMeter(
            "drive-efficiency-value",
            "drive-efficiency-bar",
            telemetryVariation(91, 97)
        );

        updateMeter(
            "drive-thrust-value",
            "drive-thrust-bar",
            telemetryVariation(74, 86)
        );

        engineTemperature = approachTemperature(
            engineTemperature,
            60,
            3
        );

        engineeringStatus.textContent =
            "PROPULSION SYSTEM / TELEMETRY NOMINAL";

    } else {

        // No thrust or active drive efficiency in standby.
        updateMeter(
            "drive-efficiency-value",
            "drive-efficiency-bar",
            0
        );

        updateMeter(
            "drive-thrust-value",
            "drive-thrust-bar",
            0
        );

        // Gradually cool the engine after shutdown.
        engineTemperature = approachTemperature(
            engineTemperature,
            20,
            2
        );

        engineeringStatus.textContent =
            engineTemperature > 20
                ? "PROPULSION SYSTEM / COOLING"
                : "PROPULSION SYSTEM / STANDBY";
    }

    updateMeter(
        "drive-temperature-value",
        "drive-temperature-bar",
        engineTemperature
    );
}


/* ======================================== */
/* MASTER TELEMETRY UPDATE                  */
/* ======================================== */

function updateShipTelemetry() {
    updateReactorTelemetry();
    updateDriveTelemetry();
}


/* ======================================== */
/* SYSTEM INITIALIZATION                    */
/* ======================================== */

showPanel("command");

updateShipTelemetry();

setInterval(updateShipTelemetry, 3000);


/* ======================================== */
/* EPSTEIN DRIVE TELEMETRY                  */
/* ======================================== */

function updateDriveTelemetry() {

    const driveOnline = shipState.driveOnline;

    const engineeringStatus =
        document.getElementById("drive-engineering-status");


    if (driveOnline) {

        // Active propulsion readings.

        updateMeter(
            "drive-efficiency-value",
            "drive-efficiency-bar",
            randomReading(91, 97)
        );

        updateMeter(
            "drive-thrust-value",
            "drive-thrust-bar",
            randomReading(74, 86)
        );

        updateMeter(
            "drive-temperature-value",
            "drive-temperature-bar",
            randomReading(52, 65)
        );

        engineeringStatus.textContent =
            "PROPULSION SYSTEM / TELEMETRY NOMINAL";

    } else {

        // Drive in standby.

        updateMeter(
            "drive-efficiency-value",
            "drive-efficiency-bar",
            0
        );

        updateMeter(
            "drive-thrust-value",
            "drive-thrust-bar",
            0
        );

        updateMeter(
            "drive-temperature-value",
            "drive-temperature-bar",
            0
        );

        engineeringStatus.textContent =
            "PROPULSION SYSTEM / STANDBY";

    }

}


/* ======================================== */
/* MASTER TELEMETRY UPDATE                  */
/* ======================================== */

function updateShipTelemetry() {

    updateReactorTelemetry();

    updateDriveTelemetry();

}


/* ======================================== */
/* SYSTEM INITIALIZATION                    */
/* ======================================== */

// Show Command Overview on startup.

showPanel("command");


// Initialize simulated telemetry immediately.

updateShipTelemetry();


// Update ship telemetry every three seconds.

setInterval(updateShipTelemetry, 3000);
