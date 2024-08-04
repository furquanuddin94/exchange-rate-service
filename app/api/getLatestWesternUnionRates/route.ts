import { ExchangeRateInfo } from "@/app/common/model/ExchangeRateInfo";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
    noStore();
    const westernUnionExchangeRate = await kv.get('westernUnionExchangeRate');

    if (westernUnionExchangeRate) {
        console.log("Serving western union fx from cache.");
        return Response.json(westernUnionExchangeRate);
    } else {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "en-TH");
        myHeaders.append("content-type", "application/json");
        myHeaders.append("x-wu-accesscode", process.env.x_wu_accesscode || "");
        myHeaders.append("x-wu-operationname", "products");

        //read env var

        console.log(process.env.test)

        const graphql = JSON.stringify({
            query: "query  products( $req_products:ProductsInput, ) { products(input: $req_products) {\n            __typename\n            ...on ProductsResponse {              \n                products {\n                    code\n                    name\n                    routingCode\n                    pricingContext\n                    segment\n                    payIn\n                    payOut\n                    payInType\n                    deliverySpeed\n                    minAmount\n                    maxAmount\n                    feePercentage\n                    fees\n                    strikeFees\n                    feeDetails {\n                        wuFee\n                        processorFee\n                        processorFeePercent\n                    }\n                    processorFee\n                    processorFeeVAT\n                    wuFeeVat\n                    \n                    destinationFees\n                    exchangeRate\n                    strikeExchangeRate\n                    maxPayout\n                    speedIndicator\n                    location\n                    expectedPayoutLocation {\n                        stateCode\n                        stateName\n                        city\n                    }\n                    origination {\n                        principalAmount\n                        grossAmount\n                        currencyIsoCode\n                        countryIsoCode\n                    }\n                    destination {\n                        expectedPayoutAmountLong\n                        currencyIsoCode\n                        countryIsoCode\n                        splitPayOut {\n                            expectedPayoutAmount\n                            currencyIsoCode\n                            exchangeRate\n                            countryIsoCode\n                        }\n\n                    }\n                    promotion {\n                        code\n                        message\n                        discountFee\n                        name\n                        description\n                        status\n                        promoCode\n                    }\n                    isDirected\n                    fxBand\n                    questionIndicator\n                    taxes {\n                        taxAmount\n                        municipalTax\n                        stateTax\n                        countyTax\n                        taxableAmount\n                    }\n                    isPendingPromoApplied\n                    agentAccountType\n                    agentAccountId\n                    type\n                }\n                categories {\n                    type\n                    orders {\n                        payIn\n                        payOut\n                    }\n                }\n            }\n            ... on ErrorResponse{\n                errorCode\n                message\n              }\n        } }",
            variables: { "req_products": { "origination": { "channel": "WRET", "client": process.env.client, "countryIsoCode": "TH", "currencyIsoCode": "THB", "eflType": "", "amount": 100000, "fundsIn": "*", "airRequested": "Y", "processor": "2c2p", "eflValue": "" }, "destination": { "countryIsoCode": "IN", "currencyIsoCode": "INR" }, "headerRequest": { "version": "0.5", "requestType": "PRICECATALOG", "correlationId": "", "transactionId": "" } } }
        })
        const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow"
        };

        console.log("Fetching western union fx from API.");
        return fetch("https://www.westernunion.com/router/", requestOptions)
            .then((response) => response.json())
            .then(async (data) => {
                const value = data.data.products.products.find((product: { name: string; }) => product.name === "DIRECT TO BANK").exchangeRate;
                const rate = new ExchangeRateInfo(value, new Date(Date.now()));
                await kv.set('westernUnionExchangeRate', rate, { ex: 300 });
                return Response.json(rate);
            })
            .catch((error) => {
                return Response.json({ error: error.message });
            });
    }

}