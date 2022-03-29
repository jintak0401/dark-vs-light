import type { AppProps } from 'next/app';
import { persistedReducer, wrapper } from '@app/store';
import '@styles/globals.scss';
import { PersistGate } from 'redux-persist/integration/react';
import { createStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { PaletteMode, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { connect } from 'react-redux';
import { getTheme, ThemeEnum } from '@features/themeSlice';
import { useEffect } from 'react';

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
