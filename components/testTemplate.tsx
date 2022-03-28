import styles from 'styles/test.module.scss';
import {
	FontTypeEnum,
	getFontType,
	getReady,
	getTestNum,
	getUserAns,
	resetUserAns,
	setReady,
	setStart,
	setTestAns,
	setUserAns,
} from '@features/testStateSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { WordCell } from '@components/index';
import React, { useEffect } from 'react';

type Props = OwnProps & StateProps & DispatchProps;

const TestTemplate = ({
	ready,
	userAns,
	ansSet,
	onResetUserAns,
	testNum,
	onSetUserAns,
	onSetTestAns,
	onSetReady,
	onSetStart,
	questionSet,
	fontType,
}: Props) => {
	useEffect(() => {
		onResetUserAns();
		onSetTestAns(ansSet);
	}, [testNum]);

	const goStart = () => {
		onSetReady(false);
		onSetStart();
		console.log(ready);
	};

	return (
		<React.Fragment>
			{ready && (
				<button className={styles.startButton} onClick={goStart}>
					시작
				</button>
			)}
			<div className={ready ? styles.wordGroup__ready : styles.wordGroup}>
				{questionSet.map((word: string, idx: number) => {
					return (
						<WordCell
							key={idx}
							word={word}
							onSelect={() => onSetUserAns(idx)}
							isSelected={userAns.includes(idx)}
							fontType={fontType}
							disabled={ready}
						/>
					);
				})}
			</div>
		</React.Fragment>
	);
};

interface OwnProps {
	questionSet: string[];
	ansSet: number[];
}

interface StateProps {
	userAns: number[];
	fontType: FontTypeEnum;
	testNum: number;
	ready: boolean;
}

const mapStateToProps = (state: RootState) => ({
	userAns: getUserAns(state),
	fontType: getFontType(state),
	testNum: getTestNum(state),
	ready: getReady(state),
});

interface DispatchProps {
	onSetUserAns: (ans: number) => void;
	onResetUserAns: () => void;
	onSetTestAns: (ans: number[]) => void;
	onSetReady: (ready: boolean) => void;
	onSetStart: () => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetUserAns: (ans: number) => dispatch(setUserAns(ans)),
	onResetUserAns: () => dispatch(resetUserAns()),
	onSetTestAns: (ans: number[]) => dispatch(setTestAns(ans)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onSetStart: () => dispatch(setStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestTemplate);
