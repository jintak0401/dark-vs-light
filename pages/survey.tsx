import {
	getFinishedTest,
	getSurveyState,
	initSurvey,
	SurveyState,
} from '@features/testSlice';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import {
	Container,
	SelectGender,
	GoNextButton,
	InputAge,
	SelectMoreMode,
	StepIndicator,
	SelectDevice,
	SelectFontSize,
	SelectHowOften,
} from '@components';
import React, { Fragment, useEffect } from 'react';
import { PaletteMode, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import styles from '@styles/survey.module.scss';
import { useRouter } from 'next/router';
import { handleRefreshAndGoBack } from '@lib/unloadCallback';
import Head from 'next/head';

type Props = StateProps & DispatchProps;

const Survey = ({
	onChangeTheme,
	surveyState,
	onInitSurvey,
	mode,
	finishedTest,
}: Props) => {
	const router = useRouter();
	const {
		device,
		age,
		gender,
		moreComfortableMode,
		moreReadableMode,
		fontSize,
		howOften,
	} = surveyState;
	const isDisabled = () => {
		if (!device) return true;
		if (!age) return true;
		if (!gender) return true;
		if (!moreComfortableMode) return true;
		if (!moreReadableMode) return true;
		if (!fontSize) return true;
		if (!howOften) return true;
		return false;
	};

	const goNext = async () => {
		await router.replace('/result');
	};

	useEffect(() => {
		onChangeTheme(ThemeEnum.Usually);
		if (finishedTest === 2) {
			onInitSurvey();
		} else {
			router.replace('/redirect');
		}
	}, []);

	useEffect(() => handleRefreshAndGoBack(router));

	const theme = createTheme({
		palette: {
			primary: blue,
			mode,
			...(mode === 'dark'
				? {
						text: {
							secondary: '#FFFFFF',
						},
				  }
				: {}),
		},
	});

	return (
		<Fragment>
			<Head>
				<title>다크모드 vs 라이트모드 | 설문</title>
			</Head>
			<ThemeProvider theme={theme}>
				<Container>
					<StepIndicator step={4} />
					<h1 className={styles.emoji}>🥳</h1>
					<h1 className={styles.title}>마지막 단계에요!</h1>
					<p className={styles.description}>
						정확한 결과를 위해
						<br />
						아래 질문에 답해주세요
					</p>
					<div className={styles.surveyContainer}>
						<SelectDevice />
						<SelectGender />
						<InputAge />
						<SelectFontSize />
						<SelectHowOften />
						<SelectMoreMode />
						<GoNextButton
							goNext={goNext}
							body={'결과 보여주세요!'}
							disabled={isDisabled()}
							width={'100%'}
						/>
					</div>
				</Container>
			</ThemeProvider>
		</Fragment>
	);
};

interface StateProps {
	surveyState: SurveyState;
	mode: PaletteMode;
	finishedTest: number;
}

const mapStateToProps = (state: RootState) => ({
	surveyState: getSurveyState(state),
	mode: (getTheme(state) === ThemeEnum.Dark ? 'dark' : 'light') as PaletteMode,
	finishedTest: getFinishedTest(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onInitSurvey: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onInitSurvey: () => dispatch(initSurvey()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
