
const options = [
    {
        
        expiryDate:"29-May-2025",
        strikePrice: 1250,
        multi:3
    },
    {
        expiryDate:"26-Jun-2025",
        strikePrice: 1300,
        multi:4
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
                    price : item.CE.lastPrice,

                }
                ans.finalCal = Math.ceil(ans.price * option.multi)
                resData.push(ans);
            }
        })
    })
    return resData
}
export { optionData }