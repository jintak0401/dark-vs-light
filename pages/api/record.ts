import db from '@db';
import { NextApiRequest, NextApiResponse } from 'next';
import {
	AnsResult,
	GenderEnum,
	SurveyState,
	TestResult,
} from '@features/testSlice';

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
	v: string; // device --> p: 폰, c: 컴퓨터, t: 태블릿
	h: string; // howOften
	z: string; // fontSize
}

interface ResultData {
	age: number;
	darkAnsResult: AnsResult[];
	darkTime: number[];
	gender: string;
	lightAnsResult: AnsResult[];
	lightTime: number[];
	moreComfortableMode: string;
	moreReadableMode: string;
	usuallyMode: string;
	device: string;
	howOften: number;
	fontSize: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		if (!isThereAllData(req.body)) {
			return res.status(400).end();
		}
		try {
			const data = convertData2Collections(req.body);
			const { id } = await db.collection('result').add(data);
			res.status(200).json({ id });
		} catch (e) {
			return res.status(400).end();
		}
	} else if (req.method === 'GET') {
		try {
			const results = (await db.collection('result').get()).docs.map(
				(result) => {
					const data = result.data();
					return convertCollections2Data(data as FireBaseData);
				}
			);
			res.status(200).send(results);
		} catch (e) {
			res.status(400).end();
		}
	}
};
function getAnsResultToTemplate(ansResult: AnsResult[]) {
	return ansResult.reduce(
		(
			ret: string,
			cur: { ansButNotPick: number; notAnsButPick: number },
			idx: number
		) => {
			let tmp = ret;
			tmp += `${cur.ansButNotPick}_${cur.notAnsButPick}`;
			idx !== ansResult.length - 1 && (tmp += '_');
			return tmp;
		},
		''
	);
}

function getTimeToTemplate(time: number[]) {
	return time.reduce((ret: string, cur: number, idx: number) => {
		let tmp = ret;
		tmp += `${cur}`;
		idx !== time.length - 1 && (tmp += '_');
		return tmp;
	}, '');
}

function isThereAllData(data: any) {
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
	if (
		!(
			data.device === 'phone' ||
			data.device === 'computer' ||
			data.device === 'tablet'
		)
	)
		return false;

	if (typeof data.howOften !== 'number') return false;
	if (typeof data.fontSize !== 'number') return false;
	return true;
}

function getTemplateToAnsResult(d: string) {
	const splitResult = d.split('_');
	const ret = [];
	for (let i = 0; i < splitResult.length; i += 2) {
		ret.push({
			ansButNotPick: parseInt(splitResult[i]),
			notAnsButPick: parseInt(splitResult[i + 1]),
		});
	}
	return ret;
}

const getTemplateToTime = (t: string) => {
	const splitResult = t.split('_');
	const ret = [];
	for (const _t of splitResult) {
		ret.push(parseInt(_t));
	}
	return ret;
};

function convertData2Collections(data: TestResult & SurveyState): FireBaseData {
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
	const v =
		data.device === 'phone' ? 'p' : data.device === 'computer' ? 'c' : 't';
	const h = String(data.howOften);
	const z = String(data.fontSize);

	return { a, d, t, g, l, k, c, f, r, u, v, h, z };
}

function convertCollections2Data(data: FireBaseData): ResultData {
	const age = parseInt(data.a);
	const darkAnsResult = getTemplateToAnsResult(data.d);
	const darkTime = getTemplateToTime(data.t);
	const gender = data.g ? 'male' : 'female';
	const lightAnsResult = getTemplateToAnsResult(data.l);
	const lightTime = getTemplateToTime(data.k);
	const moreComfortableMode = data.f ? 'dark' : 'light';
	const moreReadableMode = data.r ? 'dark' : 'light';
	const usuallyMode = data.u ? 'dark' : 'light';
	const device =
		data.v === 'p' ? 'phone' : data.v === 'c' ? 'computer' : 'tablet';
	const howOften = parseInt(data.h);
	const fontSize = parseInt(data.z);

	return {
		age,
		darkAnsResult,
		darkTime,
		gender,
		lightAnsResult,
		lightTime,
		moreComfortableMode,
		moreReadableMode,
		usuallyMode,
		device,
		howOften,
		fontSize,
	};
}
