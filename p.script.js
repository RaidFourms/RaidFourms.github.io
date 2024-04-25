import CONST from "./const.js";
//const API_URL = 'https://rooik.at/v3/';

// Rest of the code...
// console.log(document.URL);
console.log(CONST.API_URL);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nick = urlParams.get("nick");

const playerid = urlParams.get("userid");
console.log(nick)
console.log(playerid);
// console.log(nick);

document.getElementById("nickDisplay").innerText = "stats and stuff"; // nick;

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
function request(path) {
    return fetch(route + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

async function downloadStats() {
    const statsData = await stats();
    const jsonContent = JSON.stringify(statsData);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = url;
    downloadLink.download = "stats.json";
}
// lns 28 & 40 52
async function stats() {
    if (playerid !== null) {
        try {
            const response = await fetch(
                `${CONST.API_URL}player/?playerid=${playerid}&format=json`
            );
            if (!response.ok) {
                console.error("HTTP-Error: " + response.status);
                document.getElementById("statsContainer").innerText =
                    "An error occurred. Please try again later.\n Response from server: " +
                    (await response.text());
            }
            hideLoader();

            const statsData = await response.json();
            // await downloadStats(statsData); // Call downloadStats function with the statsData
            return statsData;
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            const response = await fetch(
                `${CONST.API_URL}player/nick?nick=${nick}&format=json`
            );
            if (!response.ok) {
                console.error("HTTP-Error: " + response.status);
                document.getElementById("statsContainer").innerText =
                    "An error occurred. Please try again later.\n Response from server: " +
                    (await response.text());
            }
            hideLoader();
            const statsData = await response.json();
            // await downloadStats(statsData); // Call downloadStats function with the statsData
            return statsData;
        } catch (error) {
            console.error(error);
        }
    }
}

async function renderStats(stats) {
    console.log(stats);
    const statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = `
        <h3>Nick: ${stats.base_info.nick}</h3>
        <h3>Level: ${stats.level_info.level}</h3>
    `;
}

async function main() {
    const statsData = await stats();
    renderStats(statsData);
}

main();
