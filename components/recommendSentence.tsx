import React from 'react';
import { getSurveyState } from '@features/testSlice';
import { connect } from 'react-redux';
import styles from '@styles/result.module.scss';

type Props = OwnProps & StateProps;

const RecommendSentence = ({
	recommendMode,
	usuallyMode,
	getModeTextClassName,
}: Props) => {
	const mode = recommendMode === 'dark' ? '다크모드' : '라이트모드';
	const LastSentence = () => {
		if (recommendMode === usuallyMode) {
			return (
				<p className={styles.result__description}>
					이대로&nbsp;
					<strong className={getModeTextClassName(recommendMode)}>
						{mode}
					</strong>
					&nbsp;를 계속 쓰세요!
				</p>
			);
		} else {
			return (
				<p className={styles.result__description}>
					한 번&nbsp;
					<strong className={getModeTextClassName(recommendMode)}>
						{mode}
					</strong>
					&nbsp;로 바꿔보시는건 어떨까요?
				</p>
			);
		}
	};

	return (
		<div className={styles.resultBox}>
			{recommendMode !== '' && (
				<React.Fragment>
					<h2 className={styles.result__title}>종합적으로 판단해볼 때!</h2>
					<p className={styles.result__description}>
						<strong className={getModeTextClassName(recommendMode)}>
							{mode}
						</strong>
						&nbsp;가 더 잘 맞으실 거에요!
					</p>
					<LastSentence />
				</React.Fragment>
			)}
		</div>
	);
};

interface OwnProps {
	recommendMode: string;
	getModeTextClassName: (mode: string) => string;
}

interface StateProps {
	usuallyMode: string;
}

const mapStateToProps = (state: RootState) => ({
	usuallyMode: getSurveyState(state).usuallyMode,
});

export default connect(mapStateToProps)(RecommendSentence);
