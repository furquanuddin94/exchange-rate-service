import { FxRateSourceProviderConfig, supportedCurrencies, supportedFxRateSourceProviders } from "./config"

type FxRateSourceResult = { fxRate: number } | null;
type GetRatesFunction = (fromCurrency: string, toCurrency: string, amount: number) => Promise<FxRateSourceResult>;

const createFxRateSourceProvider = (
  config: FxRateSourceProviderConfig,
  getRates: GetRatesFunction
): GetRatesFunction => async (fromCurrency, toCurrency, amount) => {

  if (config.supportedFromCurrencies && !config.supportedFromCurrencies.includes(fromCurrency)) {
    return null;
  }

  try {
    const rates = await getRates(fromCurrency, toCurrency, amount);
    return rates;
  } catch (error: any) {
    console.warn(`Error fetching FX rates. Source: ${config.displayName}, From currency: ${fromCurrency}, To currency: ${toCurrency}:`, error.message);
    return null;
  }
};


const DeeMoneyProvider = createFxRateSourceProvider(
  supportedFxRateSourceProviders.deeMoney,
  async (fromCurrency, toCurrency, amount) => {
    const response = await fetch('https://www.deemoney.com/api/v2/exchange-rates', { cache: 'no-store' });
    const data = await response.json();
    return { fxRate: 1 / (data.exchangeRates[0].rates[toCurrency]) };
  }
);

const LatestProvider = createFxRateSourceProvider(
  supportedFxRateSourceProviders.latest,
  async (fromCurrency, toCurrency, amount) => {
    const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`, { cache: 'no-store' });
    const data = await response.json();
    return { fxRate: data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()] };
  }
);

const WesternUnionProvider = createFxRateSourceProvider(
  supportedFxRateSourceProviders.westernUnion,
  async (fromCurrency, toCurrency, amount) => {
    const fromCountryIsoCode = supportedCurrencies[fromCurrency].countryIsoCode;
    const toCountryIsoCode = supportedCurrencies[toCurrency].countryIsoCode;

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-TH");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("x-wu-accesscode", process.env.x_wu_accesscode || "");
    myHeaders.append("x-wu-operationname", "products");

    const graphql = JSON.stringify({
      query: "query  products( $req_products:ProductsInput, ) { products(input: $req_products) {\n            __typename\n            ...on ProductsResponse {              \n                products {\n                    code\n                    name\n                    routingCode\n                    pricingContext\n                    segment\n                    payIn\n                    payOut\n                    payInType\n                    deliverySpeed\n                    minAmount\n                    maxAmount\n                    feePercentage\n                    fees\n                    strikeFees\n                    feeDetails {\n                        wuFee\n                        processorFee\n                        processorFeePercent\n                    }\n                    processorFee\n                    processorFeeVAT\n                    wuFeeVat\n                    \n                    destinationFees\n                    exchangeRate\n                    strikeExchangeRate\n                    maxPayout\n                    speedIndicator\n                    location\n                    expectedPayoutLocation {\n                        stateCode\n                        stateName\n                        city\n                    }\n                    origination {\n                        principalAmount\n                        grossAmount\n                        currencyIsoCode\n                        countryIsoCode\n                    }\n                    destination {\n                        expectedPayoutAmountLong\n                        currencyIsoCode\n                        countryIsoCode\n                        splitPayOut {\n                            expectedPayoutAmount\n                            currencyIsoCode\n                            exchangeRate\n                            countryIsoCode\n                        }\n\n                    }\n                    promotion {\n                        code\n                        message\n                        discountFee\n                        name\n                        description\n                        status\n                        promoCode\n                    }\n                    isDirected\n                    fxBand\n                    questionIndicator\n                    taxes {\n                        taxAmount\n                        municipalTax\n                        stateTax\n                        countyTax\n                        taxableAmount\n                    }\n                    isPendingPromoApplied\n                    agentAccountType\n                    agentAccountId\n                    type\n                }\n                categories {\n                    type\n                    orders {\n                        payIn\n                        payOut\n                    }\n                }\n            }\n            ... on ErrorResponse{\n                errorCode\n                message\n              }\n        } }",
      variables: { "req_products": { "origination": { "channel": "WRET", "client": process.env.client, "countryIsoCode": fromCountryIsoCode, "currencyIsoCode": fromCurrency, "eflType": "", "amount": amount * 100, "fundsIn": "*", "airRequested": "Y", "processor": "2c2p", "eflValue": "" }, "destination": { "countryIsoCode": toCountryIsoCode, "currencyIsoCode": toCurrency }, "headerRequest": { "version": "0.5", "requestType": "PRICECATALOG", "correlationId": "", "transactionId": "" } } }
    })
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow",
      cache: 'no-store'
    };
    const response = await fetch("https://www.westernunion.com/router/", requestOptions);
    const data = await response.json();

    const value = data.data.products.products.find((product: { name: string; }) => product.name === "DIRECT TO BANK").exchangeRate;

    return { fxRate: value };
  }
);

export const providersMap: { [key: string]: GetRatesFunction } = {
  'latest': LatestProvider,
  'westernUnion': WesternUnionProvider,
  'deeMoney': DeeMoneyProvider,
}