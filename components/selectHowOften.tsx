import React, { ChangeEvent } from 'react';
import { setHowOften } from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import styles from '@styles/survey.module.scss';

type Props = DispatchProps;

const SelectHowOften = ({ onSetHowOften }: Props) => {
	const phrases = [
		'1시간 미만',
		'1시간 이상 2시간 미만',
		'2시간 이상 3시간 미만',
		'3시간 이상 4시간 미만',
		'4시간 이상',
	];

	const chooseHowOften = (e: ChangeEvent<HTMLInputElement>) => {
		onSetHowOften(parseInt(e.target.value));
	};

	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				평균적으로 하루에 얼마나 스마트폰, 태블릿, 모니터를 보시나요?
			</div>
			<div className={styles.surveyElement__input}>
				<RadioGroup
					aria-labelledby="demo-controlled-radio-buttons-group-label"
					name="controlled-radio-buttons-group"
					onChange={chooseHowOften}
				>
					{phrases.map((e: string, idx: number) => {
						return (
							<FormControlLabel
								key={idx}
								value={idx}
								control={<Radio />}
								label={e}
								color="primary"
							/>
						);
					})}
				</RadioGroup>
			</div>
		</div>
	);
};

interface DispatchProps {
	onSetHowOften: (howOften: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetHowOften: (howOften: number) => dispatch(setHowOften(howOften)),
});

export default connect(null, mapDispatchToProps)(SelectHowOften);
