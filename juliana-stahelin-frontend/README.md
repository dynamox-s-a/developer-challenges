# Front-end challenge - by Juliana Stahelin

## The project
Project built as a front-end challenge for Dynamox.

User can click on "Acessar o sistema" in the homepage and access a page displaying machine details and 3 time-series charts. The charts are built with data fetched from a mocked REST API on every page access. All routes are responsive.

## Live deploy
Front-end live deploy of application is in this link: <a href="https://developer-challenges.vercel.app/" target="_blank">https://developer-challenges.vercel.app/</a>

REST API (built using Json-server) live deploy is in this link: <a href="https://challenge-json-server-api.vercel.app/">https://challenge-json-server-api.vercel.app/</a>

## How to run this project
To run this application locally, follow these steps:

1. Open a terminal and clone the repository:
```
git clone https://github.com/julianastahelin/developer-challenges.git
```
2. Enter the project folder:
```
cd developer-challenges/juliana-stahelin-frontend 
```
3. Switch to the branch I added the features on:
```
git checkout juliana-stahelin
```
4. Open the project in a code editor (I'm using VSCode):
```
code .
```
6. Set the environment variable for the API. Create a `.env.local` file and add this variable (shown here because it is a mocked API only):
```
VITE_CHARTS_API_URL='https://challenge-json-server-api.vercel.app/'
```
5. Install the dependencies:
```
npm install
```
6. Run the project on the terminal:
```
npm run dev
```
7. Access `http://localhost:5174/` on your browser. <i>Voilà!</i>


## Built with
- React
- TypeScript
- Vite.js
- Redux
- Redux Saga
- Material UI 5
- Highcharts
- Json-server (to mock API)
