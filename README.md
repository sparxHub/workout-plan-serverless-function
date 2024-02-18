## AI-Powered Workout Planner

This simple app creates an AI-Powered Workout Planner using OpenAI Assistant API - a serverless function hosted on Vercel. This tool generates personalized workout plans based on your preferences and fitness goals in just a few clicks. Leveraging OpenAI's capabilities, we provide tailored exercise routines endorsed by fitness experts. Here's a quick guide to get started:

### How to Use:

1. **Fill in Your Details:** Provide your age, gender, skill level, workout frequency, session duration, preferred exercises, health status, and equipment availability.
2. **Submit Your Request:** Click the "Get Your Weekly Planner" button to initiate the generation process.
3. **Receive Your Plan:** In just a couple of minutes, your customized workout plan will be ready for you to follow.

### Features:

- **Personalization:** Tailored exercise routines based on your unique attributes and preferences.
- **Expert Endorsement:** Exercises selected from a curated list recommended by top fitness trainers.
- **Flexibility:** Supports various workout routines including popular splits like Upper/Lower, Push/Pull, and Push/Pull/Legs.
- **Beginner Friendly:** Ideal for both beginners and seasoned fitness enthusiasts, with default options to kickstart your fitness journey.

Get started now and take a step closer to your fitness goals!

### Project Structure:

- **`assistant.ts`:** Serverless function for generating workout plans using OpenAI.
- **`plan.ts`:** Serverless function to fetch workout plan templates from a specified URL.
- **`package.json`:** Project dependencies and scripts for deployment.

### Dependencies:

- **`@vercel/node`:** Vercel serverless function support.
- **`openai`:** OpenAI library for AI-powered interactions.

### Repository:

- **Author:** [Nadav Daniel](https://www.linkedin.com/in/nadav-daniel-0a309150/)
- **Live Demo:** [Try it live](https://workoutplan.simplystud.io/api/plan?utm_source=github&utm_medium=referral&utm_campaign=workout_planner)

Feel free to contribute and improve this tool for the fitness community!
