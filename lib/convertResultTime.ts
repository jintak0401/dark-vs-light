import { ResultTime } from '@features/testResultSlice';

const convertResultTime = ({
	darkResult,
	lightResult,
}: {
	darkResult: ResultTime[];
	lightResult: ResultTime[];
}) => {
	const darkTime: number[] = [0, 0, 0];
	const lightTime: number[] = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		darkTime[i] = +darkResult[i].end - +darkResult[i].start;
		lightTime[i] = +lightResult[i].end - +lightResult[i].start;
	}

	return { darkTime, lightTime };
};

export default convertResultTime;
