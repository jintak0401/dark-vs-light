import { AnsResult } from '@features/testSlice';
import { ansUnit } from '@lib/testset';

interface RecommendProps {
	darkCorrectRatio: number[];
	lightCorrectRatio: number[];
	darkAverageTime: number;
	lightAverageTime: number;
	usuallyMode: string;
}

interface Test1Props {
	darkTime: number[];
	lightTime: number[];
	darkAnsResult: AnsResult[];
	lightAnsResult: AnsResult[];
}

interface Test2Props {
	darkAnsResult: AnsResult[];
	lightAnsResult: AnsResult[];
}

const getCorrectRatio = ({ darkAnsResult, lightAnsResult }: Test2Props) => {
	let darkPick = 0,
		darkCorrect = 0,
		lightPick = 0,
		lightCorrect = 0;

	for (let i = 0; i < 3; i++) {
		darkPick += ansUnit + darkAnsResult[i].notAnsButPick;
		lightPick += ansUnit + lightAnsResult[i].notAnsButPick;
		darkCorrect += ansUnit - darkAnsResult[i].ansButNotPick;
		lightCorrect += ansUnit - lightAnsResult[i].ansButNotPick;
	}
	return [
		Math.ceil((darkCorrect / darkPick) * 100),
		Math.ceil((lightCorrect / lightPick) * 100),
	];
};

// [avgDarkTime, darkCorrectRatio, avgLightTime, lightCorrectRatio]
const getTest1Result = ({
	darkTime,
	darkAnsResult,
	lightAnsResult,
	lightTime,
}: Test1Props): [number, number, number, number] => {
	let darkTimeSum = 0,
		lightTimeSum = 0;

	const [darkCorrectRatio, lightCorrectRatio] = getCorrectRatio({
		darkAnsResult: darkAnsResult.slice(0, 3),
		lightAnsResult: lightAnsResult.slice(0, 3),
	});

	for (let i = 0; i < 3; i++) {
		darkTimeSum += darkTime[i];
		lightTimeSum += lightTime[i];
	}
	return [
		Number((darkTimeSum / 3000).toFixed(1)),
		darkCorrectRatio,
		Number((lightTimeSum / 3000).toFixed(1)),
		lightCorrectRatio,
	];
};

const getTest2Result = ({ darkAnsResult, lightAnsResult }: Test2Props) => {
	return getCorrectRatio({
		darkAnsResult: darkAnsResult.slice(3, 6),
		lightAnsResult: lightAnsResult.slice(3, 6),
	});
};

// 가중치: 0초 -> 2, 15초 -> 1, 40초 -> 0.5 인 유리함수
const getModePoint = (correctRatio: number[], averageTime: number) => {
	const a = -120 / 7,
		b = 1800 / 49,
		c = -1 / 7;
	const test1 = (b / (averageTime - a) + c) * correctRatio[0];
	return test1 + correctRatio[1];
};

const getRecommendMode = ({
	darkCorrectRatio,
	darkAverageTime,
	lightCorrectRatio,
	lightAverageTime,
	usuallyMode,
}: RecommendProps): string => {
	if (
		darkCorrectRatio[0] < 30 ||
		darkCorrectRatio[1] < 20 ||
		lightCorrectRatio[0] < 30 ||
		lightCorrectRatio[1] < 20 ||
		darkAverageTime >= 300 ||
		lightAverageTime >= 300
	) {
		return '';
	}

	const darkPoint = getModePoint(darkCorrectRatio, darkAverageTime);
	const lightPoint = getModePoint(lightCorrectRatio, lightAverageTime);

	if (Math.abs(darkPoint - lightPoint) < 5) return usuallyMode;
	else if (darkPoint > lightPoint) return 'dark';
	else return 'light';
};

export { getTest1Result, getTest2Result, getRecommendMode };
