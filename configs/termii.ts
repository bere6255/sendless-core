require("dotenv").config();
import Axios from "axios";
const TERMII_BASE_URL = process.env.TERMII_BASE_URL;

const TwilioInstance = Axios.create({
	headers: {
		"Accept": 'application/json',
		'Content-Type': 'application/json',
	},
	baseURL: `${TERMII_BASE_URL}`,
});

const post = TwilioInstance.post
const get = TwilioInstance.get

export default { post, get }