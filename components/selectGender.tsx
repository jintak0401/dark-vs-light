import React, { ChangeEvent } from 'react';
import { GenderEnum, getSurveyState, setGender } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const SelectGender = ({ gender, onSetGender }: Props) => {
	const chooseGender = (e: ChangeEvent<HTMLInputElement>) => {
		onSetGender(parseInt(e.target.value));
	};

	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				성별을 알려주세요
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					value={gender || ''}
					onChange={chooseGender}
				>
					<FormControlLabel
						value={GenderEnum.Male}
						control={<Radio />}
						label="남자"
						color="primary"
					/>
					<FormControlLabel
						value={GenderEnum.Female}
						control={<Radio />}
						label="여자"
						color="primary"
					/>
				</RadioGroup>
			</div>
		</div>
	);
};

interface StateProps {
	gender?: GenderEnum;
}

const mapStateToProps = (state: RootState) => ({
	gender: getSurveyState(state).gender,
});

interface DispatchProps {
	onSetGender: (gender: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetGender: (gender: number) => dispatch(setGender(gender)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectGender);
