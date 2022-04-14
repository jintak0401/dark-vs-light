import {
	Container,
	GoNextButton,
	MetaTags,
	StepIndicator,
	TestTemplate,
} from '@components';
import { changeTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '@app/store';
import {
	getSurveyState,
	getTestState,
	initTest,
	setReady,
	TestState,
	TestTypeEnum,
} from '@features/testSlice';
import styles from '@styles/test.module.scss';
import { useRouter } from 'next/router';
import { shuffle } from '@lib/shuffle';
import { getPracticeTestAns, getPracticeTestSet } from '@lib/testset';

type Props = StateProps & DispatchProps;

const Test1 = ({
	usuallyMode,
	onChangeTheme,
	testState,
	onSetReady,
	onInitTest,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const { userAns } = testState;
	const [practiceNum, setPracticeNum] = useState<number>(0);

	const getWarningClassName = () => {
		if (userAns.length === 0) return styles.warningText__inactive;
		else return styles.warningText__active;
	};

	const goNext = async () => {
		if (practiceNum == 1) await router.push('/test1/run');
		else {
			setPracticeNum((prev) => prev + 1);
		}
	};

	useEffect(() => {
		if (usuallyMode === '') {
			router.replace('redirect');
		} else {
			onChangeTheme(ThemeEnum.Usually);
			onInitTest(TestTypeEnum.StopWatch);
		}
		onSetReady(false);
	}, []);

	useEffect(() => {
		if (practiceNum <= 1) {
			onInitTest(TestTypeEnum.StopWatch);
			const [qSet, aSet] = shuffle(getPracticeTestSet(practiceNum));
			setQuests(qSet);
			setAnswers(aSet);
		}
		if (practiceNum == 1) {
			onChangeTheme(ThemeEnum.Toggle);
		}
	}, [practiceNum]);

	return (
		<Container>
			<MetaTags append={'설명1'} />
			<StepIndicator step={2} />
			<h2 className={styles.description}>
				제시한 단어와 정확하게 일치하는 단어들을 모두 골라주세요!
				<br />
				(총 몇개인지는 아무도 몰라요!)
			</h2>
			<p className={styles.questionText}>
				2개의 예시문제 중 {practiceNum + 1}번째 예시 문제에요.&nbsp;
				<strong className={styles.questionText__strong}>
					{getPracticeTestAns(practiceNum)}
				</strong>
				{practiceNum ? '을' : '를'} 모두 골라주세요.
				<br />
			</p>
			<TestTemplate ansSet={answers} questionSet={quests} />
			<div className={getWarningClassName()}>
				모두 고르셨으면 버튼을 눌러주세요
			</div>
			<GoNextButton
				goNext={goNext}
				body={practiceNum === 0 ? '다음 예시문제' : '테스트시작'}
				disabled={userAns.length === 0}
			/>
		</Container>
	);
};

interface StateProps {
	testState: TestState;
	usuallyMode: string;
}

const mapStateToProps = (state: RootState) => ({
	testState: getTestState(state),
	usuallyMode: getSurveyState(state).usuallyMode,
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

export default connect(mapStateToProps, mapDispatchToProps)(Test1);
