import Exchange from './abstract/aftermath.js';
import { TICK_SIZE } from './base/functions/number.js';
import type { Market, Dict } from './base/types.js';

const IFIXED_ONE = 1000000000000000000;

export default class aftermath extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'aftermath',
            'name': 'AftermathFinance',
            'countries': [ ],
            'version': 'v1',
            'rateLimit': 50, // 1200 requests per minute, 20 request per second
            'certified': false,
            'pro': false,
            'dex': true,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'cancelOrder': true,
                'cancelOrders': true,
                'createOrder': true,
                'editOrder': 'emulated',
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDeposits': true,
                'fetchFundingLimits': true,
                'fetchLedger': true,
                'fetchMarkets': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchTicker': 'emulated',
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTradingLimits': 'emulated',
                'fetchTransactions': false,
                'fetchWithdrawals': true,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'urls': {
                'logo': 'TODO',
                'api': 'https://staging-second.aftermath.finance/api/perpetuals',
                'www': 'https://www.aftermath.finance/',
                'doc': [
                    'TODO',
                ],
            },
            'api': {
                'public': {
                    'post': [
                        'all-markets',
                        'markets',
                        'market/candle-history',
                        'market/orderbook',
                        'market/orderbook-price',
                        'market/24hr-stats',
                        'market/trade-history',
                    ],
                },
                'private': {
                    'post': [
                        'accounts/positions',
                        'accounts/position-leverages',
                        'accounts/order-datas',
                        'accounts/collateral-history',
                        'accounts/trade-history',
                        'transactions/create-account',
                        'transactions/deposit-collateral',
                        'transactions/withdraw-collateral',
                        'transactions/market-order',
                        'transactions/limit-order',
                        'transactions/cancel-orders',
                        'transactions/reduce-order',
                        'transactions/set-leverage',
                        'account/set-position-leverage',
                        'account/set-position-leverage-from-tx',
                        'previews/place-order',
                        'previews/cancel-orders',
                        'previews/reduce-order',
                        'previews/set-leverage',
                    ],
                },
            },
            'requiredCredentials': {
                'apiKey': false,
                'secret': false,
                'walletAddress': true,
                'privateKey': true,
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'defaultType': 'swap',
                'sandboxMode': false,
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        const request: Dict = {
            'collateralCoinType': '0x457049371f5b5dc2bda857bb804ca6e93c5a3cae1636d0cd17bb6b6070d19458::usdc::USDC',
        };
        const response = await this.publicPostAllMarkets (this.extend (request, params));
        return this.parseMarkets (response);
    }

    parseMarket (market: Dict): Market {
        // {
        //     "packageId": "0x7c995f9c0c0553c0f3bfac7cf3c8b85716f0ca522305586bd0168ca20aeed277",
        //     "objectId": "0x0e4e64d604daa92fb31aab315feef867ad3102d55d6d6eacf0c3311d5d4d8b4c",
        //     "initialSharedVersion": 266837134,
        //     "collateralCoinType": "0x457049371f5b5dc2bda857bb804ca6e93c5a3cae1636d0cd17bb6b6070d19458::usdc::USDC",
        //     "marketParams": {
        //         "marginRatioInitial": "10000000000000000n",
        //         "marginRatioMaintenance": "8999999999999999n",
        //         "baseAssetSymbol": "XRPUSD",
        //         "basePriceFeedId": "0xc301760f235e28245e87c8d8833405dfb42b18ac10a30c472149e7e3424d1d48",
        //         "collateralPriceFeedId": "0xd10b385c82cba1f673a7456ebc97e0949eb4caa71b4a1a9bfe4d59384e79a279",
        //         "fundingFrequencyMs": "3600000n",
        //         "fundingPeriodMs": "86400000n",
        //         "premiumTwapFrequencyMs": "5000n",
        //         "premiumTwapPeriodMs": "3600000n",
        //         "spreadTwapFrequencyMs": "5000n",
        //         "spreadTwapPeriodMs": "3600000n",
        //         "makerFee": "0n",
        //         "takerFee": "1000000000000000n",
        //         "liquidationFee": "5000000000000000n",
        //         "forceCancelFee": "100000000000000n",
        //         "insuranceFundFee": "1000000000000000n",
        //         "minOrderUsdValue": "1000000000000000000n",
        //         "lotSize": "1000000n",
        //         "tickSize": "1n",
        //         "liquidationTolerance": "100n",
        //         "maxPendingOrders": "100n",
        //         "baseOracleTolerance": "30000n",
        //         "collateralOracleTolerance": "30000n"
        //     },
        //     "marketState": {
        //         "cumFundingRateLong": "-23206428903358722n",
        //         "cumFundingRateShort": "-35039623993595078n",
        //         "fundingLastUpdateMs": 1739300402101,
        //         "premiumTwap": "-281164482097493n",
        //         "premiumTwapLastUpdateMs": 1739303682807,
        //         "spreadTwap": "-226000710168458n",
        //         "spreadTwapLastUpdateMs": 1739303682807,
        //         "openInterest": "2164857308000000000000000n",
        //         "feesAccrued": "362442075741092843429465n"
        //     },
        //     "collateralPrice": 0.99986247,
        //     "indexPrice": 2.39077253
        // }
        const marketParams = this.safeDict (market, 'marketParams');
        const baseAssetSymbol = this.safeString (marketParams, 'baseAssetSymbol');
        const baseId = baseAssetSymbol.slice (0, -3); // Assume the symbol ends in 'USD'
        const base = this.safeCurrencyCode (baseId);
        const quoteId = 'USD';
        const quote = this.safeCurrencyCode (quoteId);
        const settleId = 'USDC';
        const settle = this.safeCurrencyCode (settleId);
        const makerFee = this.safeNumber (marketParams, 'makerFee') / IFIXED_ONE;
        const takerFee = this.safeNumber (marketParams, 'takerFee') / IFIXED_ONE;
        const lotSize = this.safeNumber (marketParams, 'lotSize');
        const tickSize = this.safeNumber (marketParams, 'tickSize');
        const contractSize = lotSize / 1000000000;
        const marginRatioInitial = this.safeNumber (marketParams, 'marginRatioInitial') / IFIXED_ONE;
        const minOrderUsdValue = this.safeNumber (marketParams, 'minOrderUsdValue') / IFIXED_ONE;
        return this.safeMarketStructure ({
            'id': this.safeString (market, 'objectId'),
            'symbol': this.safeString (market, 'baseAssetSymbol'),
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': 'swap',
            'spot': false,
            'margin': undefined,
            'swap': true,
            'future': false,
            'option': false,
            'active': true,
            'contract': true,
            'linear': true,
            'inverse': false,
            'maker': makerFee,
            'taker': takerFee,
            'contractSize': contractSize,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': contractSize,
                'price': lotSize / tickSize,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': 1 / marginRatioInitial,
                },
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': minOrderUsdValue,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': market,
        });
    }
}
