import { VercelRequest, VercelResponse } from '@vercel/node';
import Handlebars from 'handlebars';
import fetch from 'node-fetch'; // Import fetch for HTTP requests

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'GET') {
		if (process.env.TEMPLATE_URL != null) {
			const templateResponse = await fetch(process.env.TEMPLATE_URL);
			res.status(200).send(await templateResponse.text());
		} else {
			res.status(400).json({ error: 'Config is wrong' });
		}
	} else {
		res.status(405).send('Method Not Allowed');
	}
}