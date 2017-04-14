import { getLast } from 'binary-utils';
import { translate } from '../../../common/i18n';
import { getDirection } from '../tools';
import { expectPositiveInteger } from '../sanitize';

export default Engine => class Ticks extends Engine {
  watchTicks(symbol) {
    if (symbol && this.symbol !== symbol) {
      const { ticksService } = this.$scope;

      ticksService.stopMonitor({
        symbol: this.symbol,
        key: this.tickListenerKey,
      });

      const callback = () => {
        if (!this.ongoingPurchase) {
          this.checkProposalReady();
        }
      };

      const key = ticksService.monitor({ symbol, callback });

      this.symbol = symbol;

      this.tickListenerKey = key;
    }
  }
  getTicks() {
    return new Promise(resolve =>
      this.$scope.ticksService
        .request({ symbol: this.symbol })
        .then(ticks => resolve(ticks.map(o => o.quote))),
    );
  }
  getLastTick() {
    return new Promise(resolve =>
      this.$scope.ticksService
        .request({ symbol: this.symbol })
        .then(ticks => resolve(getLast(ticks).quote)),
    );
  }
  getLastDigit() {
    return new Promise(resolve =>
      this.getLastTick().then(tick =>
        resolve(+tick.toFixed(this.getPipSize()).slice(-1)[0]),
      ),
    );
  }
  checkDirection(dir) {
    return new Promise(resolve =>
      this.$scope.ticksService
        .request({ symbol: this.symbol })
        .then(ticks => resolve(getDirection(ticks) === dir)),
    );
  }
  getOhlc(args) {
    const { granularity = 60, field } = args || {};

    return new Promise(resolve =>
      this.$scope.ticksService
        .request({ symbol: this.symbol, granularity })
        .then(ohlc => resolve(field ? ohlc.map(o => o[field]) : ohlc)),
    );
  }
  getOhlcFromEnd(args) {
    const { index: i = 1 } = args || {};

    const index = expectPositiveInteger(
      i,
      translate('Index must be a positive integer'),
    );

    return new Promise(resolve =>
      this.getOhlc(args).then(ohlc => resolve(ohlc.slice(-index)[0])),
    );
  }
  getPipSize() {
    return this.$scope.ticksService.pipSizes[this.symbol];
  }
};
