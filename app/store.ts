import {
	Action,
	AnyAction,
	combineReducers,
	configureStore,
	Reducer,
	ThunkAction,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import {
	themeReducer,
	testStateReducer,
	testResultReducer,
	surveyReducer,
} from '@features';

// 모든 리듀서 여기에 정의
const combinedReducer = combineReducers({
	themeReducer,
	testResultReducer,
	testStateReducer,
	surveyReducer,
});

const reducer = (
	state: ReturnType<typeof combinedReducer> | undefined,
	action: AnyAction
) => {
	switch (action.type) {
		case HYDRATE:
			return {
				...state,
				...action.payload,
			};
		default:
			return combinedReducer(state, action);
	}
};

// 새로고침해도 상태가 유지되도록 해주는 라이브러리 사용
const persistConfig = {
	key: 'root',
	version: 1,
	storage,
};

export const persistedReducer = persistReducer(persistConfig, reducer);

const makeConfiguredStore = (reducer: Reducer) =>
	configureStore({
		reducer: reducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
		devTools: process.env.NODE_ENV !== 'production',
	});

export const makeStore = () => {
	const isServer = typeof window === 'undefined';

	if (isServer) {
		return makeConfiguredStore(reducer);
	} else {
		const store = makeConfiguredStore(persistedReducer);
		const persistor = persistStore(store);
		return { persistor, ...store };
	}
};

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store['dispatch'];

declare global {
	type RootState = ReturnType<Store['getState']>;
}

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

export const wrapper = createWrapper(makeStore, {
	debug: process.env.NODE_ENV !== 'production',
});
