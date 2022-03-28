import styles from '@styles/Home.module.scss';

interface Props {
	goNext: () => void;
	body?: string | React.ReactNode;
	disabled?: boolean;
}

const GoNextButton = ({ goNext, body = '다음', disabled }: Props) => {
	const getClassName = () => {
		if (disabled) return styles.goNextButton__disabled;
		else return styles.goNextButton;
	};

	return (
		<button className={getClassName()} onClick={goNext} disabled={disabled}>
			{body}
		</button>
	);
};

export default GoNextButton;
