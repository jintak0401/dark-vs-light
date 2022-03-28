import { Container, GoNextButton, TestTemplate } from '@components';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import {
	getRecordResultDataExceptMode,
	getTestNum,
	getUserAns,
	goNextTestNum, initTest,
	setEnd,
	setReady,
	setStart
} from '@features/testStateSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import {
	recordResult,
	RecordResultData,
	RecordResultExceptMode,
} from '@features/testResultSlice';
import { useEffect, useRef, useState } from 'react';
import { shuffle } from '@lib/shuffle';
import { ansStringSet, getTestSet } from '@lib/testset';
import styles from '@styles/test.module.scss';

type Props = StateProps & DispatchProps;

const Test1Run = ({
	testNum,
	userAns,
	recordResultDataExceptMode,
	onChangeTheme,
	onGoNextTestNum,
	onSetEnd,
	onSetStart,
	onRecordResult,
	onSetReady,
	onInitTest,
	theme,
}: Props) => {
	const router = useRouter();
	const [quests, setQuests] = useState<string[]>([]);
	const [answers, setAnswers] = useState<number[]>([]);
	const ref = useRef();
	const goNext = async () => {
		onSetEnd();
		onRecordResult({ ...recordResultDataExceptMode, mode: theme });
		onSetReady(true);
		onChangeTheme(ThemeEnum.Toggle);

		if (testNum < 5) {
			onGoNextTestNum();
		} else {
			await router.push('/test2');
		}
	};

	const goStart = () => {
		onSetStart();
	};

	useEffect(() => {
		onSetReady(true);
		const [qSet, aSet] = shuffle(getTestSet(1, Math.floor(testNum / 2)));
		setQuests(qSet);
		setAnswers(aSet);
	}, [testNum]);

	useEffect(() => {
		onChangeTheme(ThemeEnum.Current);
	}, []);

	return (
		<Container>
			<p className={styles.questionText}>
				<strong className={styles.questionText__strong}>
					{ansStringSet[Math.floor(testNum / 2)]}
				</strong>
				을 모두 골라주세요
			</p>
			<TestTemplate ansSet={answers} questionSet={quests} />
			<GoNextButton goNext={goNext} disabled={userAns.length === 0}/>
		</Container>
	);
};

interface StateProps {
	testNum: number;
	userAns: number[];
	recordResultDataExceptMode: RecordResultExceptMode;
	theme: ThemeEnum.Light | ThemeEnum.Dark;
}

const mapStateToProps = (state: RootState) => ({
	testNum: getTestNum(state),
	userAns: getUserAns(state),
	recordResultDataExceptMode: getRecordResultDataExceptMode(state),
	theme: getTheme(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onGoNextTestNum: () => void;
	onSetStart: () => void;
	onSetEnd: () => void;
	onRecordResult: (data: RecordResultData) => void;
	onSetReady: (ready: boolean) => void;
	onInitTest: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onGoNextTestNum: () => dispatch(goNextTestNum()),
	onSetStart: () => dispatch(setStart()),
	onSetEnd: () => dispatch(setEnd()),
	onRecordResult: (data: RecordResultData) => dispatch(recordResult(data)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onInitTest: () => dispatch(initTest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test1Run);
