// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const apiFake = axios.create({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	baseURL: 'http://localhost:3004/',
});

export default apiFake;