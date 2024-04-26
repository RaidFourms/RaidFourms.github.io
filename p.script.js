import CONST from "./const.js";

console.log(CONST.API_URL);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nick = urlParams.get("nick");

const playerid = urlParams.get("userid");
console.log(nick);
console.log(playerid);

document.getElementById("nickDisplay").innerText = "stats and stuff";

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

async function stats() {
    if (playerid !== null) {
        try {
            const response = await fetch(
                `${CONST.API_URL}player/?playerid=${playerid}&format=json`
            );
            if (!response.ok) {
                console.error("HTTP-Error: " + response.status);
                document.getElementById("statsContainer").innerText =
                    "An error occurred. Check the console for details.\n Response from server\n" +
                    (await response.text());
            }
            hideLoader();

            const statsData = await response.json();

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
                    "An error occurred. Please try again later.\n Response from server:\n" +
                    (await response.text());
            }
            hideLoader();
            const statsData = await response.json();

            return statsData;
        } catch (error) {
            console.error(error);
            hideLoader();

            document.getElementById("statsContainer").innerText =
                "An error occurred. Check the console for details. Error: " +
                error;
        }
    }
}

function generateStatsHTML(stats) {
    function calcPercentage(a, b) {
        return b !== 0 ? ((a / b) * 100).toFixed(2) : 0;
    }
    let arcade_wl_ratio = calcPercentage(
        stats.common_statistic[0].pvp_played.victories,
        stats.common_statistic[0].pvp_played.finished
    );
    let realistic_wl_ratio = calcPercentage(
        stats.common_statistic[1].pvp_played.victories,
        stats.common_statistic[1].pvp_played.finished
    );
    let simulator_wl_ratio = calcPercentage(
        stats.common_statistic[2].pvp_played.victories,
        stats.common_statistic[2].pvp_played.finished
    );

    let arcade_kd_ratio =
        stats.common_statistic[0].deaths !== 0
            ? stats.common_statistic[0].kills / stats.common_statistic[0].deaths
            : 0;
    let realistic_kd_ratio =
        stats.common_statistic[1].deaths !== 0
            ? stats.common_statistic[1].kills / stats.common_statistic[1].deaths
            : 0;
    let simulator_kd_ratio =
        stats.common_statistic[2].deaths !== 0
            ? stats.common_statistic[2].kills / stats.common_statistic[2].deaths
            : 0;
    return `
        <h1>Stats for ${stats.base_info.nick}</h1>
        <p id="section-base_info">
            User ID: <strong>${stats.base_info.user_id}</strong><br>
            Squadron tag: <strong>${stats.base_info.clan_tag}</strong><br>
            Current level: <strong>${stats.level_info.level}</strong> 
        </p>
        <p id="section-win_loss">
            <strong>W/L Ratios:</strong><br>
            Arcade W/L: <strong>${arcade_wl_ratio}%</strong> (${
        stats.common_statistic[0].pvp_played.victories
    }/${
        stats.common_statistic[0].pvp_played.finished -
        stats.common_statistic[0].pvp_played.victories
    })<br>
            Realistic W/L: <strong>${realistic_wl_ratio}%</strong> (${
        stats.common_statistic[1].pvp_played.victories
    }/${
        stats.common_statistic[1].pvp_played.finished -
        stats.common_statistic[1].pvp_played.victories
    })<br>
            Simulator W/L: <strong>${simulator_wl_ratio}%</strong> (${
        stats.common_statistic[2].pvp_played.victories
    }/${
        stats.common_statistic[2].pvp_played.finished -
        stats.common_statistic[2].pvp_played.victories
    })
        </p>
        <p id="section-kill_death">
            <strong>K/D Ratios:</strong><br>
            Arcade K/D: <strong>${arcade_kd_ratio.toFixed(2)}</strong> (${
        stats.common_statistic[0].kills
    }/${stats.common_statistic[0].deaths})<br>
            Realistic K/D: <strong>${realistic_kd_ratio.toFixed(2)}</strong> (${
        stats.common_statistic[1].kills
    }/${stats.common_statistic[1].deaths})<br>
            Simulator K/D: <strong>${simulator_kd_ratio.toFixed(2)}</strong> (${
        stats.common_statistic[2].kills
    }/${stats.common_statistic[2].deaths})
        </p>
    `;
}

async function renderStats(stats) {
    console.log(stats);
    const statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = generateStatsHTML(stats);
    if (stats.base_info.nick !== undefined && stats.base_info.nick !== null) {
        document.title = `Stats for ${stats.base_info.nick}`;
    }
}

async function main() {
    const statsData = await stats();
    renderStats(statsData);
}

main();
