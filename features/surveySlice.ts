import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeEnum, ThemeState } from '@features/themeSlice';

interface SurveyState {
	usuallyMode: string;
	userAge: number;
	whichModeMoreReadable: string;
	whichModeMoreComfortable: string;
	gender: number; // 0: 남자, 1: 여자
}

const initialState: SurveyState = {
	usuallyMode: 'light',
	userAge: 0,
	whichModeMoreComfortable: 'light',
	whichModeMoreReadable: 'light',
	gender: 0,
};

const getUsuallyMode = createSelector(
	[(state: RootState) => state.SurveyReducer],
	(state: SurveyState) => state.usuallyMode
);

const surveySlice = createSlice({
	name: 'survey',
	initialState,
	reducers: {
		setUsuallyMode: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Dark | ThemeEnum.Light>
		) => {
			state.usuallyMode = payload === ThemeEnum.Dark ? 'dark' : 'light';
		},
	},
});

// type
export type { ThemeState };

// Enum
export { ThemeEnum };

const { actions, reducer: surveyReducer } = surveySlice;

// setter
export const { setUsuallyMode } = actions;

// reducer
export default surveyReducer;

// getter
export { getUsuallyMode };
