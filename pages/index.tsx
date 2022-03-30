import styles from '@styles/Home.module.scss';
import Container from '@components/container';
import { AppDispatch } from '@app/store';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { GoNextButton, StepIndicator } from '@components';
import { useRouter } from 'next/router';
import { initAll } from '@features/testSlice';
import Head from 'next/head';

type Props = StateProps & DispatchProps;

const Home = ({ onChangeTheme, onInitAll }: Props) => {
	const router = useRouter();

	const goNext = async () => {
		await router.push('/theme');
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Default);
		onInitAll();
	}, []);

	return (
		<Container>
			<Head>
				<title>한양오픈소스 프로젝트</title>
				<meta name="description" content="나한테 맞는 모드는?" />
				<meta property="og:title" content="다크모드 vs 라이트모드" />
				<meta property="og:description" content="나한테 맞는 모드는?" />
				<meta
					property="og:image"
					content="https://dark-vs-light.vercel.app/meta.png"
				/>
				<meta property="og:site_name" content="다크모드 vs 라이트모드" />
				<meta
					name="twitter:description"
					content="나한테 어떤 모드가 맞는지 테스트하세요!"
				/>
				<meta name="twitter:title" content="다크모드 vs 라이트모드" />
				<meta property="og:locale" content="ko_KR" />
				<link rel="icon" href="/modeIcon.ico" />
			</Head>
			<StepIndicator step={0} />
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
	onInitAll: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (themeEnum: ThemeEnum) => dispatch(changeTheme(themeEnum)),
	onInitAll: () => dispatch(initAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
