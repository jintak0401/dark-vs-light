import { Container } from '@components';
import {
	getTestState,
	initTest,
	setReady,
	TestState,
	TestTypeEnum,
} from '@features/testSlice';
import { changeTheme, ThemeEnum } from '@features/themeSlice';
import { AppDispatch } from '@app/store';
import { connect } from 'react-redux';
import { useEffect } from 'react';

type Props = DispatchProps;

const Result = ({ onChangeTheme }: Props) => {
	useEffect(() => {
		onChangeTheme(ThemeEnum.Usually);
	}, []);

	return (
		<Container>
			<div>결과</div>
		</Container>
	);
};

interface StateProps {
	testState: TestState;
}

const mapStateToProps = (state: RootState) => ({
	testState: getTestState(state),
});

interface DispatchProps {
	onChangeTheme: (theme: ThemeEnum) => void;
	onSetReady: (ready: boolean) => void;
	onInitTest: (testType?: TestTypeEnum) => void;
}

const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => ({
	onChangeTheme: (theme: ThemeEnum) => dispatch(changeTheme(theme)),
	onSetReady: (ready: boolean) => dispatch(setReady(ready)),
	onInitTest: (testType?: TestTypeEnum) => dispatch(initTest(testType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Result);
