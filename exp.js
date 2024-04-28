import CONST from "./const.js";

function calculateXP(rank, xpUntilNext) {
    

    let totalXP = CONST.rankData[rank].totalXP + xpUntilNext;

    let remainingXP = CONST.rankData[100].totalXP - totalXP;
    // console.log(totalXP, remainingXP);  
    return [parseInt(totalXP), remainingXP]
}

export { calculateXP };
