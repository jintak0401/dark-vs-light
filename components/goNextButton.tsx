import styles from '@styles/Home.module.scss';

interface Props {
	goNext: () => void;
	body?: string | React.ReactNode;
	disabled?: boolean;
	width?: string;
}

const GoNextButton = ({ goNext, body = '다음', disabled, width }: Props) => {
	const getClassName = () => {
		if (disabled) return styles.goNextButton__disabled;
		else return styles.goNextButton;
	};

	return (
		<button
			className={getClassName()}
			onClick={goNext}
			disabled={disabled}
			style={{ width }}
		>
			{body}
		</button>
	);
};

export default GoNextButton;
