import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

enum FontTypeEnum {
	Light,
	Regular,
	Bold,
}

interface TestState {
	userAns: number[];
	testAns: number[];
	testNum: number;
	fontType: FontTypeEnum;
	start: Date;
	end: Date;
	questionSet: string[];
	ready: boolean;
}

const initialState: TestState = {
	userAns: [],
	testAns: [],
	testNum: 0,
	fontType: FontTypeEnum.Regular,
	start: new Date(),
	end: new Date(),
	questionSet: [],
	ready: false,
};

const getReady = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => state.ready
);

const getFontType = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => state.fontType
);

// const getIsSelected = createSelector(
// 	[(state: RootState) => state.testStateReducer, (state, idx: number) => idx],
// 	(state: TestState, idx) => state.userAns.has(idx)
// );

const getQuestionSet = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => state.questionSet
);

const getTestNum = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => state.testNum
);

const getUserAns = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => state.userAns
);

const getResultAns = createSelector(
	[(state: TestState) => state],
	(state: TestState) => {
		return {
			ansButNotPick: state.testAns?.filter(
				(x: number) => !state.userAns?.includes(x)
			).length,
			notAnsButPick: state.userAns?.filter(
				(x: number) => !state.testAns?.includes(x)
			).length,
		};
	}
);

const getRecordResultDataExceptMode = createSelector(
	[(state: RootState) => state.testStateReducer],
	(state: TestState) => {
		return {
			testNum: Math.floor(state.testNum / 2),
			resultTime: +state.end - +state.start,
			resultAns: getResultAns(state),
		};
	}
);

const testStateSlice = createSlice({
	name: 'testState',
	initialState,
	reducers: {
		resetUserAns: (state) => {
			state.userAns = [];
		},
		setUserAns: (state, { payload }: PayloadAction<number>) => {
			const idx = state.userAns.indexOf(payload);
			if (idx !== -1) state.userAns.splice(idx, 1);
			else state.userAns.push(payload);
		},
		setTestAns: (state, { payload }: PayloadAction<number[]>) => {
			state.testAns = payload;
		},
		setStart: (state) => {
			state.start = new Date();
			console.log('setStart');
		},
		setEnd: (state) => {
			state.end = new Date();
		},
		setReady: (state, { payload }: PayloadAction<boolean>) => {
			state.ready = payload;
		},
		goNextTestNum: (state) => {
			state.testNum++;
			if (state.testNum < 2)
				state.fontType = state.fontType = FontTypeEnum.Light;
			else if (state.testNum < 4) state.fontType = FontTypeEnum.Regular;
			else state.fontType = FontTypeEnum.Bold;
		},
		setFontType: (state, { payload }: PayloadAction<FontTypeEnum>) => {
			state.fontType = payload;
		},
		setQuestionSet: (state, { payload }: PayloadAction<string[]>) => {
			state.questionSet = payload;
		},
	},
});

// state
export type { TestState };

// enum
export { FontTypeEnum };

const { actions, reducer: testStateReducer } = testStateSlice;

// setter
export const {
	resetUserAns,
	setUserAns,
	setStart,
	setEnd,
	setFontType,
	setQuestionSet,
	setTestAns,
	goNextTestNum,
	setReady,
} = actions;

// reducer
export default testStateReducer;

// getter
export {
	getFontType,
	getRecordResultDataExceptMode,
	// getIsSelected,
	getUserAns,
	getQuestionSet,
	getTestNum,
	getReady,
};
