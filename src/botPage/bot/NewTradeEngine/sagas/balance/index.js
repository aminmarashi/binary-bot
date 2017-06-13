import { call, take, put } from 'redux-saga/effects';
import { updateReceivedBalance } from '../../actions/standard';
import dataStream from '../dataStream';
import requestBalance from './requestBalance';

export default function* balance(arg) {
    const { $scope } = arg;
    try {
        yield call(requestBalance, arg);
        const channel = yield call(dataStream, { $scope, type: 'balance' });
        let payload = yield take(channel);
        while (payload) {
            const { balance: balanceObj } = payload;
            yield put(updateReceivedBalance(balanceObj));
            payload = yield take(channel);
        }
    } catch (error) {
        yield put(updateReceivedBalance(error, true));
    }
}
