import { Container, GoNextButton, TestTemplate } from '@components';
import { changeTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '@app/store';
import { defaultTimerTime, initTest, TestTypeEnum } from '@features/testSlice';
import styles from '@styles/test.module.scss';
import { useRouter } from 'next/router';

type Props = DispatchProps;

const Test2 = ({ onChangeTheme, onInitTest }: Props) => {
	const router = useRouter();

	const goNext = async () => {
		await router.push('/test2/run');
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Usually);
		onInitTest(TestTypeEnum.Timer);
	}, []);

	return (
		<Container>
			<h2 className={styles.description}>
				이번에는{' '}
				<strong className={styles.questionText__strong}>
					{defaultTimerTime}초
				</strong>{' '}
				안에 일치하는 단어들을 모두 골라주세요!
			</h2>
			<h1>😉</h1>
			<p>이번 테스트가 마지막이에요! 힘내주세요</p>
			<GoNextButton goNext={goNext} body={'시작할게요!'} />
		</Container>
	);
};

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onInitTest: (testType?: TestTypeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onInitTest: (testType?: TestTypeEnum) => dispatch(initTest(testType)),
});

export default connect(null, mapDispatchToProps)(Test2);
