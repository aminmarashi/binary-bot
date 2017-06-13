import { select, call, put, spawn } from 'redux-saga/effects';
import * as selectors from '../selectors';
import proposal from '../proposal';
import requestPurchase from './requestPurchase';
import { requestPurchase as requestPurchaseAction, purchaseDone } from '../../actions/standard';

export default function* purchase({ $scope, contractType }) {
    const receivedProposals = yield select(selectors.receivedProposals);
    yield put(requestPurchaseAction());
    const selectedProposal = Object.values(receivedProposals).find(p => p.contractType === contractType);
    try {
        const { buy: { contract_id: contractID } } = yield call(requestPurchase, {
            $scope,
            proposal: selectedProposal,
        });
        yield put(purchaseDone(contractID));
    } catch (e) {
        yield put(purchaseDone(e, true));
    }
    const tradeOption = yield select(selectors.tradeOption);
    yield spawn(proposal, { $scope, tradeOption });
}
