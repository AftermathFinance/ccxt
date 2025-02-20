import Exchange from './abstract/aftermath.js';
import { TICK_SIZE } from './base/functions/number.js';
import type { Market, Dict, Strings, Tickers, TradingFeeInterface } from './base/types.js';

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
                'fetchLedger': true,
                'fetchMarkets': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchTicker': 'emulated',
                'fetchTickers': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': false,
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
                'api': 'https://staging-second.aftermath.finance/api/perpetuals',
            },
            'api': {
                'public': {
                    'post': [
                        'ccxt/fetchMarkets',
                        'ccxt/fetchCurrencies',
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
        const response = await this.publicPostCcxtFetchMarkets (params);
        return this.parseMarkets (response);
    }

    // TODO: adapt this to the new handler's return
    parseMarket (market: Dict): Market {
        return this.safeMarketStructure ({
            'id': '',
            'symbol': '',
            'spot': false,
            'margin': false,
            'swap': true,
            'future': false,
            'option': false,
            'contract': true,
            'precision': { },
            'limits': { },
        });
    }

    // TODO: add `fetchCurrencies` using the new handler

    /**
     * @method
     * @name aftermath#fetchTradingFee
     * @description fetch the trading fees for a market
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        return this.parseTradingFee (market);
    }

    parseTradingFee (market: Market = undefined): TradingFeeInterface {
        const symbol = this.safeSymbol (undefined, market);
        return {
            'info': {},
            'symbol': symbol,
            'maker': this.safeNumber (market, 'maker'),
            'taker': this.safeNumber (market, 'taker'),
            'percentage': true,
            'tierBased': undefined,
        };
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        return {};
    }

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        return {};
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        return [];
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        return [];
    }

    /**
     * @method
     * @name aftermath#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in positions
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.account] account object ID, required
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        throw new NotSupported (this.id + ' fetchBalance() is not supported yet');
    }

    sign (path, api = 'public', method = 'POST', params = {}, headers = undefined, body = undefined) {
        const url = this.urls['api'] + '/' + path;
        if (method === 'POST') {
            headers = {
                'Content-Type': 'application/json',
            };
            body = this.json (params);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
}
