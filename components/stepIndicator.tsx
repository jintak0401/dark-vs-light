import styles from '@styles/Home.module.scss';
import { getTestState, TestState } from '@features/testSlice';
import { connect } from 'react-redux';
import { useRef } from 'react';
import { testLength } from '@lib/testset';

type Props = OwnProps & StateProps;

const StepIndicator = ({ step, isTesting, testState }: Props) => {
	const totalStep = 5;
	const getClassName = (idx: number) => {
		if (step === idx) return styles.stepIndicator__element__active;
		else return styles.stepIndicator__element;
	};
	const { round, turn } = testState;
	const ref = useRef<HTMLDivElement | null>();

	const TestIndicator = (key: number) => {
		let width = undefined;
		if (ref.current) {
			if (turn & 1 && round % testLength === testLength - 1)
				width = ref.current.offsetWidth;
			else {
				width =
					ref.current.offsetWidth *
					(((turn % 2) * testLength +
						(round % testLength) +
						1 +
						(isTesting ? 1 : 0)) /
						(2 * testLength + 1));
			}
		}
		return (
			<div
				key={key}
				className={styles.stepIndicator__element}
				ref={(r) => (ref.current = r)}
			>
				<div
					className={styles.stepIndicator__element__active}
					style={{ width }}
				/>
			</div>
		);
	};

	return (
		<div className={styles.stepIndicator}>
			{Array.from({ length: totalStep }, (_, idx: number) => {
				if (idx === step && (step === 2 || step === 3))
					return TestIndicator(idx);
				return <div className={getClassName(idx)} key={idx} />;
			})}
		</div>
	);
};

interface OwnProps {
	step: number;
	isTesting?: boolean;
}

interface StateProps {
	testState: TestState;
}

const mapStateToProps = (state: RootState) => ({
	testState: getTestState(state),
});

export default connect(mapStateToProps)(StepIndicator);
