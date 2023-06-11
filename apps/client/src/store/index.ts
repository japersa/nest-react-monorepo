import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from '../sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
