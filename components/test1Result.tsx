import { timeConverter } from '@lib/utils';
import styles from '@styles/result.module.scss';

type Props = OwnProps;

const Test1Result = ({
	darkAverageTime,
	darkCorrectRatio,
	lightAverageTime,
	lightCorrectRatio,
	getModeTextClassName,
}: Props) => {
	const darkModeClassName = getModeTextClassName('dark');
	const lightModeClassName = getModeTextClassName('light');

	return (
		<div className={styles.resultBox}>
			<h2 className={styles.result__title}>첫 번째 테스트 결과</h2>
			<p className={styles.result__description}>
				<strong className={darkModeClassName}>다크모드</strong>
				&nbsp;에서는&nbsp;
				<strong className={darkModeClassName}>
					{timeConverter(darkAverageTime)}
				</strong>
				&nbsp;동안&nbsp;
				<strong className={darkModeClassName}>{darkCorrectRatio}%</strong>
				<br />
			</p>
			<p className={styles.result__description}>
				<strong className={lightModeClassName}>라이트모드</strong>
				&nbsp;에서는&nbsp;
				<strong className={lightModeClassName}>
					{timeConverter(lightAverageTime)}
				</strong>
				&nbsp;동안&nbsp;
				<strong className={lightModeClassName}>{lightCorrectRatio}%</strong>
				<br />
			</p>
			<p className={styles.result__description}>맞히셨어요!</p>
		</div>
	);
};

interface OwnProps {
	darkCorrectRatio: number;
	darkAverageTime: number;
	lightCorrectRatio: number;
	lightAverageTime: number;
	getModeTextClassName: (mode: string) => string;
}

export default Test1Result;
