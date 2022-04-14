import styles from '@styles/Home.module.scss';
import Container from '@components/container';
import { AppDispatch } from '@app/store';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { connect } from 'react-redux';
import React, { Fragment, useEffect } from 'react';
import { GoNextButton, MetaTags, StepIndicator } from '@components';
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
		<Fragment>
			<Head>
				<title>다크모드 VS 라이트모드</title>
				{/*SEO*/}
				<meta
					name="google-site-verification"
					content="zh9uV2DUEcsHPc-LFa6yYTfbvpC1mSv_vALvXZW0bk8"
				/>

				<meta
					name="description"
					content="다크모드와 라이트 모드 중, 나한테 맞는 모드는?"
				/>
				<link rel="canonical" href="https://dark-vs-light.vercel.app/" />
				<link rel="icon" href="/favicon2.ico" />
				<meta name="robots" content="index, follow" />
				<meta
					name="keywords"
					content="다크모드, 라이드모드, 야간모드, 주간모드, dark mode, light mode, dark, light"
				/>
				<meta name="author" content="jintak0401" />
				<meta name="content-language" content="kr" />

				{/*og 메타태그*/}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://dark-vs-light.vercel.app" />
				<meta property="og:title" content="다크모드 VS 라이트모드" />
				<meta
					property="og:image"
					content="https://dark-vs-light.vercel.app/thumbnail.png"
				/>
				<meta
					property="og:description"
					content="어떤 모드가 나한테 맞는지 테스트하세요!"
				/>
				<meta property="og:site_name" content="다크모드 VS 라이트모드" />
				<meta property="og:locale" content="ko_KR" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />

				{/*트위터 메타태그*/}
				<meta name="twitter:card" content="summary" />
				<meta
					property="twitter:url"
					content="https://dark-vs-light.vercel.app"
				/>
				<meta name="twitter:title" content="다크모드 VS 라이트모드" />
				<meta
					name="twitter:description"
					content="다크모드와 라이트 모드 중, 어떤 모드가 맞는지 테스트하세요!"
				/>
				<meta
					name="twitter:image"
					content="https://dark-vs-light.vercel.app/thumbnail.png"
				/>
			</Head>
			<Container>
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
		</Fragment>
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
