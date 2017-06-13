import { select, put, take, call } from 'redux-saga/effects';
import { translate } from '../../../../../../common/i18n';
import { updateWaitingForPurchase } from '../../../actions/standard';
import * as actions from '../../../constants/actions';
import * as states from '../../../constants/states';
import * as selectors from '../../selectors';

export default function* newTickWatcher(newTick) {
    const stage = yield select(selectors.stage);
    switch (stage) {
        case states.INITIALIZED:
            yield put(
                yield call(
                    updateWaitingForPurchase,
                    Error(translate('Bot should be started before calling watch function')),
                    true
                )
            );
            break;
        case states.PROPOSALS_READY:
            yield put(yield call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: true }));
            break;
        case states.STARTED:
            yield take(actions.RECEIVE_ALL_PROPOSALS);
            yield put(yield call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: true }));
            break;
        default:
            yield put(yield call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: false }));
            break;
    }
}
