import { testSaga } from 'redux-saga-test-plan';
import { translate } from '../../../../../../common/i18n';
import { updateWaitingForPurchase } from '../../../actions/standard';
import * as actions from '../../../constants/actions';
import * as states from '../../../constants/states';
import * as selectors from '../../selectors';
import newTickWatcher from './';

const newTick = 12345;
const dummyErrorAction = { error: true };
const dummyStayInsideAction = { stayInsideScope: true };
const dummyGoOutAction = { stayInsideScope: false };
const error = Error(translate('Bot should be started before calling watch function'));

describe('newTickWatcher saga', () => {
    it('should throw error if stage is INITIALIZED', () => {
        testSaga(newTickWatcher, newTick)
            .next()
            .select(selectors.stage)
            .next(states.INITIALIZED)
            .call(updateWaitingForPurchase, error, true)
            .next(dummyErrorAction)
            .put(dummyErrorAction)
            .next()
            .isDone();
    });
    it('should updateWaitingForPurchase if stage is PROPOSALS_READY', () => {
        testSaga(newTickWatcher, newTick)
            .next()
            .select(selectors.stage)
            .next(states.PROPOSALS_READY)
            .call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: true })
            .next(dummyStayInsideAction)
            .put(dummyStayInsideAction)
            .next()
            .isDone();
    });
    it('should updateWaitingForPurchase after RECEIVE_ALL_PROPOSALS if stage is STARTED', () => {
        testSaga(newTickWatcher, newTick)
            .next()
            .select(selectors.stage)
            .next(states.STARTED)
            .take(actions.RECEIVE_ALL_PROPOSALS)
            .next()
            .call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: true })
            .next(dummyStayInsideAction)
            .put(dummyStayInsideAction)
            .next()
            .isDone();
    });
    it('should updateWaitingForPurchase with stayInsideScope == false if stage is not STARTED, INITIALIZED, nor PROPOSALS_READY', () => {
        testSaga(newTickWatcher, newTick)
            .next()
            .select(selectors.stage)
            .next(states.SUCCESSFUL_PURCHASE)
            .call(updateWaitingForPurchase, { timestamp: newTick, stayInsideScope: false })
            .next(dummyGoOutAction)
            .put(dummyGoOutAction)
            .next()
            .isDone();
    });
});
