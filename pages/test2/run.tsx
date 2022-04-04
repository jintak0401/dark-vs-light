import { Container, StepIndicator, TestTemplate } from '@components';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { shuffle } from '@lib/shuffle';
import { getTestAns, getTestSet } from '@lib/testset';
import styles from '@styles/test.module.scss';
import {
	defaultTimerTime,
	getFinishedTest,
	getTestState,
	goNextTurn,
	initTest,
	recordResult,
	setReady,
	setTimerTime,
	TestState,
	TestTypeEnum,
} from '@features/testSlice';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';

type Props = StateProps & DispatchProps;

const Test2Run = ({
	finishedTest,
	theme,
	testState,
	onChangeTheme,
	onSetReady,
	onGoNextTurn,
	onRecordResult,
	onSetTimerTime,
	onInitTest,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const { testType, round, turn, timer, ready } = testState;

	const goNext = async () => {
		onRecordResult(theme);
		const [tmpRound, tmpTurn] = [round, turn];
		if (tmpRound == 5 && tmpTurn === 2) {
			onChangeTheme(ThemeEnum.Toggle);
		}
		if (tmpRound === 5 && tmpTurn === 3) {
			await router.replace('/survey');
		} else {
			onGoNextTurn();
			window.scrollTo({ top: 0, behavior: 'smooth' });
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
		if (!ready && timer === 0) {
			goNext();
		}
	}, [timer]);

	useEffect(() => {
		onChangeTheme(ThemeEnum.Current);
		onInitTest(TestTypeEnum.Timer);
		if (finishedTest === 0) router.replace('/redirect');
	}, []);

	useEffect(() => handleRefreshAndGoBack(router));

	return (
		<Container>
			{round !== 6 && (
				<React.Fragment>
					<StepIndicator step={3} isTesting={true} />
					<div className={styles.questionContainer__withTimer}>
						<p className={styles.questionText}>
							<strong className={styles.questionText__strong}>
								{getTestAns(testType, round)}
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
	finishedTest: number;
}

const mapStateToProps = (state: RootState) => ({
	theme: getTheme(state),
	testState: getTestState(state),
	finishedTest: getFinishedTest(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onGoNextTurn: () => void;
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) => void;
	onSetTimerTime: (time?: number) => void;
	onInitTest: (testType?: TestTypeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onGoNextTurn: () => dispatch(goNextTurn()),
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(recordResult(theme)),
	onSetTimerTime: (time?: number) => dispatch(setTimerTime(time)),
	onInitTest: (testType?: TestTypeEnum) => dispatch(initTest(testType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test2Run);
