let price = 19.5; // Example price value (this could be set dynamically in practice)
let cashInput = document.getElementById("cash");
let purchaseBtn = document.getElementById("purchase-btn");
let changeDueElement = document.getElementById("change-due");

// Cash in drawer (cid)
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Denomination values
let denominationValues = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1.00,
  "FIVE": 5.00,
  "TEN": 10.00,
  "TWENTY": 20.00,
  "ONE HUNDRED": 100.00
};

purchaseBtn.addEventListener("click", () => {
  let cash = parseFloat(cashInput.value); // Get cash from user input
  let change = cash - price;

  if (isNaN(cash)) {
    alert("Please enter a valid number for cash");
    return;
  } else if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (cash === price) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    return;
  }

  let result = getChange(change, cid);
  
  if (result.status === "OPEN") {
    changeDueElement.textContent = `Status: OPEN ${result.change}`;
  } else if (result.status === "CLOSED") {
    changeDueElement.textContent = `Status: CLOSED ${result.change}`;
  } else {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
  }
});

// Function to get the change from the cid
function getChange(change, cid) {
  let changeArr = [];
  let totalCid = cid.reduce((acc, curr) => acc + curr[1], 0); // Total money in the drawer

  // Round to avoid floating point issues
  change = Math.round(change * 100) / 100;
  totalCid = Math.round(totalCid * 100) / 100;

  // If we don't have enough total cash in the drawer to return the change
  if (totalCid < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // Loop through cid from highest to lowest
  for (let i = cid.length - 1; i >= 0; i--) {
    let denomName = cid[i][0];  // Denomination name (e.g., QUARTER)
    let denomValue = denominationValues[denomName]; // Denomination value (e.g., 0.25)
    let denomTotal = cid[i][1];  // Total amount available for this denomination
    let amountToReturn = 0; // Track how much of this denomination to return

    // Calculate how many of this denomination we can use
    while (change >= denomValue && denomTotal >= denomValue) {
      change -= denomValue;      // Subtract denomination from the change
      change = Math.round(change * 100) / 100; // Prevent floating-point issues
      denomTotal -= denomValue;  // Subtract denomination from the drawer
      amountToReturn += denomValue; // Add denomination to the change to return
    }

    if (amountToReturn > 0) {
      changeArr.push(`${denomName}: $${amountToReturn.toFixed(2)}`);
    }
  }

  // Round the remaining change to avoid floating point precision issues
  change = Math.round(change * 100) / 100;

  // If change exactly matches total in cid, return CLOSED
  if (change === 0 && totalCid === totalCid - change) {
    // Sort change array from highest to lowest denomination
    changeArr.sort((a, b) => denominationValues[b.split(":")[0]] - denominationValues[a.split(":")[0]]);
    return { status: "CLOSED", change: changeArr.join(" ") };
  }

  // If exact change can be returned, but cid total is not fully exhausted
  if (change === 0) {
    return { status: "OPEN", change: changeArr.join(" ") };
  }

  // If we couldn't return exact change, return insufficient funds
  return { status: "INSUFFICIENT_FUNDS", change: [] };
}
