import {
	getIsTest2Done,
	getSurveyState,
	setAge,
	setGender,
	SurveyState,
} from '@features/testSlice';
import { changeTheme, getTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { Container, GoNextButton } from '@components';
import { ChangeEvent, useEffect } from 'react';
import {
	FormControlLabel,
	PaletteMode,
	Radio,
	RadioGroup,
	ThemeProvider,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const Survey = ({
	isTest2Done,
	onChangeTheme,
	onSetAge,
	onSetGender,
	surveyState,
	mode,
}: Props) => {
	const { age, gender } = surveyState;
	const insertAge = (e: ChangeEvent<HTMLInputElement>) => {
		onSetAge(parseInt(e.target.value));
	};

	const isDisabled = () => {
		if (!age) return true;
		if (gender === undefined) return true;
	};

	useEffect(() => {
		// if (isTest2Done) {
		//
		// }
		onChangeTheme(ThemeEnum.Usually);
		onSetAge();
	}, []);

	const theme = createTheme({
		palette: {
			primary: blue,
			mode: mode,
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<Container>
				<h1>간단한 질문 몇 가지만 할게요!</h1>
				<div className={styles.surveyContainer}>
					<div>성별을 알려주세요</div>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="row-radio-buttons-group"
						value={gender === 0 ? 'male' : gender === 1 ? 'female' : undefined}
						onChange={(e) => onSetGender(parseInt(e.target.value))}
					>
						<FormControlLabel
							value="female"
							control={<Radio />}
							label="남자"
							color="primary"
						/>
						<FormControlLabel value="male" control={<Radio />} label="여자" />
					</RadioGroup>
					<input type={'number'} value={age} onChange={insertAge} />
					<GoNextButton
						goNext={() => console.log('다음')}
						body={'결과 보여주세요!'}
						disabled={isDisabled()}
					/>
				</div>
			</Container>
		</ThemeProvider>
	);
};

interface StateProps {
	isTest2Done: boolean;
	surveyState: SurveyState;
	mode: PaletteMode;
}

const mapStateToProps = (state: RootState) => ({
	isTest2Done: getIsTest2Done(state),
	surveyState: getSurveyState(state),
	mode: getTheme(state) === ThemeEnum.Dark ? 'dark' : 'light',
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetAge: (age?: number) => void;
	onSetGender: (gender: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetAge: (age?: number) => dispatch(setAge(age)),
	onSetGender: (gender: number) => dispatch(setGender(gender)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
