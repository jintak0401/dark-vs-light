import {
	Container,
	GoNextButton,
	RecommendSentence,
	Test1Result,
	Test2Result,
} from '@components';
import {
	getFinishedTest,
	getSurveyState,
	getTestResult,
	initTest,
	setReady,
	SurveyState,
	TestResult,
	TestTypeEnum,
} from '@features/testSlice';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	getRecommendMode,
	getTest1Result,
	getTest2Result,
} from '@lib/getRecommendMode';
import styles from '@styles/result.module.scss';

type Props = StateProps & DispatchProps;

const Result = ({
	theme,
	finishedTest,
	testResult,
	surveyState,
	onChangeTheme,
}: Props) => {
	const router = useRouter();
	const [darkCorrectRatio, setDarkCorrectRatio] = useState<number[]>([]);
	const [lightCorrectRatio, setLightCorrectRatio] = useState<number[]>([]);
	const [darkAverageTime, setDarkAverageTime] = useState<number>(0);
	const [lightAverageTime, setLightAverageTime] = useState<number>(0);
	const [recommendMode, setRecommendMode] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const { darkAnsResult, darkTime, lightAnsResult, lightTime } = testResult;
	const { usuallyMode } = surveyState;

	const getModeTextClassName = (mode: string): string => {
		if (mode !== theme) {
			if (mode === 'dark') return styles.modeText__dark;
			else return styles.modeText__light;
		} else {
			if (mode === 'dark') return styles.modeText__dark__active;
			else return styles.modeText__light__active;
		}
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Usually);

		setLoading(true);
		if (finishedTest !== 2) {
			router.replace('/redirect');
		} else {
			const test1Result = getTest1Result({
				darkTime,
				darkAnsResult,
				lightAnsResult,
				lightTime,
			});
			const test2Result = getTest2Result({ darkAnsResult, lightAnsResult });
			setDarkAverageTime(test1Result[0]);
			setLightAverageTime(test1Result[2]);
			setDarkCorrectRatio([test1Result[1], test2Result[0]]);
			setLightCorrectRatio([test1Result[3], test2Result[1]]);
			setRecommendMode(
				getRecommendMode({
					darkCorrectRatio,
					lightCorrectRatio,
					darkAverageTime,
					lightAverageTime,
					usuallyMode,
				})
			);
			setLoading(false);
		}
	}, []);

	return (
		<Container>
			<button onClick={() => onChangeTheme(ThemeEnum.Toggle)}>
				테마바꾸기
			</button>
			{!loading && recommendMode && (
				<Fragment>
					<h1 className={styles.emoji}>🧐</h1>
					<h1 className={styles.title}>결과는!</h1>
					<p className={styles.description}>
						테스트 결과를 평균적으로 알려드릴게요!
					</p>
					<Test1Result
						darkCorrectRatio={darkCorrectRatio[0]}
						darkAverageTime={darkAverageTime}
						lightCorrectRatio={lightCorrectRatio[0]}
						lightAverageTime={lightAverageTime}
						getModeTextClassName={getModeTextClassName}
					/>
					<Test2Result
						darkCorrectRatio={darkCorrectRatio[1]}
						lightCorrectRatio={lightCorrectRatio[1]}
						getModeTextClassName={getModeTextClassName}
					/>
				</Fragment>
			)}
			<RecommendSentence
				recommendMode={recommendMode}
				getModeTextClassName={getModeTextClassName}
			/>
			{!loading && !recommendMode && (
				<GoNextButton
					goNext={() => router.replace('/')}
					body={'제대로 할게요'}
				/>
			)}
		</Container>
	);
};

interface StateProps {
	theme: string;
	finishedTest: number;
	testResult: TestResult;
	surveyState: SurveyState;
}

const mapStateToProps = (state: RootState) => ({
	theme: getTheme(state) === ThemeEnum.Dark ? 'dark' : 'light',
	finishedTest: getFinishedTest(state),
	testResult: getTestResult(state),
	surveyState: getSurveyState(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onInitTest: (testType?: TestTypeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onInitTest: (testType?: TestTypeEnum) => dispatch(initTest(testType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Result);
