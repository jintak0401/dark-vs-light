import styles from '@styles/Home.module.scss';

interface Props {
	step: number;
}

const StepIndicator = ({ step }: Props) => {
	const totalStep = 5;
	const getClassName = (idx: number) => {
		if (step === idx) return styles.stepIndicator__element__active;
		else return styles.stepIndicator__element;
	};

	return (
		<div className={styles.stepIndicator}>
			{Array.from({ length: totalStep }, (_, idx: number) => {
				return <div className={getClassName(idx)} key={idx} />;
			})}
		</div>
	);
};

export default StepIndicator;
