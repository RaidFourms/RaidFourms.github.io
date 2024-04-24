const apiRoute = "https://rooik.at/v3/";
const frontendRoute = document.URL; // "http://localhost:3000/";
// import CONST from "./const.js";

function request(path) {
    return fetch(route + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

function search(nick) {
    return request("player/search/?nick=" + nick);
}

function searchPlayer() {
    const searchInput = document.getElementById("searchInput").value;

    // if (document.getElementById("searchInput").value === "") {
    //     return;
    // }
    if (/^[0-9]+$/.test(document.getElementById("searchInput").value)) {   
        window.location.href = `${frontendRoute}p?userid=${searchInput}`;
        return;
    }

    window.location.href = `${frontendRoute}p?nick=${searchInput}`;
}
function toggleDarkMode() {
    console.log("toggling dark mode");
    const body = document.body;
    body.classList.toggle("dark-mode");
}
function toggleSidebar() {
    console.log("toggling sidebar");
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

// request('player/search/?nick=redllama')
