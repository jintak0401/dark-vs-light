import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeEnum } from '@features/themeSlice';

enum FontTypeEnum {
	Light,
	Regular,
	Bold,
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

interface Survey {
	usuallyMode: string;
	age: number;
	moreReadableMode: string;
	moreComfortableMode: string;
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

interface TotalTestState extends TestResult, Survey, TestState {}

const defaultTimerTime = 20;
const initialState: TotalTestState = {
	darkTime: [],
	lightTime: [],
	darkAnsResult: [],
	lightAnsResult: [],
	usuallyMode: '',
	age: 0,
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
};

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

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {
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
			state.turn++;
			if (state.turn == 2) {
				state.round++;
				state.turn = 0;
			}
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
			state.turn = 0;
			state.fontType = FontTypeEnum.Light;
			state.ready = true;
			state.userAns = [];
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
	},
});

// state
export type { TestState, TotalTestState };

// enum
export { TestTypeEnum, FontTypeEnum };

const { actions, reducer: testReducer } = testSlice;

// setter
export const {
	recordResult,
	setStart,
	setReady,
	resetUserAns,
	setUserAns,
	setTestAns,
	initTest,
	goNextTurn,
	setTimerTime,
} = actions;

// reducer
export default testReducer;

// getter
export { getTestState };

export { defaultTimerTime };
