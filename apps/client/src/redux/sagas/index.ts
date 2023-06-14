import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsersSuccess, fetchUsers } from '../slices/users.ts';
import { Action } from 'redux';

function* fetchUserWorker(_action: Action): Generator<any, void, any> {
    try {
        const users = yield call(fetchUsers);
        console.log('fetchUserWorker', users);

        yield put(fetchUsersSuccess(users));
    } catch (e) {
        console.log('fetchUserWorker error', e);
    }
}

export function* rootSaga() {
    yield takeLatest('FETCH_USER', fetchUserWorker);
}
