// ==UserScript==
// @name         TapSwapBot By CyrilzdigitAlz - Enhanced
// @namespace    http://your.namespace.here
// @version      1.1
// @description  Automate TapSwap actions with settings menu, auto click play, and pause/resume features
// @author       CyrilzdigitAlz
// @match        *://*/*  // Adjust this to target specific sites
// @grant        none
// ==/UserScript==

let GAME_SETTINGS = {
    minClickDelay: 30, // Minimum delay between clicks
    maxClickDelay: 50, // Maximum delay between clicks
    pauseMinTime: 100000, // Minimum time to pause when energy is low
    pauseMaxTime: 300000, // Maximum time to pause when energy is low
    energyThreshold: 25,  // Minimum energy to continue clicking
    autoPlay: true,       // Automatically click play button
    autoPause: false      // Automatically pause game based on conditions
};

let isGamePaused = false;

const logPrefix = '%c[TapSwapBot By DefiWimar] ';

// Override console log to minimize clutter
const originalLog = console.log;
console.log = function () {};

console.error = console.warn = console.info = console.debug = () => {};

// Create the settings menu
const createSettingsMenu = () => {
    const settingsMenu = document.createElement('div');
    settingsMenu.id = 'tapswapbot-settings';
    settingsMenu.style.position = 'fixed';
    settingsMenu.style.top = '10px';
    settingsMenu.style.right = '10px';
    settingsMenu.style.backgroundColor = '#333';
    settingsMenu.style.color = '#fff';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.borderRadius = '8px';
    settingsMenu.style.zIndex = 1000;

    settingsMenu.innerHTML = 
        <h4 style="margin: 0 0 10px;">TapSwapBot Settings</h4>
        <label>
            <input type="checkbox" id="autoPlayCheckbox" ${GAME_SETTINGS.autoPlay ? 'checked' : ''}> Auto Play
        </label>
        <br>
        <label>
            Min Click Delay:
            <input type="number" id="minClickDelay" value="${GAME_SETTINGS.minClickDelay}" style="width: 50px;">
            <span title="Minimum delay (in ms) between each click.">❔</span>
        </label>
        <br>
        <label>
            Max Click Delay:
            <input type="number" id="maxClickDelay" value="${GAME_SETTINGS.maxClickDelay}" style="width: 50px;">
            <span title="Maximum delay (in ms) between each click.">❔</span>
        </label>
        <br>
        <label>
            Energy Threshold:
            <input type="number" id="energyThreshold" value="${GAME_SETTINGS.energyThreshold}" style="width: 50px;">
            <span title="Minimum energy required to continue clicking.">❔</span>
        </label>
        <br>
        <label>
            Pause Min Time:
            <input type="number" id="pauseMinTime" value="${GAME_SETTINGS.pauseMinTime}" style="width: 100px;">
        </label>
        <br>
        <label>
            Pause Max Time:
            <input type="number" id="pauseMaxTime" value="${GAME_SETTINGS.pauseMaxTime}" style="width: 100px;">
        </label>
        <br>
        <label>
            <input type="checkbox" id="autoPauseCheckbox" ${GAME_SETTINGS.autoPause ? 'checked' : ''}> Auto Pause Game
        </label>
        <br><br>
        <button id="pauseButton">Pause</button>
        <button id="resumeButton" style="display:none;">Resume</button>
    ;

    document.body.appendChild(settingsMenu);

    // Add event listeners for settings changes
    document.getElementById('autoPlayCheckbox').addEventListener('change', (e) => {
        GAME_SETTINGS.autoPlay = e.target.checked;
    });
    document.getElementById('minClickDelay').addEventListener('input', (e) => {
        GAME_SETTINGS.minClickDelay = parseInt(e.target.value, 10);
    });
    document.getElementById('maxClickDelay').addEventListener('input', (e) => {
GAME_SETTINGS.maxClickDelay = parseInt(e.target.value, 10);
    });
    document.getElementById('energyThreshold').addEventListener('input', (e) => {
        GAME_SETTINGS.energyThreshold = parseInt(e.target.value, 10);
    });
    document.getElementById('pauseMinTime').addEventListener('input', (e) => {
        GAME_SETTINGS.pauseMinTime = parseInt(e.target.value, 10);
    });
    document.getElementById('pauseMaxTime').addEventListener('input', (e) => {
        GAME_SETTINGS.pauseMaxTime = parseInt(e.target.value, 10);
    });
    document.getElementById('autoPauseCheckbox').addEventListener('change', (e) => {
        GAME_SETTINGS.autoPause = e.target.checked;
    });

    // Pause/Resume functionality
    document.getElementById('pauseButton').addEventListener('click', () => {
        isGamePaused = true;
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'inline';
        console.log(${logPrefix}Game paused, styles.info);
    });

    document.getElementById('resumeButton').addEventListener('click', () => {
        isGamePaused = false;
        document.getElementById('pauseButton').style.display = 'inline';
        document.getElementById('resumeButton').style.display = 'none';
        console.log(${logPrefix}Game resumed, styles.info);
    });
};

// Initialize settings menu
createSettingsMenu();

// Function to trigger the mouse events on buttons
function triggerEvent(element, eventType, properties) {
    const event = new MouseEvent(eventType, properties);
    element.dispatchEvent(event);
}

// Generate random coordinates in a circular area
function getRandomCoordinateInCircle(radius) {
    let x, y;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
    } while (x * x + y * y > 1);
    return {
        x: Math.round(x * radius),
        y: Math.round(y * radius)
    };
}

// Function to get the current energy level from the page
function getCurrentEnergy() {
    const energyElement = document.querySelector("._h4_1w1my_1");
    if (energyElement) {
        return parseInt(energyElement.textContent);
    }
    return null;
}

// Function to check for a coin and click it
function checkCoinAndClick() {
    if (isGamePaused) {
        setTimeout(checkCoinAndClick, GAME_SETTINGS.minClickDelay);
        return;
    }

    const button = document.querySelector("#ex1-layer img");

    if (button) {
        clickButton(button);
    } else {
        setTimeout(checkCoinAndClick, GAME_SETTINGS.minClickDelay);
    }
}

// Function to handle button clicks
function clickButton(button) {
    if (isGamePaused) {
        setTimeout(checkCoinAndClick, GAME_SETTINGS.minClickDelay);
        return;
    }

    const currentEnergy = getCurrentEnergy();
    if (currentEnergy !== null && currentEnergy < GAME_SETTINGS.energyThreshold) {
        const pauseTime = GAME_SETTINGS.pauseMinTime + Math.random() * (GAME_SETTINGS.pauseMaxTime - GAME_SETTINGS.pauseMinTime);
        setTimeout(checkCoinAndClick, pauseTime);
        return;
    }

    const rect = button.getBoundingClientRect();
    const radius = Math.min(rect.width, rect.height) / 2;
    const { x, y } = getRandomCoordinateInCircle(radius);

    const clientX = rect.left + radius + x;
    const clientY = rect.top + radius + y;

    const commonProperties = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: clientX,
        clientY: clientY,
        screenX: clientX,
        screenY: clientY,
        pageX: clientX,
        pageY: clientY,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
        width: 1,
        height: 1,
        pressure: 0.5,
        button: 0,
        buttons: 1
    };

    triggerEvent(button, 'pointerdown', commonProperties);
    triggerEvent(button, 'mousedown', commonProperties);
    triggerEvent(button, 'pointerup', { ...commonProperties, pressure: 0 });
    triggerEvent(button, 'mouseup', commonProperties);
    triggerEvent(button, 'click', commonProperties);
const delay = GAME_SETTINGS.minClickDelay + Math.random() * (GAME_SETTINGS.maxClickDelay - GAME_SETTINGS.minClickDelay);
    setTimeout(checkCoinAndClick, delay);
}

// Start the coin checking loop
checkCoinAndClick();
