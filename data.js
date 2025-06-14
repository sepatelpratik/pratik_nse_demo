
const optionsIdentifier = ["OPTSTKRELIANCE28-08-2025CE1500.00","OPTSTKRELIANCE28-08-2025CE1600.00","OPTSTKRELIANCE31-07-2025CE1400.00", "OPTSTKRELIANCE31-07-2025CE1500.00", "OPTSTKRELIANCE31-07-2025CE1600.00",
    "OPTSTKRELIANCE26-06-2025CE1350.00", "OPTSTKRELIANCE26-06-2025CE1400.00", "OPTSTKRELIANCE26-06-2025CE1450.00",
    "OPTSTKRELIANCE26-06-2025CE1500.00", "OPTSTKRELIANCE26-06-2025CE1550.00", "OPTSTKRELIANCE26-06-2025CE1600.00"]
const sytergy = {
    s1: {
        name: " buy 2 and sell 5",
        isOk: false,
        optionData: [{
            identifier: "OPTSTKRELIANCE31-07-2025CE1500.00",
            qty: 1000,
            takeKey: "ask",
            multi : 2,
            info:"1500 CE July 2025",
        }, {
            identifier: "OPTSTKRELIANCE31-07-2025CE1600.00",
            qty: 2500,
            takeKey: "bid",
            multi : 5,
            info:"1600 CE July 2025",
        }],
        sytergyCal: function (data) {
            if((data[1].finalPrice - data[0].finalPrice) > 30) {
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
            identifier: "OPTSTKRELIANCE26-06-2025CE1450.00",
            qty: 1500,
            takeKey: "ask",
            multi : 3,
            info:"1450 CE jun 2025",
        }, {
            identifier: "OPTSTKRELIANCE31-07-2025CE1500.00",
            qty: 2000,
            takeKey: "bid",
            multi : 4,
            info:"1500 CE July 2025",
        }],
        sytergyCal: function (data) {
            this.diff = data[0].finalPrice - data[1].finalPrice;
            if(data[0].finalPrice <= data[1].finalPrice) {
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
            multi : 3,
            info:"1600 CE Aug 2025",
        }, {
            identifier: "OPTSTKRELIANCE31-07-2025CE1500.00",
            qty: 500,
            takeKey: "bid",
            multi : 1,
            info:"1500 CE july 2025",
        }],
        sytergyCal: function (data) {
            this.diff = data[0].finalPrice - data[1].finalPrice;
            if(data[0].finalPrice <= data[1].finalPrice) {
                this.isOk = true;
                return true;
            } else {
                this.isOk = false;
                return false;
            }
        }
    },
}


// function optionData(nseData) {
//     let resData = [];
//     nseData?.records?.data?.forEach(item => {
//         options.forEach(option =>{
//             if(option.strikePrice === item.strikePrice && option.expiryDate === item.expiryDate) {
//                 let ans = {
//                     strikePrice: item.strikePrice,
//                     expiryDate: item.expiryDate,
//                     price : item.CE[option.takeKey],
//                     qty : item.CE[option.qty],
//                 }
//                 ans.finalCal = Math.ceil(ans.price * option.multi)
//                 resData.push(ans);
//             }
//         })
//     })
//     return { resData , isOK : (resData[0].finalCal >= resData[1].finalCal)}
// }
function getAveragePrice(eachOption, targetQuantity) {
    let totalCost = 0;
    let filledQuantity = 0;

    for (const order of eachOption) {
        if (filledQuantity + order.quantity <= targetQuantity) {
            totalCost += order.price * order.quantity;
            filledQuantity += order.quantity;
        } else {
            const remaining = targetQuantity - filledQuantity;
            totalCost += order.price * remaining;
            filledQuantity += remaining;
            break;
        }
    }
    let averagePrice = 0;
    if (filledQuantity < targetQuantity) {
        console.log(`Not enough quantity in ask orders. Only filled ${filledQuantity} of ${targetQuantity}.`);
    } else {
        averagePrice = totalCost / targetQuantity;
    }
    return averagePrice;
}

function optionCal(data) {
    let keys = Object.keys(sytergy);
    const resData = [];
    keys.forEach(key => {
        const option =[]
        let sytergyData = sytergy[key];
        const optionData = sytergyData.optionData;
        optionData.forEach(item => {
            const identifierData = data[item.identifier];
            const eachOption = identifierData[item.takeKey];
            const targetQuantity = item.qty;
            const averagePrice = getAveragePrice(eachOption, targetQuantity);
            option.push({
                price: averagePrice,
                identifier: item.identifier,
                qty: targetQuantity,
                finalPrice: Math.ceil(averagePrice * item.multi),
                takeKey: item.takeKey,
                info: item.info,
            })
        });
        resData.push({
            name: sytergyData.name, 
            isOK: sytergy.s1.sytergyCal(option),
            option: option
        })  
    })
    return resData;
}
function optionData(nseData) {
    let filterObject = {};
    nseData?.stocks?.forEach(item => {
        if (optionsIdentifier.includes(item.metadata.identifier)) {
            let ans = {
                ask: item.marketDeptOrderBook.ask,
                bid: item.marketDeptOrderBook.bid,
            }
            filterObject[item.metadata.identifier] = ans;
        }
    })
    const resObj = optionCal(filterObject);
    return resObj
}

function convertToText(data) {
    let nifty50 = data.marketState[0];
    let resData = `Nifty Price is ${nifty50.last} . change is ${nifty50.variation.toFixed(2)} as percentage wise ${nifty50.percentChange}`;
    return resData
}
export { optionData, convertToText }