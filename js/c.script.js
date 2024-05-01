import CONST from "./const.js";

// fetch(
//     "https://warthunder.com/en/community/getclansleaderboard/dif/_hist/page/1/sort/dr_era5"
// )
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });


searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchVehicle();
    }
});
const vehicles = CONST.trans;

function searchVehicle() {
    const inputValue = searchInput.value.trim();
    const foundVehicle = vehicles.find(vehicle => vehicle.name.toLowerCase() === inputValue.toLowerCase());
    if (foundVehicle) {
        console.log(foundVehicle);
    } else {
        console.log("Vehicle not found");
    }
}