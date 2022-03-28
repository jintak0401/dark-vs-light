import { Container, GoNextButton, TestTemplate } from '@components';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { shuffle } from '@lib/shuffle';
import { ansStringSet, getTestAns, getTestSet } from '@lib/testset';
import styles from '@styles/test.module.scss';
import {
	getTestState,
	goNextTurn,
	TestState,
	setReady,
	recordResult,
	setTimerTime,
	defaultTimerTime,
} from '@features/testSlice';

type Props = StateProps & DispatchProps;

const Test2Run = ({
	theme,
	testState,
	onChangeTheme,
	onSetReady,
	onGoNextTurn,
	onRecordResult,
	onSetTimerTime,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const { testType, round, turn, userAns, timer } = testState;
	const goNext = async () => {
		onRecordResult(theme);
		const [tmpRound, tmpTurn] = [round, turn];
		if (tmpRound === 5 && tmpTurn === 1) {
			await router.replace('/result');
		} else {
			onGoNextTurn();
			onChangeTheme(ThemeEnum.Toggle);
		}
	};

	useEffect(() => {
		onSetReady(true);
		onSetTimerTime(defaultTimerTime);
		if (round != 6) {
			const [qSet, aSet] = shuffle(getTestSet(testType, round));
			setQuests(qSet);
			setAnswers(aSet);
		}
	}, [round, turn]);

	useEffect(() => {
		if (timer === 0) {
			goNext();
		}
	}, [timer]);

	useEffect(() => {
		onChangeTheme(ThemeEnum.Current);
	}, []);

	return (
		<Container>
			{round !== 6 && (
				<React.Fragment>
					<div className={styles.questionContainer__withTimer}>
						<p className={styles.questionText}>
							<strong className={styles.questionText__strong}>
								{getTestAns(round)}
							</strong>
							을 모두 골라주세요
						</p>
						<p className={styles.timer}>{timer}초</p>
					</div>
					<TestTemplate
						ansSet={answers}
						questionSet={quests}
						needTimer={true}
					/>
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
	theme: getTheme(state),
	testState: getTestState(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onGoNextTurn: () => void;
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) => void;
	onSetTimerTime: (time?: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onGoNextTurn: () => dispatch(goNextTurn()),
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(recordResult(theme)),
	onSetTimerTime: (time?: number) => dispatch(setTimerTime(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test2Run);
