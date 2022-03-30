import { useRouter } from 'next/router';
import { Container } from '@mui/material';
import { useEffect } from 'react';

const _404 = () => {
	const router = useRouter();
	useEffect(() => {
		router.replace('/redirect');
	}, []);
	return <Container />;
};

export default _404;
