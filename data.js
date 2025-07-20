
const optionsIdentifier = [
    "OPTSTKRELIANCE28-08-2024CE1500.00", "OPTSTKRELIANCE28-08-2025CE1600.00",
    "OPTSTKRELIANCE31-07-2025CE1400.00", "OPTSTKRELIANCE31-07-2025CE1500.00",
    "OPTSTKRELIANCE31-07-2025CE1600.00",
    "OPTSTKRELIANCE31-07-2025CE1450.00",
    "OPTSTKRELIANCE28-08-2025PE1300.00",
    "OPTSTKRELIANCE28-08-2025CE1500.00",
    "OPTSTKRELIANCE28-08-2025CE1600.00",
    "OPTSTKRELIANCE28-08-2025CE1400.00",
    "OPTSTKRELIANCE28-08-2025PE1500.00",
    "OPTSTKRELIANCE28-08-2025CE1560.00",
    "OPTSTKRELIANCE28-08-2025CE1580.00",
    "OPTSTKRELIANCE28-08-2025CE1540.00",
    "OPTSTKRELIANCE28-08-2025CE1520.00",
    "OPTSTKRELIANCE31-07-2025CE1520.00",
    "OPTSTKRELIANCE31-07-2025CE1480.00",
     "OPTSTKRELIANCE31-07-2025CE1440.00",
    "OPTSTKRELIANCE31-07-2025CE1460.00",
    "OPTSTKRELIANCE31-07-2025CE1420.00",
    "OPTSTKRELIANCE31-07-2025CE1380.00",
    "OPTSTKRELIANCE31-07-2025CE1360.00",
    "OPTSTKRELIANCE31-07-2025CE1340.00",
    "OPTSTKRELIANCE31-07-2025CE1320.00",
     "OPTSTKRELIANCE28-08-2025CE1420.00",
]


const sytergy = {
    s1: {
        name: " buy 1 sell 2 buy 1",
        isOk: false,
        optionData: [{
            identifier: "OPTSTKRELIANCE31-07-2025CE1360.00",
            indKey: "1360",
            qty: 500,
            takeKey: "ask",
            multi: 1,
            info: "1580 CE Aug 2025",
        },
        {
            identifier: "OPTSTKRELIANCE31-07-2025CE1380.00",
            indKey: "1380",
            qty: 500,
            takeKey: "bid",
            multi: 1,
            info: "1600 CE AUG 2025",
        }
        ],
        sytergyCal: function (data) {
            const diff = parseFloat((data[0].finalPrice / data[1].finalPrice).toFixed(2));

            if (diff >= 0) {
                this.isOk = true;
            } else {
                this.isOk = false;
            }

            return {
                isOk: this.isOk,
                diff: diff,
            }
        }
    }
}


export { optionsIdentifier, sytergy }