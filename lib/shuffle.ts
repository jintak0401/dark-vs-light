const shuffle = (testSet: string[]): [string[], number[]] => {
	const ansStr: string = testSet[0];

	let currentIndex = testSet.length,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[testSet[currentIndex], testSet[randomIndex]] = [
			testSet[randomIndex],
			testSet[currentIndex],
		];
	}

	const ansSet = [];

	for (let i = 0; i < testSet.length; i++) {
		if (testSet[i] === ansStr) ansSet.push(i);
	}

	return [testSet, ansSet];
};

export { shuffle };
