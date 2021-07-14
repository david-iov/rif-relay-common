// @ts-ignore
import EthVal from 'ethval';
import log from 'loglevel';
import { toBN } from 'web3-utils';

import { boolString } from './Utils';

export class AmountRequired {
  _name: string;
  _currentValue = toBN(0);
  _requiredValue = toBN(0);
  _listener?: () => void;

  constructor (name: string, requiredValue: BN, listener?: () => void) {
    this._name = name;
    this._requiredValue = requiredValue;
    this._listener = listener;
  }

  get currentValue (): BN {
    return this._currentValue;
  }

  set currentValue (newValue: BN) {
    const didChange = !this._currentValue.eq(newValue);
    const wasSatisfied = this.isSatisfied;
    this._currentValue = newValue;
    if (didChange) {
      this._onChange(wasSatisfied);
    }
  }

  get requiredValue (): BN {
    return this._requiredValue;
  }

  set requiredValue (newValue: BN) {
    const didChange = !this._requiredValue.eq(newValue);
    const wasSatisfied = this.isSatisfied;
    this._requiredValue = newValue;
    if (didChange) {
      this._onChange(wasSatisfied);
    }
  }

  _onChange (wasSatisfied: boolean): void {
    let changeString;
    if (wasSatisfied === this.isSatisfied) {
      changeString = `still${this.isSatisfied ? '' : ' not'}`;
    } else if (this.isSatisfied) {
      changeString = 'now';
    } else {
      changeString = 'no longer';
    }
    const message = `${this._name} requirement is ${changeString} satisfied\n${this.description}`;
    log.warn(message);
    if (this._listener != null) {
      this._listener();
    }
  }

  get isSatisfied (): boolean {
    return this._currentValue.gte(this._requiredValue);
  }

  get description (): string {
    const status = boolString(this.isSatisfied);
    const actual: string = new EthVal(this._currentValue).toEth().toFixed(4);
    const required: string = new EthVal(this._requiredValue).toEth().toFixed(4);
    return `${this._name.padEnd(14)} | ${status.padEnd(14)} | actual: ${actual.padStart(12)} RBTC | required: ${required.padStart(12)} RBTC`;
  }
}
