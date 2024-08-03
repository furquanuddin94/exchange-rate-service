export function GET() {
    return fetch('https://www.deemoney.com/api/v2/exchange-rates')
        .then(response => response.json())
        .then(data => {
            console.log(data.exchangeRates[0].rates.INR)
            const inrExchangeRate = 1 / (data.exchangeRates[0].rates.INR);
            return Response.json(inrExchangeRate);
        })
        .catch(error => {
            return Response.json({ error: error.message });
        });
}