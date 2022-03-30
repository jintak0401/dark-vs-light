import db from '@db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { id } = await db.collection('result').add({
			...req.body,
			created: JSON.stringify(new Date()),
		});
		res.status(200).json({ id });
	} catch (e) {
		res.status(400).end();
	}
};
