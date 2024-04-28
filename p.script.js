import CONST from "./const.js";
import { calculateXP } from "./exp.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const nick = urlParams.get("nick");
const playerid = urlParams.get("userid");

document.getElementById("nickDisplay").innerText = "stats and stuff";

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
function request(path) {
    return fetch(route + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

async function stats() {
    if (playerid !== null) {
        try {
            const response = await fetch(
                `${CONST.API_URL}player/?playerid=${playerid}&format=json`
            ).then((b) => {
                const objectURL = URL.createObjectURL(b);
                dataDown.href = objectURL;
            });
            if (!response.ok) {
                console.error("HTTP-Error: " + response.status);
                document.getElementById("statsContainer").innerText =
                    "An error occurred. Check the console for details.\n Response from server\n" +
                    (await response.text());
            }
            hideLoader();

            const statsData = await response.json();
            const blob = new Blob([JSON.stringify(statsData, null, 4)], {
                type: "application/json",
            });
            const objectURL = URL.createObjectURL(blob);
            dataDown.href = objectURL;
            dataDown.download = `${statsData.base_info.nick}.json`;
            // blobify(await response.json());
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
            // response.clone()
            // blobify(await statsData);
            const blob = new Blob([JSON.stringify(statsData, null, 4)], {
                type: "application/json",
            });
            const objectURL = URL.createObjectURL(blob);
            dataDown.href = objectURL;
            dataDown.download = `${statsData.base_info.nick}.json`;

            return statsData;
        } catch (error) {
            console.error(error);
            hideLoader();

            document.getElementById("statsContainer").innerText =
                "An error occurred. Check the console for details. Error:\n" +
                error;
        }
    }
}

function generateStatsHTML(stats) {
    function calcPercentage(a, b) {
        // Check if a or b is not a number, return 0 if so

        // Check if b is 0 to avoid division by zero
        return b !== 0 ? ((a / b) * 100).toFixed(2) : "0";
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

    // console.log(xpCompletionPercentage);
    // console.log(calculateXP(stats.level_info.level, stats.level_info.exp_left));
    let exp = calculateXP(stats.level_info.level, stats.level_info.exp_left);
    let maxExp = 1145101300;
    /* ${calcPercentage(
                exp[0],
                maxExp
            )}% */

    return `
        <h1>Stats for ${stats.base_info.nick}</h1>
        <p id="section-base_info">
            User ID: <strong>${stats.base_info.user_id}</strong><br>
            Squadron tag: <strong>${stats.base_info.clan_tag}</strong><br>
            Current level: <strong>${stats.level_info.level}</strong><br>
            Progress to next level: <strong>${calcPercentage(
                stats.level_info.exp_has,
                stats.level_info.exp_has + stats.level_info.exp_left
            )}%</strong><br>
            Progress to level 100: <strong>WIP</strong>
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
    // console.log(stats);
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
