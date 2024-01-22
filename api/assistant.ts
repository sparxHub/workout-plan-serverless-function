import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { OpenAI } from 'openai'; // Import OpenAI library

const clientOptions = {
	apiKey: process.env.OPENAI_API_KEY
};

const openai = new OpenAI(clientOptions); // Use your OpenAI API key

async function waitForRunRequiresAction(threadId, runId) {
	let runStatus = 'queued';
	let runDetails;

	while (runStatus === 'queued' || runStatus === 'in_progress') {
		try {
			runDetails = await openai.beta.threads.runs.retrieve(threadId, runId);
			runStatus = runDetails.status;

			// console.log('runDetails:', JSON.stringify(runDetails));

			await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust interval as needed
		} catch (error) {
			console.error('Error checking run status:', error);
			throw new Error(`Error on waitForRunRequiresAction. error: ${error}`); // Raise error with status
		}
	}

	if (runStatus === 'completed') {
		console.error('runStatus status: completed but expected to be requires_action', runDetails);
	} else if (runStatus === 'requires_action') {
		// Check for required_action.submit_tool_outputs
		if (!runDetails.required_action || runDetails.required_action.type !== 'submit_tool_outputs') {
			throw new Error('Run requires action, but no submit_tool_outputs found');
		}

		// Check for tool_calls[0] with type 'function'
		const toolCalls = runDetails.required_action.submit_tool_outputs.tool_calls;
		if (!toolCalls || toolCalls.length === 0 || toolCalls[0].type !== 'function') {
			throw new Error('Run requires action, but no function tool call found');
		}

		return toolCalls[0];
	} else if (
		runStatus === 'failed' ||
		runStatus === 'cancelled' ||
		runStatus === 'cancelling' ||
		runStatus === 'expired'
	) {
		throw new Error(`Run failed with status: ${runStatus}`); // Raise error with status
	} else {
		throw new Error(`Unexpected run status: ${runStatus}`);
	}
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for all origins
		res.setHeader('Access-Control-Allow-Methods', 'POST'); // Indicate allowed methods
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow content type header
		res.status(204).end(); // Respond with empty success
	} else if (req.method === 'POST') {
		try {
			// Use a saved assistant created on the playground
			const assistant_id = process.env.OPENAI_WORKOUT_PLAN_ASSISTANT ?? "ASSISTANT_ID";

			let parsedBody = req.body;

			// Check if req.body is a string, then parse it as JSON
			if (typeof req.body === 'string') {
				try {
					parsedBody = JSON.parse(req.body);
				} catch (error) {
					console.error(error);
					res.status(400).json({ error: 'Invalid JSON in request body' });
					return;
				}
			}

			// Validate parsedBody parameters
			const requiredParams = ['age', 'gender', 'skillLevel', 'timesPerWeek', 'sessionDuration', 'planFocusExerciseArray', 'healthStatus', 'EquipmentsArray', 'moreInfoText'];
			const missingParams = requiredParams.filter((param) => !parsedBody.hasOwnProperty(param));

			if (missingParams.length > 0) {
				res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
				return;
			}

			if (parsedBody.planFocusExerciseArray.length === 0) {
				res.status(400).json({ error: 'planFocusExerciseArray cannot be empty' });
				return;
			}

			if (parsedBody.EquipmentsArray.length === 0) {
				res.status(400).json({ error: 'EquipmentsArray cannot be empty' });
				return;
			}
			if (missingParams.length > 0) {
				throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
			}

			if (parsedBody.planFocusExerciseArray.length === 0) {
				throw new Error('planFocusExerciseArray cannot be empty');
			}

			if (parsedBody.EquipmentsArray.length === 0) {
				throw new Error('EquipmentsArray cannot be empty');
			}

			// Generate prompt based on client attributes
			const prompt = `Generate a workout plan, considering the following client attributes: \n` +
				`1/ My age: ${parsedBody.age ?? "16"} \n` +
				`2/ My gender: ${parsedBody.gender ?? "Male"} \n` +
				`3/ My skill level is: ${parsedBody.skillLevel} \n` +
				`4/ Weekly sessions info: ${parsedBody.timesPerWeek} days for ${parsedBody.sessionDuration} minutes session \n` +
				`5/ Workout plan should focus on: ${parsedBody.planFocusExerciseArray.join(" and ")} \n` +
				`6/ My health status: ${parsedBody.healthStatus} \n` +
				`7/ Equipments: ${parsedBody.EquipmentsArray.join(" + ")} \n` +
				`8/ More info: ${parsedBody.moreInfoText} \n` +
				`;`;

			const thread = await openai.beta.threads.create({
				messages: [
					{
						"role": "user",
						"content": prompt,
					}
				]
			});
			console.log('Sending prompt:')
			console.log(prompt)

			const run = await openai.beta.threads.runs.create(
				thread.id,
				{
					assistant_id: assistant_id,
				}
			);


			const toolCall = await waitForRunRequiresAction(thread.id, run.id);
			console.log('Tool call function arguments:')
			console.log(toolCall.function.arguments)


			// TODO: Submit tool outputs with succeed
			// const submit = await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
			// 	tool_outputs: [
			// 		{
			// 			tool_call_id: toolCall.id,
			// 			output: "{ success: \"true\" }"
			// 		},
			// 	],
			// });

			res.status(200).json(toolCall.function.arguments);
		} catch (error) {
			console.error(error);
			res.status(500).send(`Error processing request. ${error}`);
		}
	} else {
		res.status(405).json({ error: 'Method Not Supported' });
	}
}