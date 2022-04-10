import {
	defaultFontSize,
	getSurveyState,
	setFontSize,
} from '@features/testSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { Slider } from '@mui/material';
import React from 'react';
import styles from '@styles/survey.module.scss';

type Props = StateProps & DispatchProps;

const SelectFontSize = ({ fontSize, onSetFontSize }: Props) => {
	return (
		<div className={styles.surveyElement}>
			<div className={styles.surveyElement__questionText}>
				어느 정도 크기부터 읽는데 불편함이 없나요?
			</div>
			<p
				style={{
					fontSize: `${fontSize}px`,
					textAlign: 'center',
					marginBottom: -5,
				}}
			>
				글씨 크기
			</p>
			<div className={styles.surveyElement__input}>
				<Slider
					aria-label="ReadableFontSize"
					defaultValue={defaultFontSize}
					step={1}
					marks={true}
					min={10}
					max={40}
					onChange={(e: Event, v: number | number[]) =>
						onSetFontSize(v as number)
					}
					valueLabelDisplay="auto"
				/>
			</div>
		</div>
	);
};

interface StateProps {
	fontSize: number;
}

const mapStateToProps = (state: RootState) => ({
	fontSize: getSurveyState(state).fontSize,
});

interface DispatchProps {
	onSetFontSize: (fontSize: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetFontSize: (fontSize) => dispatch(setFontSize(fontSize)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectFontSize);
