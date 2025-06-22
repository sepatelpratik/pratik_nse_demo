
const optionsIdentifier = [
    "OPTSTKRELIANCE28-08-2024CE1500.00", "OPTSTKRELIANCE28-08-2025CE1600.00", "OPTSTKRELIANCE31-07-2025CE1400.00", "OPTSTKRELIANCE31-07-2025CE1500.00", "OPTSTKRELIANCE31-07-2025CE1600.00",
    "OPTSTKRELIANCE26-06-2025CE1350.00", "OPTSTKRELIANCE26-06-2025CE1400.00", "OPTSTKRELIANCE26-06-2025CE1450.00",
    "OPTSTKRELIANCE26-06-2025CE1500.00", "OPTSTKRELIANCE26-06-2025CE1550.00", "OPTSTKRELIANCE26-06-2025CE1600.00",
    "OPTSTKRELIANCE31-07-2025CE1450.00",
    "OPTSTKRELIANCE28-08-2025PE1300.00",
    "OPTSTKRELIANCE28-08-2025CE1500.00",
    "OPTSTKRELIANCE28-08-2025CE1600.00",
    "OPTSTKRELIANCE28-08-2025CE1400.00",
    "OPTSTKRELIANCE28-08-2025PE1500.00",



]


const sytergy = {
    s1: {
        name: " buy 2 and sell 5",
        isOk: false,
        optionData: [{
            identifier: "OPTSTKRELIANCE31-07-2025CE1500.00",
            qty: 1000,
            takeKey: "ask",
            multi: 2,
            info: "1500 CE July 2025",
        }, {
            identifier: "OPTSTKRELIANCE31-07-2025CE1600.00",
            qty: 2500,
            takeKey: "bid",
            multi: 5,
            info: "1600 CE July 2025",
        }],
        sytergyCal: function (data) {
               this.diff = data[0].finalPrice - data[1].finalPrice;
         
            if ((data[1].finalPrice - data[0].finalPrice) > 30) {
                this.isOk = true;
                return true
            } else {
                this.isOk = false;
                return false;
            }
        }
    },
    s2: {
        name: " buy 3 and sell 4",
        isOk: false,
        diff: 0,
        optionData: [{
            identifier: "OPTSTKRELIANCE31-07-2025CE1450.00",
            qty: 1500,
            takeKey: "ask",
            multi: 3,
            info: "1450 CE jul 2025",
        }, {
            identifier: "OPTSTKRELIANCE28-08-2025CE1500.00",
            qty: 2000,
            takeKey: "bid",
            multi: 4,
            info: "1500 CE Aug 2025",
        }],
        sytergyCal: function (data) {
            this.diff = data[0].finalPrice - data[1].finalPrice;
            if (data[0].finalPrice <= data[1].finalPrice) {
                this.isOk = true;
                return true;
            } else {
                this.isOk = false;
                return false;
            }
        }
    },
    s3: {
        name: " calader buy 3 and sell 1 ",
        isOk: false,
        diff: 0,
        optionData: [{
            identifier: "OPTSTKRELIANCE28-08-2025CE1600.00",
            qty: 1500,
            takeKey: "ask",
            multi: 3,
            info: "1600 CE Aug 2025",
        }, {
            identifier: "OPTSTKRELIANCE31-07-2025CE1500.00",
            qty: 500,
            takeKey: "bid",
            multi: 1,
            info: "1500 CE july 2025",
        }],
        sytergyCal: function (data) {
            this.diff = data[0].finalPrice - data[1].finalPrice;
            if (data[0].finalPrice <= data[1].finalPrice) {
                this.isOk = true;
                return true;
            } else {
                this.isOk = false;
                return false;
            }
        }
    },
}


export { optionsIdentifier, sytergy }