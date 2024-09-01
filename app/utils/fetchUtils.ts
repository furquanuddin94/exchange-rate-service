export const fetchCache = 'force-no-store'

export const deeMoneyFetch = async () => {
    const response = await fetch('https://www.deemoney.com/api/v2/exchange-rates');
    const data = await response.json();
    return 1 / (data.exchangeRates[0].rates.INR);
};

export const latestFetch = async () => {

    const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/thb.json');
    const data = await response.json();
    return data.thb.inr;
};

export const westernUnion10kFetch = async () => {
    return _westernUnionFetch(10000);
}

export const westernUnion60kFetch = async () => {
    return _westernUnionFetch(60000);
}

export const westernUnion110kFetch = async () => {
    return _westernUnionFetch(110000);
}

const _westernUnionFetch = async (amount: number) => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-TH");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("x-wu-accesscode", process.env.x_wu_accesscode || "");
    myHeaders.append("x-wu-operationname", "products");

    const graphql = JSON.stringify({
        query: "query  products( $req_products:ProductsInput, ) { products(input: $req_products) {\n            __typename\n            ...on ProductsResponse {              \n                products {\n                    code\n                    name\n                    routingCode\n                    pricingContext\n                    segment\n                    payIn\n                    payOut\n                    payInType\n                    deliverySpeed\n                    minAmount\n                    maxAmount\n                    feePercentage\n                    fees\n                    strikeFees\n                    feeDetails {\n                        wuFee\n                        processorFee\n                        processorFeePercent\n                    }\n                    processorFee\n                    processorFeeVAT\n                    wuFeeVat\n                    \n                    destinationFees\n                    exchangeRate\n                    strikeExchangeRate\n                    maxPayout\n                    speedIndicator\n                    location\n                    expectedPayoutLocation {\n                        stateCode\n                        stateName\n                        city\n                    }\n                    origination {\n                        principalAmount\n                        grossAmount\n                        currencyIsoCode\n                        countryIsoCode\n                    }\n                    destination {\n                        expectedPayoutAmountLong\n                        currencyIsoCode\n                        countryIsoCode\n                        splitPayOut {\n                            expectedPayoutAmount\n                            currencyIsoCode\n                            exchangeRate\n                            countryIsoCode\n                        }\n\n                    }\n                    promotion {\n                        code\n                        message\n                        discountFee\n                        name\n                        description\n                        status\n                        promoCode\n                    }\n                    isDirected\n                    fxBand\n                    questionIndicator\n                    taxes {\n                        taxAmount\n                        municipalTax\n                        stateTax\n                        countyTax\n                        taxableAmount\n                    }\n                    isPendingPromoApplied\n                    agentAccountType\n                    agentAccountId\n                    type\n                }\n                categories {\n                    type\n                    orders {\n                        payIn\n                        payOut\n                    }\n                }\n            }\n            ... on ErrorResponse{\n                errorCode\n                message\n              }\n        } }",
        variables: { "req_products": { "origination": { "channel": "WRET", "client": process.env.client, "countryIsoCode": "TH", "currencyIsoCode": "THB", "eflType": "", "amount": amount * 100, "fundsIn": "*", "airRequested": "Y", "processor": "2c2p", "eflValue": "" }, "destination": { "countryIsoCode": "IN", "currencyIsoCode": "INR" }, "headerRequest": { "version": "0.5", "requestType": "PRICECATALOG", "correlationId": "", "transactionId": "" } } }
    })
    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: graphql,
        redirect: "follow"
    };
    const response = await fetch("https://www.westernunion.com/router/", requestOptions);
    const data = await response.json();

    const value = data.data.products.products.find((product: { name: string; }) => product.name === "DIRECT TO BANK").exchangeRate;

    return value;
};