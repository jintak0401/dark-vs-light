import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import '@styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { createStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

function MyApp({ Component, pageProps }: AppProps) {
	const store = createStore(persistedReducer);
	const persistor = persistStore(store);

	return (
		<PersistGate persistor={persistor}>
			<Component {...pageProps} />
		</PersistGate>
	);
}

export default wrapper.withRedux(MyApp);
