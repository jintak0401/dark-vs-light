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
import React, { Fragment, useEffect, useState } from 'react';
import { shuffle } from '@lib/shuffle';
import { getTestAns, getTestSet, testLength } from '@lib/testset';
import styles from '@styles/test.module.scss';
import {
	getFinishedTest,
	getSurveyState,
	getTestState,
	goNextTurn,
	initTest,
	recordResult,
	setReady,
	TestState,
	TestTypeEnum,
} from '@features/testSlice';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';
import Head from 'next/head';

type Props = StateProps & DispatchProps;

const Test1Run = ({
	theme,
	testState,
	usuallyMode,
	onChangeTheme,
	onSetReady,
	onGoNextTurn,
	onRecordResult,
	onInitTest,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const { testType, round, turn, userAns } = testState;
	const goNext = async () => {
		onRecordResult(theme);
		const [tmpRound, tmpTurn] = [round, turn];
		if (tmpRound === testLength - 1 && tmpTurn === 0) {
			onChangeTheme(ThemeEnum.Toggle);
		}
		if (tmpRound === testLength - 1 && tmpTurn === 1) {
			await router.replace('/test2');
		} else {
			onGoNextTurn();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	useEffect(() => {
		onSetReady(true);
		if (round != testLength) {
			const [qSet, aSet] = shuffle(getTestSet(testType, round));
			setQuests(qSet);
			setAnswers(aSet);
		}
	}, [round, turn]);

	useEffect(() => {
		if (usuallyMode === '') {
			router.replace('redirect');
		} else {
			onChangeTheme(ThemeEnum.NotUsually);
			const timer = setTimeout(() => onChangeTheme(ThemeEnum.Usually), 1);
			onInitTest(TestTypeEnum.StopWatch);

			return () => {
				clearTimeout(timer);
			};
		}
	}, []);

	useEffect(() => handleRefreshAndGoBack(router));

	return (
		<Fragment>
			<Head>
				<title>다크모드 vs 라이트모드 | 문제1</title>
			</Head>
			<Container>
				{round !== testLength && (
					<Fragment>
						<StepIndicator step={2} isTesting={true} />
						<div className={styles.testContainer}>
							<p className={styles.questionText}>
								<strong className={styles.questionText__strong}>
									{getTestAns(testType, round)}
								</strong>
								을 모두 골라주세요
							</p>
							<TestTemplate ansSet={answers} questionSet={quests} />
							<GoNextButton goNext={goNext} disabled={userAns.length === 0} />
						</div>
					</Fragment>
				)}
			</Container>
		</Fragment>
	);
};

interface StateProps {
	theme: ThemeEnum.Light | ThemeEnum.Dark;
	testState: TestState;
	usuallyMode: string;
}

const mapStateToProps = (state: RootState) => ({
	finishedTest: getFinishedTest(state),
	theme: getTheme(state),
	testState: getTestState(state),
	usuallyMode: getSurveyState(state).usuallyMode,
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onGoNextTurn: () => void;
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) => void;
	onInitTest: (testType?: TestTypeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onGoNextTurn: () => dispatch(goNextTurn()),
	onRecordResult: (theme: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(recordResult(theme)),
	onInitTest: (testType?: TestTypeEnum) => dispatch(initTest(testType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test1Run);
