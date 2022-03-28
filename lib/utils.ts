const isSameList = (a: any[], b: any[]) => {
	const tmp = [...b];
	return JSON.stringify(a.sort()) === JSON.stringify(tmp.sort());
};

export { isSameList };
