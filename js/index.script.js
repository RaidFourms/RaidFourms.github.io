const frontendRoute = document.URL;
const searchInput = document.getElementById("searchInput");
const sidebar = document.getElementById("sidebar");

function request(path) {
    return fetch(frontendRoute + path)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

function search(nick) {
    return request(`/player/search/?nick=${nick}`);
}

function renderPlayers(data) {
    for (const player of data) {
        console.log(player);
    }
}

function searchPlayer() {
    const inputValue = searchInput.value.trim();
    const isNumeric = /^[0-9]+$/.test(inputValue);
    const route = isNumeric ? `p?userid=${inputValue}` : `p?nick=${inputValue}`;
    window.location.href = `${frontendRoute}${route}`;
}

function toggleDarkMode() {
    console.log("Toggling dark mode");
    document.body.classList.toggle("dark-mode");
}

function toggleSidebar() {
    console.log("Toggling sidebar");
    sidebar.classList.toggle("collapsed");
}
/*
searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchPlayer();
    }
});
var playerArr = [];

searchInput.addEventListener("input", function (event) {
    playerArr = [];
    if (searchInput.value.trim().length > 0) {
        console.log("Searching for", searchInput.value);
        search(searchInput.value).then((data) => {
            console.log(data);
            for (p in data) {
                playerArr.push(data[p]);
            }
        });
    }
});

*/