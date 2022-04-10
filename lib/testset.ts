import { TestTypeEnum } from '@features/testSlice';

const testSet1 = [
	[
		'반출',
		'반츌',
		'뱐출',
		'뱐츌',
		'반춭',
		'반츝',
		'뱐춭',
		'뱐츝',
		'만출',
		'만츌',
		'먄출',
		'먄츌',
	],
	[
		'국물',
		'국뮬',
		'귝물',
		'귝뮬',
		'국뭍',
		'국뮽',
		'귝뭍',
		'귝뮽',
		'국불',
		'국뷸',
		'귝불',
		'귝뷸',
	],
	[
		'쫄면',
		'쬴면',
		'쫄먼',
		'쬴먼',
		'쫕면',
		'쭅면',
		'쫕먼',
		'쫕면',
		'쫄변',
		'쬴변',
		'쫄번',
		'쬴번',
	],
];

const testSet2 = [
	[
		'철문',
		'철뮨',
		'쳘문',
		'쳘뮨',
		'첱문',
		'첱뮨',
		'쳩문',
		'쳩뮨',
		'철분',
		'철뷴',
		'쳘분',
		'쳘뷴',
	],
	[
		'건물',
		'건뮬',
		'견물',
		'견뮬',
		'건뭍',
		'건뮽',
		'견뭍',
		'견뮽',
		'건불',
		'건뷸',
		'견불',
		'견뷸',
	],
	[
		'짠물',
		'짠뮬',
		'쨘물',
		'쨘뮬',
		'짠뭍',
		'짠뮽',
		'쨘뭍',
		'쨘뮽',
		'짠불',
		'짠뷸',
		'쨘불',
		'쨘뷸',
	],
];

const ansStringSet = [
	[testSet1[0][0], testSet1[1][0], testSet1[2][0]],
	[testSet2[0][0], testSet2[1][0], testSet2[2][0]],
];

const ansUnit = 6;
const testUnit = [ansUnit, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const getTestSet = (testType: TestTypeEnum, round: number): string[] => {
	const ret = [];
	const unit = testUnit;
	const qSet = (testType == 0 ? testSet1 : testSet2)[round % testSet1.length];
	for (let i = 0; i < qSet.length; i++) {
		for (let j = 0; j < unit[i]; j++) {
			ret.push(qSet[i]);
		}
	}
	return ret;
};

const getTestAns = (testType: TestTypeEnum, round: number): string => {
	return ansStringSet[testType][round % ansStringSet[0].length];
};

const testLength = testSet1.length;

export { ansUnit, getTestSet, getTestAns, testLength };
