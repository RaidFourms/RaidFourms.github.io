import CONST from "./const.js";

// Rest of the code...
// console.log(document.URL);
console.log(CONST.API_URL);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nick = urlParams.get("nick");
if (!nick) {
    const userid = urlParams.get("userid");
    
}
// console.log(nick);

document.getElementById("nickDisplay").innerText = "stats and stuff"; // nick;

function request(path) {
    return fetch(route + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

async function stats() {
    try {
        const response = await fetch(
            `${CONST.API_URL}player/nick?nick=${nick}&format=json`
        );
        if (!response.ok) {
            console.error("HTTP-Error: " + response.status);
            document.getElementById("statsContainer").innerText =
                "An error occurred. Please try again later.\n Response from server: " +
                (await response.text());
            document.getElementById("loader").style.display = "none";
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function renderStats(stats) {
    console.log(stats);
    const statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = `
        <h3>Nick: ${stats.base_info.nick}</h3>
        <h3>Level: ${stats.level_info.level}</h3>
        <p>and other stuff...</p>
    `;
}

async function main() {
    const statsData = await stats();
    renderStats(statsData);
}

main();
