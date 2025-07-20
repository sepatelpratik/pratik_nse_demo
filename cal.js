

import { optionsIdentifier,sytergy } from "./data.js";

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
                finalPrice: parseFloat((averagePrice * item.multi).toFixed(2)),
                takeKey: item.takeKey,
                info: item.info,
                indKey: item.indKey,
                multi: item.multi,
            })
        });
        resData.push({
            name: sytergyData.name, 
            option: option,
            ...sytergy[key].sytergyCal(option)
        })  
    })
    return resData;
}

function futCal(data) {
    let resData = {};
    data.forEach(item => {
        resData[item.metadata.identifier] = item.metadata.lastPrice
    });
    return resData;
}


function optionData(nseData) {
    let filterObject = {};
     let filterfut = [];
    nseData?.stocks?.forEach(item => {
        if (optionsIdentifier.includes(item.metadata.identifier)) {
            let ans = {
                ask: item.marketDeptOrderBook.ask,
                bid: item.marketDeptOrderBook.bid,
            }
            filterObject[item.metadata.identifier] = ans;  
        } else if(item.metadata.identifier.startsWith("FUTSTKRELIANCE")){
            filterfut.push(item)
        }
    })
    const optionData = optionCal(filterObject);
    const futureData = futCal(filterfut);
    return {optionData,futureData}
}

function convertToText(data) {
    let nifty50 = data.marketState[0];
    let resData = `Nifty Price is ${nifty50.last} . change is ${nifty50.variation.toFixed(2)} as percentage wise ${nifty50.percentChange}`;
    return resData
}
export { optionData, convertToText }