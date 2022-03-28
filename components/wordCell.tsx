import styles from 'styles/test.module.scss';
import { FontTypeEnum } from '@features/testSlice';

type Props = OwnProps;

const WordCell = ({
	word,
	onSelect,
	isSelected,
	fontType,
	disabled = false,
}: Props) => {
	const getClassName = () => {
		if (isSelected) {
			if (fontType == FontTypeEnum.Light)
				return styles.wordCell__light__isSelected;
			else if (fontType == FontTypeEnum.Bold)
				return styles.wordCell__bold__isSelected;
			else return styles.wordCell__regular__isSelected;
		} else {
			if (fontType == FontTypeEnum.Light) return styles.wordCell__light;
			else if (fontType == FontTypeEnum.Bold) return styles.wordCell__bold;
			else return styles.wordCell__regular;
		}
	};

	return (
		<div
			className={getClassName()}
			onClick={!disabled ? onSelect : undefined}
			style={{ cursor: disabled ? 'default' : 'pointer' }}
		>
			{word}
		</div>
	);
};

interface OwnProps {
	word: string;
	onSelect: () => void;
	isSelected: boolean;
	fontType: FontTypeEnum;
	disabled?: boolean;
}

export default WordCell;
