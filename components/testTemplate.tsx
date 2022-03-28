import styles from 'styles/test.module.scss';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { WordCell } from '@components/index';
import React, { useEffect, useState } from 'react';
import {
	getTestState,
	setReady,
	setStart,
	setTestAns,
	resetUserAns,
	setUserAns,
	TestState,
	setTimerTime,
} from '@features/testSlice';

type Props = OwnProps & StateProps & DispatchProps;

const TestTemplate = ({
	ansSet,
	needTimer,
	testState,
	onResetUserAns,
	onSetUserAns,
	onSetTestAns,
	onSetReady,
	onSetStart,
	questionSet,
	onSetTimerTime,
}: Props) => {
	const { round, turn, ready, userAns, fontType, timer } = testState;
	const [isTimerWorking, setIsTimerWorking] = useState<boolean>(false);

	useEffect(() => {
		onResetUserAns();
	}, [round, turn]);

	const goStart = () => {
		onSetTestAns(ansSet);
		onSetReady(false);
		onSetStart();
		if (needTimer) {
			setIsTimerWorking(true);
		}
	};

	useEffect(() => {
		if (timer === 0) {
			setIsTimerWorking(false);
		}
	}, [timer]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (isTimerWorking) {
				onSetTimerTime();
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [isTimerWorking]);

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
	needTimer?: boolean;
}

interface StateProps {
	testState: TestState;
}

const mapStateToProps = (state: RootState) => ({
	testState: getTestState(state),
});

interface DispatchProps {
	onSetUserAns: (ans: number) => void;
	onResetUserAns: () => void;
	onSetTestAns: (ans: number[]) => void;
	onSetReady: (ready: boolean) => void;
	onSetStart: () => void;
	onSetTimerTime: (time?: number) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onSetUserAns: (ans: number) => dispatch(setUserAns(ans)),
	onResetUserAns: () => dispatch(resetUserAns()),
	onSetTestAns: (ans: number[]) => dispatch(setTestAns(ans)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onSetStart: () => dispatch(setStart()),
	onSetTimerTime: (time?: number) => dispatch(setTimerTime(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestTemplate);
