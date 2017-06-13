import { take, put } from 'redux-saga/effects';
import { newTick } from '../../../actions/standard';

export default function* tickLoop(channel) {
    let payload = yield take(channel);
    while (payload) {
        const { epoch } = payload;
        yield put(newTick(epoch));
        payload = yield take(channel);
    }
}
