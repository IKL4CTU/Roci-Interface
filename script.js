
/* ======================================== */
/* ROCINANTE COMMAND INTERFACE              */
/* COMMAND AUTHORIZATION SYSTEM             */
/* ======================================== */

const authorizeButton = document.getElementById(
    "authorize-command"
);

const authorizationStatus = document.getElementById(
    "authorization-status"
);

if (authorizeButton && authorizationStatus) {

    authorizeButton.addEventListener("click", function () {

        authorizationStatus.textContent =
            "COMMAND AUTHORIZATION GRANTED";

        authorizationStatus.style.color =
            "var(--system-green)";

        authorizeButton.textContent =
            "COMMAND ACTIVE";

        authorizeButton.disabled = true;

        const driveButton = document.getElementById(
            "activate-drive"
        );

        if (driveButton) {

            driveButton.disabled = false;

            driveButton.textContent = "ACTIVATE DRIVE";

        }


        console.log(
            "ROCINANTE: Command authorization granted."
        );

    });

}

/* ======================================== */
/* EPSTEIN DRIVE — ACTIVATION SYSTEM        */
/* ======================================== */

const driveButton = document.getElementById(
    "activate-drive"
);

const driveStatus = document.getElementById(
    "drive-status"
);

if (driveButton && driveStatus) {

    driveButton.addEventListener("click", function () {

        if (driveButton.disabled) {
            return;
        }

        driveStatus.textContent = "● DRIVE ONLINE";

        driveStatus.classList.remove("standby");
        driveStatus.classList.add("nominal");

        driveButton.textContent = "DRIVE ACTIVE";
        driveButton.disabled = true;

        console.log(
            "ROCINANTE: Epstein drive online."
        );

    });

}

/* ======================================== */
/* REACTOR TELEMETRY — OUTPUT SIMULATION    */
/* ======================================== */

// Locate the reactor display components.
const reactorOutput = document.getElementById(
    "reactor-output"
);

const reactorPowerValue = document.getElementById(
    "reactor-power-value"
);

const reactorPowerBar = document.getElementById(
    "reactor-power-bar"
);

const reactorGauge = document.getElementById(
    "reactor-gauge-progress"
);

// Circumference of the circular SVG gauge.
const reactorGaugeCircumference = 2 * Math.PI * 57;

// Beginning reactor output.
let reactorPower = 67;

/* ======================================== */
/* REACTOR TEMPERATURE MONITOR              */
/* ======================================== */

const reactorTemperatureBar = document.getElementById(
    "reactor-temperature-bar"
);

const reactorTemperatureStatus = document.getElementById(
    "reactor-temperature-status"
);


// Update every visual reactor output indicator.
function updateReactorDisplay(power) {

    reactorOutput.textContent = `${power}%`;

    reactorPowerValue.textContent = `${power}%`;

    reactorPowerBar.style.width = `${power}%`;

    const gaugeOffset =
        reactorGaugeCircumference * (1 - power / 100);

    reactorGauge.style.strokeDashoffset = gaugeOffset;

    // Keep the SVG's accessible description updated.
    reactorGauge.closest("svg").setAttribute(
        "aria-label",
        `Reactor output at ${power} percent`
    );

}

// Begin simulated reactor telemetry.

/* ======================================== */
/* ROCINANTE REACTOR TELEMETRY              */
/* ======================================== */

// Update reactor telemetry every 3 seconds.
if (
    reactorOutput &&
    reactorPowerValue &&
    reactorPowerBar &&
    reactorGauge
) {

    function updateReactorTelemetry() {

        // Check whether the Epstein Drive is online.
        const driveIsOnline =
            driveStatus &&
            driveStatus.textContent.includes("DRIVE ONLINE");

        // Increase reactor demand when drive is online.
        const baseOutput = driveIsOnline ? 82 : 67;

        const variation = driveIsOnline ? 9 : 7;

        const fluctuation =
            Math.floor(Math.random() * variation) -
            Math.floor(variation / 2);

        reactorPower = baseOutput + fluctuation;

        // Update reactor gauge and output bar.
        updateReactorDisplay(reactorPower);

        // Simulate reactor core temperature.
        const temperatureMinimum =
            driveIsOnline ? 52 : 38;

        const temperatureRange =
            driveIsOnline ? 14 : 8;

        const temperatureLoad =
            temperatureMinimum +
            Math.floor(Math.random() * temperatureRange);

        // Update core temperature display.
        if (reactorTemperatureBar && reactorTemperatureStatus) {

            reactorTemperatureBar.style.width =
                `${temperatureLoad}%`;

            reactorTemperatureStatus.textContent = "NOMINAL";

        }

    }

    // Initialize immediately.
    updateReactorTelemetry();

    // Continue updating every 3 seconds.
    setInterval(updateReactorTelemetry, 3000);

}
