## Get current fiat rates

Retrieves current selected exchange rates for selected coin.

```javascript
const result = TrezorConnect.blockchainGetCurrentFiatRates({params});
```
### Params
- currencies:['currency1','currency2','currency3',...]
- coin: 'coin'

### Example

Return current EUR, USD, BTC exchange rates for ETH:

```javascript
const result = TrezorConnect.blockchainGetCurrentFiatRates({currencies: ['EUR', 'CZK', 'BTC'], coin: 'ETH'});
```

### Result

```javascript
{
    success: true,
    payload: [
        rates: {btc: 0.07461017, eur: 1768.36, usd: 1802.17}
        ts: 1659962048
    ]
}
```

