import styles from '@styles/result.module.scss';
type Props = OwnProps;

const Test2Result = ({
	darkCorrectRatio,
	lightCorrectRatio,
	getModeTextClassName,
}: Props) => {
	return (
		<div className={styles.resultBox}>
			<h2 className={styles.result__title}>두 번째 테스트 결과</h2>
			<p className={styles.result__description}>
				<strong className={getModeTextClassName('dark')}>다크모드</strong>
				&nbsp;에서는&nbsp;
				<strong className={getModeTextClassName('dark')}>
					{darkCorrectRatio}%
				</strong>
				<br />
			</p>
			<p className={styles.result__description}>
				<strong className={getModeTextClassName('light')}>라이트모드</strong>
				&nbsp;에서는&nbsp;
				<strong className={getModeTextClassName('light')}>
					{lightCorrectRatio}%
				</strong>
				<br />
			</p>
			<p className={styles.result__description}>맞히셨어요!</p>
		</div>
	);
};

interface OwnProps {
	getModeTextClassName: (mode: string) => string;
	darkCorrectRatio: number;
	lightCorrectRatio: number;
}

export default Test2Result;
