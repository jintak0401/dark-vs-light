const isSameList = (a: any[], b: any[]) => {
	const tmp = [...b];
	return JSON.stringify(a.sort()) === JSON.stringify(tmp.sort());
};

const timeConverter = (time: number) => {
	if (time < 61) return `${time}초`;
	else return `${Math.floor(time / 60)}분 ${(time % 60).toFixed(1)}초`;
};

export { isSameList, timeConverter };
