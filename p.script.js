console.log(document.URL);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nick = urlParams.get("nick");
console.log(nick);
document.getElementById("nickDisplay").innerText = "stats and stuff" // nick;

function request(path) {
    return fetch(route + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

async function stats() {
    try {
        const response = await fetch(`https://rooik.at/v3/player/nick?nick=${nick}&format=json`);
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
// function searchPlayer() {
