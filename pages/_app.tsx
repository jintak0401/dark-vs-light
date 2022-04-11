import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import '@styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { createStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { Fragment, useEffect } from 'react';
import { MetaTags } from '@components';
import Script from 'next/script';
import { useRouter } from 'next/router';
import * as gtag from '@lib/gtag';
import { GA_TRACKING_ID } from '@lib/gtag';

const isProduction = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }: AppProps) {
	const store = createStore(persistedReducer);
	const persistor = persistStore(store);
	const router = useRouter();

	useEffect(() => {
		const handleRouteChange = (url: URL) => {
			/* invoke analytics function only for production */
			if (isProduction) gtag.pageview(url);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);
	return (
		<Fragment>
			<Script
				async={true}
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
			/>
			<Script
				id="gtag-init"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
			<MetaTags />
			<PersistGate loading={null} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Fragment>
	);
}

export default wrapper.withRedux(MyApp);
