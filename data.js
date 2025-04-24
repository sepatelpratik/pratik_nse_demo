
const options = [
    {
        
        expiryDate:"29-May-2025",
        strikePrice: 1250,
        multi:3,
        takeKey:"bidprice",
        qty:"bidQty"
    },
    {
        expiryDate:"26-Jun-2025",
        strikePrice: 1300,
        multi:4,
        takeKey:"askPrice",
        qty:"askQty"
    }
]

function optionData(nseData) {
    let resData = [];
    nseData?.records?.data?.forEach(item => {
        options.forEach(option =>{
            if(option.strikePrice === item.strikePrice && option.expiryDate === item.expiryDate) {
                let ans = {
                    strikePrice: item.strikePrice,
                    expiryDate: item.expiryDate,
                    price : item.CE[option.takeKey],
                    qty : item.CE[option.qty],
                }
                ans.finalCal = Math.ceil(ans.price * option.multi)
                resData.push(ans);
            }
        })
    })
    return { resData , isOK : (resData[0].finalCal >= resData[1].finalCal)}
}


function convertToText(data) {
    let nifty50 = data.marketState[0];
    let resData = `Nifty Price is ${nifty50.last} . change is ${nifty50.variation.toFixed(2)} as percentage wise ${nifty50.percentChange}`;
    return resData
}
export { optionData, convertToText }