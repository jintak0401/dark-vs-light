import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeEnum } from '@features/themeSlice';

interface ResultAns {
	ansButNotPick: number; // 정답이지만 고르지 않은 개수
	notAnsButPick: number; // 정답이 아니지만 고른 개수
}

export interface TestResult {
	darkResultTime: number[];
	lightResultTime: number[];
	darkResultAns: ResultAns[];
	lightResultAns: ResultAns[];
}

const getTmpAns = (): ResultAns => {
	return { ansButNotPick: 0, notAnsButPick: 0 };
};

const initialState: TestResult = {
	darkResultTime: Array.from({ length: 3 }, () => 1000),
	lightResultTime: Array.from({ length: 3 }, () => 1000),
	darkResultAns: Array.from({ length: 3 }, () => getTmpAns()),
	lightResultAns: Array.from({ length: 3 }, () => getTmpAns()),
};

interface RecordResultExceptMode {
	testNum: number; // 0, 1, 2 중 하나
	resultTime: number;
	resultAns: ResultAns;
}

interface RecordResultData extends RecordResultExceptMode {
	mode: ThemeEnum.Dark | ThemeEnum.Light;
}

const testResultSlice = createSlice({
	name: 'testResult',
	initialState,
	reducers: {
		recordResult: (state, { payload }: PayloadAction<RecordResultData>) => {
			if (payload.mode == ThemeEnum.Dark) {
				state.darkResultTime[payload.testNum] = payload.resultTime;
				state.darkResultAns[payload.testNum] = payload.resultAns;
			} else {
				state.lightResultTime[payload.testNum] = payload.resultTime;
				state.lightResultAns[payload.testNum] = payload.resultAns;
			}
		},
	},
});

export type { ResultAns, RecordResultExceptMode, RecordResultData };

const { actions, reducer: testResultReducer } = testResultSlice;
export const { recordResult } = actions;

export default testResultReducer;

export {};
