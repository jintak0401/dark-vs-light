import {
	Container,
	GoNextButton,
	StepIndicator,
	TestTemplate,
} from '@components';
import { changeTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
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

type Props = StateProps & DispatchProps;

const Test1 = ({
	usuallyMode,
	onChangeTheme,
	testState,
	onSetReady,
	onInitTest,
}: Props) => {
	const router = useRouter();
	const questionSet = ['비보', '바보', '바뵤', '뱌보', '뱌뵤', '바보'];
	const ansSet = [1, 5];
	const { userAns } = testState;

	const getWarningClassName = () => {
		if (userAns.length === 0) return styles.warningText__inactive;
		else return styles.warningText__active;
	};

	const goNext = async () => {
		await router.push('/test1/run');
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

	return (
		<Container>
			<StepIndicator step={2} />
			<h2 className={styles.description}>
				제시한 단어와 정확하게 일치하는 단어들을 모두 골라주세요!
			</h2>
			<p className={styles.questionText}>
				예시 문제에요.&nbsp;
				<strong className={styles.questionText__strong}>바보</strong>
				를 모두 골라주세요.
				<br />
				(총 몇개인지는 아무도 몰라요!)
			</p>
			<TestTemplate ansSet={ansSet} questionSet={questionSet} />
			<div className={getWarningClassName()}>
				모두 고르셨으면 버튼을 눌러주세요
			</div>
			<GoNextButton
				goNext={goNext}
				body={'시작할게요'}
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
