export function GET() {
  return fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/thb.json')
  .then(response => response.json())
  .then(data => {
    const inrExchangeRate = data.thb.inr;
    return Response.json(inrExchangeRate);
  })
  .catch(error => {
    return Response.json({ error: error.message });
  });
}