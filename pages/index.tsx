import styles from '@styles/Home.module.scss';
import Container from '@components/container';
import { AppDispatch } from '@app/store';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { GoNextButton } from '@components';
import { useRouter } from 'next/router';

type Props = StateProps & DispatchProps;

const Home = ({ onChangeTheme }: Props) => {
	const router = useRouter();

	const goNext = async () => {
		await router.push('/theme');
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Default);
	}, []);

	return (
		<Container>
			<h1 className={styles.emoji}>🧐</h1>
			<h1 className={styles.title}>
				<strong className={styles.darkMode}>다크모드</strong> VS{' '}
				<strong className={styles.lightMode}>라이트모드</strong>
			</h1>
			<h3 className={styles.description}>
				2번의 테스트로 나한테 맞는 모드를 확인하세요!
			</h3>
			<GoNextButton goNext={goNext} body={'시작'} />
		</Container>
	);
};

interface StateProps {
	theme: ThemeEnum;
}

const mapStateToProps = (state: RootState): StateProps => ({
	theme: getTheme(state),
});

interface DispatchProps {
	onChangeTheme: (themeEnum: ThemeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (themeEnum: ThemeEnum) => dispatch(changeTheme(themeEnum)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
