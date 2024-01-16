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
	if (req.method === 'POST') {
		try {
			const parsedBody = JSON.parse(req.body);

			// Fetch template from Vercel Blob storage
			const templateUrl = 'https://jbuwdk1d7uenrxyq.public.blob.vercel-storage.com/html/template-8HW0p7Tmf8iriqnEeuUMZ3RGD0vteL.html';
			const templateResponse = await fetch(templateUrl);
			const templateText = await templateResponse.text();

			const template = Handlebars.compile(templateText);
			const renderedHtml = template(parsedBody);

			res.status(200).send(renderedHtml);
		} catch (error) {
			console.error(error);
			res.status(500).send('Error processing request');
		}
	} else if (req.method === 'GET') {
		const templateUrl = 'https://jbuwdk1d7uenrxyq.public.blob.vercel-storage.com/html/template-8HW0p7Tmf8iriqnEeuUMZ3RGD0vteL.html';
		const templateResponse = await fetch(templateUrl);
		res.status(200).send(templateResponse);

	} else {
		res.status(405).send('Method Not Allowed');
	}
}