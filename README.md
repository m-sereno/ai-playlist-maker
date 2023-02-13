# AI Assisted Playlist Maker 🎵

This is an AI Assisted Playlist Maker app powered by the [OpenAI API](https://platform.openai.com/docs/) and the [Spotify API](https://developer.spotify.com/documentation/web-api/). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). Follow the instructions below to get set up.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd ai-playlist-maker
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [OpenAI API key](https://beta.openai.com/account/api-keys) and [Spotify API credentials](https://developer.spotify.com/dashboard) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)!

![screenshot](https://user-images.githubusercontent.com/10555891/218359019-7c78cf74-896a-4f93-b1c3-a4236b39cfb8.jpg)
