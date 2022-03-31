import db from '@db';
import { NextApiRequest, NextApiResponse } from 'next';
import { AnsResult, SurveyState, TestResult } from '@features/testSlice';

interface FireBaseData {
	a: string; // 나이
	c: Date; // 생성시각
	d: string; // darkAnsResult의 `${ansButNotPick}_${notAnsButPick}`이런 식으로 6개
	t: string; // darkTime의 `${첫시간}_${두번째}_${세번째}`
	g: boolean; // true: 남자, false: 여자
	l: string; // lightAnsResult의 `${ansButNotPick}_${notAnsButPick}`이런 식으로 6개
	k: string; // lightTime의 `${첫시간}_${두번째}_${세번째}`
	f: boolean; // moreComfortableMode --> true: 'dark', false: 'light'
	r: boolean; // moreReadableMode --> true: 'dark', false: 'light'
	u: boolean; // usuallyMode --> true: 'dark', false: 'light'
}

const getAnsResultToTemplate = (ansResult: AnsResult[]) => {
	return ansResult.reduce(
		(
			ret: string,
			cur: { ansButNotPick: number; notAnsButPick: number },
			idx: number
		) => {
			let tmp = ret;
			tmp += `${cur.ansButNotPick}_${cur.notAnsButPick}`;
			idx !== ansResult.length && (tmp += '_');
			return tmp;
		},
		''
	);
};

const getTimeToTemplate = (time: number[]) => {
	return time.reduce((ret: string, cur: number, idx: number) => {
		let tmp = ret;
		tmp += `${cur}`;
		idx !== time.length && (tmp += '_');
		return tmp;
	}, '');
};

const isThereAllData = (data: any) => {
	if (typeof data.age !== 'number') return false;
	if (!data.hasOwnProperty('darkAnsResult')) return false;
	else {
		for (const d of data.darkAnsResult) {
			if (
				typeof d.ansButNotPick !== 'number' ||
				typeof d.notAnsButPick !== 'number'
			)
				return false;
		}
	}
	if (!data.hasOwnProperty('darkTime')) return false;
	else {
		for (const d of data.darkTime) {
			if (typeof d !== 'number') return false;
		}
	}
	if (!data.hasOwnProperty('lightAnsResult')) return false;
	else {
		for (const d of data.lightAnsResult) {
			if (
				typeof d.ansButNotPick !== 'number' ||
				typeof d.notAnsButPick !== 'number'
			)
				return false;
		}
	}
	if (typeof data.gender !== 'number') return false;
	if (!data.hasOwnProperty('lightTime')) return false;
	else {
		for (const d of data.lightTime) {
			if (typeof d !== 'number') return false;
		}
	}
	if (
		!(
			data.moreComfortableMode === 'dark' ||
			data.moreComfortableMode === 'light'
		)
	)
		return false;
	if (!(data.moreReadableMode === 'dark' || data.moreReadableMode === 'light'))
		return false;
	if (!(data.usuallyMode === 'dark' || data.usuallyMode === 'light'))
		return false;
	return true;
};

const getTemplateToAnsResult = (d: string) => {
	const splitResult = d.split('_');
	const ret = [];
	for (let i = 0; i < splitResult.length; i += 2) {
		ret.push({
			ansButNotPick: Number(splitResult[i]),
			notAnsButPick: Number(splitResult[i + 1]),
		});
	}
	return ret;
};

const getTemplateToTime = (t: string) => {
	const splitResult = t.split('_');
	const ret = [];
	for (const _t of splitResult) {
		ret.push(Number(_t));
	}
	return ret;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		if (!isThereAllData(req.body)) {
			res.status(400).end();
		}
		try {
			const a = String(req.body.age);
			const d = getAnsResultToTemplate(req.body.darkAnsResult);
			const t = getTimeToTemplate(req.body.darkTime);
			const g = req.body.gender;
			const l = getAnsResultToTemplate(req.body.lightAnsResult);
			const k = getTimeToTemplate(req.body.lightTime);
			const c = new Date();
			const f = req.body.moreComfortableMode === 'dark';
			const r = req.body.moreReadableMode === 'dark';
			const u = req.body.usuallyMode === 'dark';

			const data: FireBaseData = { a, d, t, g, l, k, c, f, r, u };

			const { id } = await db.collection('result').add(data);
			res.status(200).json({ id });
		} catch (e) {
			res.status(400).end();
		}
	} else if (req.method === 'GET') {
		res.status(400).end();
	}
};
