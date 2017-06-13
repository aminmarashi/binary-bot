import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { eventChannel } from 'redux-saga';
import requestBalance from '../balance/requestBalance';
import createScope from '../createScope';
import { initialize } from '../../actions/standard';
import * as actions from '../../constants/actions';
import * as properties from '../../constants/properties';
import { updatePropertyAction } from '../../tools';
import init from './';
import dataStream from '../dataStream';

const symbol = 'R_100';
const initOption = { symbol };
const $scope = createScope();
const token = '123';
const arg = { $scope, token, initOption };

const fakeTickChannel = eventChannel(() => () => {});
const fakeBalanceChannel = eventChannel(() => () => {});
const epoch = 123456;
const tickPayload = { epoch };
const balancePayload = { balance: '12.00', currency: 'USD' };
let firstTick = true;
let firstBalance = true;

describe('init integration', () => {
    it('should put INITIALIZE', () =>
        expectSaga(init, arg)
            .provide([
                [matchers.call.fn(requestBalance), {}],
                [matchers.call(dataStream, { $scope, type: 'balance' }), fakeBalanceChannel],
                [matchers.call(dataStream, { $scope, type: 'tick', symbol }), fakeTickChannel],
                {
                    take({ channel }, next) {
                        if (channel === fakeTickChannel) {
                            if (firstTick) {
                                firstTick = false;
                                return tickPayload;
                            }
                            return undefined;
                        }
                        if (channel === fakeBalanceChannel) {
                            if (firstBalance) {
                                firstBalance = false;
                                return balancePayload;
                            }
                            return undefined;
                        }
                        return next();
                    },
                },
            ])
            .take(actions.NEW_TICK)
            .take(updatePropertyAction(properties.RECEIVED_BALANCE))
            .put(initialize(initOption))
            .run());
});
