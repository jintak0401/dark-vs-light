import React, { ChangeEvent } from 'react';
import {
	getSurveyState,
	setMoreComfortableMode,
	setMoreReadableMode,
	SurveyState,
} from '@features/testSlice';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import styles from '@styles/survey.module.scss';

const modeLabel = (mode: string) => {
	const getClassName = () => {
		if (mode === 'dark') return styles.modeLabel__dark;
		else return styles.modeLabel__light;
	};

	return (
		<span className={getClassName()}>
			{mode === 'dark' ? '다크모드' : '라이트모드'}
		</span>
	);
};

interface ChooseProps {
	choose: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ChooseMode = ({ choose }: ChooseProps) => {
	return (
		<RadioGroup
			row
			aria-labelledby="demo-row-radio-buttons-group-label"
			name="row-radio-buttons-group"
			onChange={choose}
		>
			<FormControlLabel
				value={ThemeEnum.Dark}
				control={<Radio />}
				label={modeLabel('dark')}
				color="primary"
			/>
			<FormControlLabel
				value={ThemeEnum.Light}
				control={<Radio />}
				label={modeLabel('light')}
				color="primary"
			/>
		</RadioGroup>
	);
};

type Props = StateProps & DispatchProps;

const SelectMoreMode = ({
	onSetMoreComfortableMode,
	onSetMoreReadableMode,
}: Props) => {
	// const { moreReadableMode, moreComfortableMode } = surveyState;

	const chooseMoreReadableMode = (e: ChangeEvent<HTMLInputElement>) => {
		onSetMoreReadableMode(parseInt(e.target.value));
	};
	const chooseMoreComfortableMode = (e: ChangeEvent<HTMLInputElement>) => {
		onSetMoreComfortableMode(parseInt(e.target.value));
	};

	return (
		<React.Fragment>
			<div className={styles.surveyElement}>
				<div className={styles.surveyElement__questionText}>
					어떤 모드에서 더 잘 읽혔나요?
				</div>
				<div className={styles.surveyElement__input}>
					<ChooseMode choose={chooseMoreReadableMode} />
				</div>
			</div>
			<div className={styles.surveyElement}>
				<div className={styles.surveyElement__questionText}>
					어떤 모드에서 눈이 덜 피로했나요?
				</div>
				<div className={styles.surveyElement__input}>
					<ChooseMode choose={chooseMoreComfortableMode} />
				</div>
			</div>
		</React.Fragment>
	);
};

interface StateProps {
	surveyState: SurveyState;
}

const mapStateToProps = (state: RootState) => ({
	surveyState: getSurveyState(state),
});

interface DispatchProps {
	onSetMoreComfortableMode: (mode: ThemeEnum.Dark | ThemeEnum.Light) => void;
	onSetMoreReadableMode: (mode: ThemeEnum.Dark | ThemeEnum.Light) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetMoreComfortableMode: (mode: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(setMoreComfortableMode(mode)),
	onSetMoreReadableMode: (mode: ThemeEnum.Dark | ThemeEnum.Light) =>
		dispatch(setMoreReadableMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectMoreMode);
