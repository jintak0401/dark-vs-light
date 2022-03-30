import { Container, GoNextButton } from '@components';
import { useRouter } from 'next/router';

const Redirect = () => {
	const router = useRouter();
	const goNext = async () => {
		await router.replace('/');
	};
	return (
		<Container>
			<h1 style={{ fontSize: '50px', marginBottom: '0' }}>😣</h1>
			<h1>정상적인 경로로 접근하지 않으셨군요...</h1>
			<GoNextButton goNext={goNext} body={'처음으로 갈게요'} />
		</Container>
	);
};

export default Redirect;
