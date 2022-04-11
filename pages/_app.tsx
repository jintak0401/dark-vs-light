import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import '@styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { createStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { Fragment, useEffect } from 'react';
import { MetaTags } from '@components';
import { useRouter } from 'next/router';
import * as ga from '@lib/ga';

function MyApp({ Component, pageProps }: AppProps) {
	const store = createStore(persistedReducer);
	const persistor = persistStore(store);
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url) => {
			ga.pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<Fragment>
			<MetaTags />
			<PersistGate loading={null} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Fragment>
	);
}

export default wrapper.withRedux(MyApp);
