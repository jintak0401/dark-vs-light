import { TestTypeEnum } from '@features/testSlice';

const testSet = [
	[
		'꿀잼',
		'꿀쟴',
		'꿑잼',
		'꿑쟴',
		'꿀잽',
		'꿀쟵',
		'꿑잽',
		'꿑쟵',
		'꿀젬',
		'꿀졤',
		'꿑졤',
		'꿀젭',
		'꿀졥',
	],
	[
		'범법',
		'범볍',
		'볌법',
		'볌볍',
		'법범',
		'법볌',
		'볍범',
		'범범',
		'범볌',
		'볌범',
		'볌볌',
		'법법',
		'법볍',
	],
	[
		'찍먹',
		'찍벅',
		'직먹',
		'찤먹',
		'찍멐',
		'찍멱',
		'찎먹',
		'찍몈',
		'찍펵',
		'찍먺',
		'찤멱',
		'찎멱',
		'찍퍽',
	],
];

const ansStringSet = [testSet[0][0], testSet[1][0], testSet[2][0]];

const ansUnit = 6;
const testUnit = [ansUnit, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const getTestSet = (testType: TestTypeEnum, round: number): string[] => {
	const ret = [];
	const unit = testUnit;
	const qSet = testSet[round % testSet.length];
	for (let i = 0; i < qSet.length; i++) {
		for (let j = 0; j < unit[i]; j++) {
			ret.push(qSet[i]);
		}
	}
	return ret;
};

const getTestAns = (round: number): string => {
	return ansStringSet[round % ansStringSet.length];
};

const testLength = testSet.length;

export { ansUnit, getTestSet, getTestAns, testLength };
