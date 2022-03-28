import { Container, GoNextButton, TestTemplate } from '@components';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '@app/store';
import { getUserAns, setReady } from '@features/testStateSlice';
import { isSameList } from '@lib/utils';
import styles from '@styles/test.module.scss';
import { useRouter } from 'next/router';

type Props = StateProps & DispatchProps;

const Test1 = ({ theme, onChangeTheme, userAns, onSetReady }: Props) => {
	const router = useRouter();
	const questionSet = ['비보', '바보', '바뵤', '뱌보', '뱌뵤', '바보'];
	const ansSet = [1, 5];

	const getWarningClassName = () => {
		if (userAns.length === 0 || isSameList(ansSet, userAns))
			return styles.warningText__inactive;
		else return styles.warningText__active;
	};

	const goNext = async () => {
		console.log(userAns);
		await router.push('/test1/run');
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Current);
		onSetReady(false);
	}, []);

	return (
		<Container>
			{/*<h2 className={styles.description}>*/}
			{/*	다크모드와 라이트모드를 번갈아가면서 테스트를 진행할거에요*/}
			{/*</h2>*/}
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
				정답여부는 테스트 중간에 알려드리지 않아요!
			</div>
			<GoNextButton
				goNext={goNext}
				body={'시작할게요!'}
				disabled={!isSameList(ansSet, userAns)}
			/>
		</Container>
	);
};

interface StateProps {
	theme: ThemeEnum;
	userAns: number[];
}

const mapStateToProps = (state: RootState) => ({
	theme: getTheme(state),
	userAns: getUserAns(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test1);
