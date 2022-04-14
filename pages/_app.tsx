import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import '@styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { createStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '@lib/gtag';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@lib/gtag';
import { MetaTags } from '@components';

function MyApp({ Component, pageProps }: AppProps) {
	const store = createStore(persistedReducer);
	const persistor = persistStore(store);
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: URL) => {
			gtag.pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		router.events.on('hashChangeComplete', handleRouteChange);

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
			router.events.off('hashChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<Fragment>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
				strategy="afterInteractive"
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
				  window.dataLayer = window.dataLayer || [];
				  function gtag(){window.dataLayer.push(arguments);}
				  gtag('js', new Date());

				  gtag('config', "${GA_TRACKING_ID}");
				`,
				}}
			/>
			<PersistGate loading={null} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Fragment>
	);
}

export default wrapper.withRedux(MyApp);
