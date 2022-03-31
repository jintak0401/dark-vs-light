import db from '@db';
import { NextApiRequest, NextApiResponse } from 'next';
import { AnsResult, GenderEnum, SurveyState, TestResult } from '@features/testSlice';
import { types } from 'sass';
import Number = types.Number;

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
	v: boolean; // device --> true: 폰, false: 컴퓨터
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
			idx !== ansResult.length-1 && (tmp += '_');
			return tmp;
		},
		''
	);
};

const getTimeToTemplate = (time: number[]) => {
	return time.reduce((ret: string, cur: number, idx: number) => {
		let tmp = ret;
		tmp += `${cur}`;
		idx !== time.length-1 && (tmp += '_');
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
	if (!(data.device === 'phone' || data.dev === 'computer')) return false;
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

const convertData2Collections = (data: TestResult & SurveyState):FireBaseData => {
	const a = String(data.age);
	const d = getAnsResultToTemplate(data.darkAnsResult);
	const t = getTimeToTemplate(data.darkTime);
	const g = data.gender === GenderEnum.Male;
	const l = getAnsResultToTemplate(data.lightAnsResult);
	const k = getTimeToTemplate(data.lightTime);
	const c = new Date();
	const f = data.moreComfortableMode === 'dark';
	const r = data.moreReadableMode === 'dark';
	const u = data.usuallyMode === 'dark';
	const v = data.device === 'phone';

	return { a, d, t, g, l, k, c, f, r, u, v };
}

const convertCollections2Data = (data: FireBaseData): any => {
	const age= Number(data.a)
	const darkAnsResult = getTemplateToAnsResult(data.d);
	const darkTime = getTemplateToTime(data.t);
	const gender = data.g ? 'male' : 'female';
	const lightAnsResult = getTemplateToAnsResult(data.l);
	const lightTime = getTemplateToTime(data.k);
	const moreComfortableMode = data.f ? 'dark' : 'light';
	const moreReadableMode = data.r ? 'dark' : 'light';
	const usuallyMode = data.u ? 'dark' : 'light';
	const device = data.v ? 'phone' : 'computer';

	return {age, darkAnsResult, darkTime, gender, lightAnsResult, lightTime,
	moreComfortableMode, moreReadableMode, usuallyMode, device};
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		if (!isThereAllData(req.body)) {
			res.status(400).end();
		}
		try {
			const data = convertData2Collections(req.body);
			const { id } = await db.collection('result').add(data);
			res.status(200).json({ id });
		} catch (e) {
			res.status(400).end();
		}
	} else if (req.method === 'GET') {
		res.status(400).end();
	}
};
