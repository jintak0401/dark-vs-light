import {
	Container,
	GoNextButton,
	StepIndicator,
	TestTemplate,
} from '@components';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { shuffle } from '@lib/shuffle';
import { getTestAns, getTestSet } from '@lib/testset';
import styles from '@styles/test.module.scss';
import {
	getTestState,
	goNextTurn,
	TestState,
	setReady,
	recordResult,
	getFinishedTest,
} from '@features/testSlice';

type Props = StateProps & DispatchProps;

const Test1Run = ({
	theme,
	testState,
	onChangeTheme,
	onSetReady,
	onGoNextTurn,
	onRecordResult,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const { testType, round, turn, userAns } = testState;
	const goNext = async () => {
		onRecordResult(theme);
		const [tmpRound, tmpTurn] = [round, turn];
		if (tmpRound === 2 && tmpTurn === 0) {
			onChangeTheme(ThemeEnum.Toggle);
		}
		if (tmpRound === 2 && tmpTurn === 1) {
			await router.replace('/test2');
		} else {
			onGoNextTurn();
		}
	};

	useEffect(() => {
		onSetReady(true);
		if (round != 3) {
			const [qSet, aSet] = shuffle(getTestSet(testType, round));
			setQuests(qSet);
			setAnswers(aSet);
		}
	}, [round, turn]);

	useEffect(() => {
		onChangeTheme(ThemeEnum.Current);
	}, []);

	return (
		<Container>
			{round !== 3 && (
				<React.Fragment>
					<StepIndicator step={2} />
					<p className={styles.questionText}>
						<strong className={styles.questionText__strong}>
							{getTestAns(round)}
						</strong>
						을 모두 골라주세요
					</p>
					<TestTemplate ansSet={answers} questionSet={quests} />
					<GoNextButton goNext={goNext} disabled={userAns.length === 0} />
				</React.Fragment>
			)}
		</Container>
	);
};

interface StateProps {
	theme: ThemeEnum.Light | ThemeEnum.Dark;
	testState: TestState;
}

const mapStateToProps = (state: RootState) => ({
	finishedTest: getFinishedTest(state),
	theme: getTheme(state),
	testState: getTestState(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onGoNextTurn: () => void;
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onGoNextTurn: () => dispatch(goNextTurn()),
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(recordResult(theme)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test1Run);
