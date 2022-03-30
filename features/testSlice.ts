import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeEnum } from '@features/themeSlice';

enum FontTypeEnum {
	Light,
	Regular,
	Bold,
}

enum GenderEnum {
	Male = 1,
	Female,
}

enum TestTypeEnum {
	StopWatch,
	Timer,
}

interface AnsResult {
	ansButNotPick: number; // 정답이지만 고르지 않은 개수
	notAnsButPick: number; // 정답이 아니지만 고른 개수
}

interface TestResult {
	darkTime: number[];
	lightTime: number[];
	darkAnsResult: AnsResult[];
	lightAnsResult: AnsResult[];
}

interface SurveyState {
	usuallyMode: string;
	age?: number;
	gender?: GenderEnum;
	moreReadableMode?: string;
	moreComfortableMode?: string;
}

interface TestState {
	startTime: string;
	round: number;
	turn: number;
	testAns: number[];
	userAns: number[];
	fontType: FontTypeEnum;
	testType: TestTypeEnum;
	ready: boolean;
	timer: number;
}

interface TotalTestState extends TestResult, SurveyState, TestState {
	testStep: number;
}

const defaultTimerTime = 15;
const initialState: TotalTestState = {
	darkTime: [],
	lightTime: [],
	darkAnsResult: [],
	lightAnsResult: [],
	usuallyMode: '',
	moreComfortableMode: '',
	moreReadableMode: '',
	startTime: '',
	round: 0,
	turn: 0,
	testAns: [],
	userAns: [],
	fontType: FontTypeEnum.Light,
	testType: TestTypeEnum.StopWatch,
	ready: false,
	timer: defaultTimerTime,
	testStep: 0,
};

const getTestResult = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): TestResult => ({
		darkTime: state.darkTime,
		lightTime: state.lightTime,
		darkAnsResult: state.darkAnsResult,
		lightAnsResult: state.lightAnsResult,
	})
);

const getTestState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): TestState => ({
		startTime: state.startTime,
		round: state.round,
		turn: state.turn,
		testAns: state.testAns,
		userAns: state.userAns,
		fontType: state.fontType,
		testType: state.testType,
		ready: state.ready,
		timer: state.timer,
	})
);

const getSurveyState = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState): SurveyState => ({
		usuallyMode: state.usuallyMode,
		age: state.age,
		moreReadableMode: state.moreReadableMode,
		moreComfortableMode: state.moreComfortableMode,
		gender: state.gender,
	})
);

const getFinishedTest = createSelector(
	[(state: RootState) => state.testReducer],
	(state: TotalTestState) => {
		if (state.lightAnsResult.length === 6 && state.darkAnsResult.length === 6)
			return 2;
		else if (
			state.lightAnsResult.length >= 3 &&
			state.darkAnsResult.length >= 3
		)
			return 1;
		else return 0;
	}
);

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
		initAll: (state) => {
			state.darkTime = [];
			state.lightTime = [];
			state.darkAnsResult = [];
			state.lightAnsResult = [];
			state.usuallyMode = '';
			state.startTime = '';
			state.round = 0;
			state.turn = 0;
			state.testAns = [];
			state.userAns = [];
			state.fontType = FontTypeEnum.Light;
			state.testType = TestTypeEnum.StopWatch;
			state.ready = false;
			state.timer = defaultTimerTime;
			state.testStep = 0;
		},
		recordResult: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Dark | ThemeEnum.Light>
		) => {
			const time =
				state.round < 3
					? +new Date() - +new Date(JSON.parse(state.startTime))
					: 0;
			const ansButNotPick = state.testAns.filter(
				(x: number) => !state.userAns.includes(x)
			).length;
			const notAnsButPick = state.userAns.filter(
				(x: number) => !state.testAns.includes(x)
			).length;
			const ansResult = { ansButNotPick, notAnsButPick };
			if (payload == ThemeEnum.Dark) {
				state.round < 3 && (state.darkTime[state.round] = time);
				state.darkAnsResult[state.round] = ansResult;
			} else {
				state.round < 3 && (state.lightTime[state.round] = time);
				state.lightAnsResult[state.round] = ansResult;
			}
		},
		setStart: (state) => {
			state.startTime = JSON.stringify(new Date());
		},
		goNextTurn: (state) => {
			state.testStep++;
			state.turn = Math.floor(state.testStep / 3);
			state.round = (state.testStep % 3) + 3 * Math.floor(state.testStep / 6);
			switch (state.round) {
				case 0:
				case 3:
					state.fontType = FontTypeEnum.Light;
					break;
				case 1:
				case 4:
					state.fontType = FontTypeEnum.Regular;
					break;
				case 2:
				case 5:
					state.fontType = FontTypeEnum.Bold;
					break;
				default:
			}
			state.userAns = [];
		},
		initTest: (state, { payload }: PayloadAction<TestTypeEnum | undefined>) => {
			state.testType = payload || TestTypeEnum.StopWatch;
			state.startTime = '';
			state.round = payload === TestTypeEnum.Timer ? 3 : 0;
			state.turn = payload === TestTypeEnum.Timer ? 2 : 0;
			state.fontType = FontTypeEnum.Light;
			state.ready = true;
			state.userAns = [];
			state.darkAnsResult.length = payload === TestTypeEnum.Timer ? 3 : 0;
			state.lightAnsResult.length = payload === TestTypeEnum.Timer ? 3 : 0;
			state.testStep = payload === TestTypeEnum.Timer ? 6 : 0;
		},
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
		setReady: (state, { payload }: PayloadAction<boolean>) => {
			state.ready = payload;
		},
		setTimerTime: (state, { payload }: PayloadAction<number | undefined>) => {
			state.timer = payload || state.timer - 1;
		},
		setAge: (state, { payload }: PayloadAction<number | undefined>) => {
			state.age = payload;
		},
		setGender: (state, { payload }: PayloadAction<number | undefined>) => {
			state.gender = payload;
		},
		setUsuallyMode: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Dark | ThemeEnum.Light>
		) => {
			state.usuallyMode = payload === ThemeEnum.Dark ? 'dark' : 'light';
		},
		setMoreReadableMode: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Dark | ThemeEnum.Light>
		) => {
			state.moreReadableMode = payload === ThemeEnum.Dark ? 'dark' : 'light';
		},
		setMoreComfortableMode: (
			state,
			{ payload }: PayloadAction<ThemeEnum.Dark | ThemeEnum.Light>
		) => {
			state.moreComfortableMode = payload === ThemeEnum.Dark ? 'dark' : 'light';
		},
		initSurvey: (state) => {
			state.age = undefined;
			state.gender = undefined;
			state.moreComfortableMode = undefined;
			state.moreReadableMode = undefined;
		},
	},
});

// state
export type { TestState, TotalTestState, SurveyState, TestResult, AnsResult };

// enum
export { TestTypeEnum, FontTypeEnum, GenderEnum };

const { actions, reducer: testReducer } = testSlice;

// setter
export const {
	initAll,
	recordResult,
	setStart,
	setReady,
	resetUserAns,
	setUserAns,
	setTestAns,
	initTest,
	goNextTurn,
	setTimerTime,
	setAge,
	setGender,
	setMoreComfortableMode,
	setMoreReadableMode,
	setUsuallyMode,
	initSurvey,
} = actions;

// reducer
export default testReducer;

// getter
export { getTestState, getFinishedTest, getSurveyState, getTestResult };

export { defaultTimerTime };
