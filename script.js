const apiRoute = "https://rooik.at/v3/";
const frontendRoute = document.URL // "http://localhost:3000/";

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
    window.location.href = `${frontendRoute}p/?nick=${searchInput}`
    
}
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
}
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

// request('player/search/?nick=redllama')
