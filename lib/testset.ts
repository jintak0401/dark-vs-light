import { TestTypeEnum } from '@features/testSlice';

const testSet = [
	[
		'범법',
		'범볍',
		'볌법',
		'볌볍',
		'법범',
		'법볌',
		'볍범',
		'볍볌',
		'범범',
		'범볌',
		'볌범',
		'볌볌',
		'법법',
		'법볍',
		'볍법',
		'볍볍',
	],
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
		'꿑젬',
		'꿑졤',
		'꿀젭',
		'꿀졥',
		'꿑젭',
		'꿑졥',
	],
	[
		'찍먹',
		'찍벅',
		'직먹',
		'직벅',
		'찤먹',
		'찍멐',
		'찍멱',
		'찎먹',
		'찍몈',
		'찍펵',
		'칙먹',
		'직멱',
		'찍먺',
		'찤멱',
		'찎멱',
		'찍퍽',
	],
];

const ansStringSet = ['범법', '꿀잼', '찍먹'];

const ansUnit = 7;
const testUnit = [ansUnit, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1];

// testType: 1 or 2
// testNum: 1, 2, or 3
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

export { ansUnit, getTestSet, getTestAns };
