// import type { VercelRequest, VercelResponse } from '@vercel/node'

// export default function handler(req: VercelRequest, res: VercelResponse) {
//   const { name = 'World' } = req.query
//   return res.json({
//     message: `Hello ${name}!`,
//   })
// }


import { VercelRequest, VercelResponse } from '@vercel/node';
import Handlebars from 'handlebars';
import fetch from 'node-fetch'; // Import fetch for HTTP requests

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'GET') {
		const templateUrl = 'https://jbuwdk1d7uenrxyq.public.blob.vercel-storage.com/html/weekly_plan-FEEHtPKfzA4oQBJXWooInbNQP5JSwp.html';
		const templateResponse = await fetch(templateUrl);
		res.status(200).send(await templateResponse.text());
	} else {
		res.status(405).send('Method Not Allowed');
	}
}