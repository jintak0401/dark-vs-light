import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
	theme: string;
}

const initialState: ThemeState = {
	theme: '',
};

const getTheme = createSelector(
	[(state: RootState) => state.themeReducer],
	(state: ThemeState): ThemeEnum.Dark | ThemeEnum.Light =>
		state.theme === 'dark' ? ThemeEnum.Dark : ThemeEnum.Light
);

enum ThemeEnum {
	Default,
	Toggle,
	Light,
	Dark,
	Current,
}

const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		changeTheme: (state, { payload }: PayloadAction<ThemeEnum>) => {
			switch (payload) {
				case ThemeEnum.Default:
					const isDarkMode = window.matchMedia(
						'(prefers-color-scheme: dark)'
					).matches;
					state.theme = isDarkMode ? 'dark' : 'light';
					break;
				case ThemeEnum.Toggle:
					state.theme = state.theme == 'light' ? 'dark' : 'light';
					break;
				case ThemeEnum.Dark:
					state.theme = 'dark';
					break;
				case ThemeEnum.Light:
					state.theme = 'light';
					break;
				// 그대로
				default:
					break;
			}
			document.documentElement.setAttribute('data-theme', state.theme);
		},
	},
});

// type
export type { ThemeState };

// Enum
export { ThemeEnum };

const { actions, reducer: themeReducer } = themeSlice;

// setter
export const { changeTheme } = actions;

// reducer
export default themeReducer;

// getter
export { getTheme };
