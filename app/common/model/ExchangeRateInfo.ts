class ExchangeRateInfo {
    public value: number;
    public fetchedAt: Date;

    constructor(value: number, fetchedAt: Date) {
        this.value = parseFloat(value.toFixed(4));
        this.fetchedAt = fetchedAt;
    }
}

export { ExchangeRateInfo };