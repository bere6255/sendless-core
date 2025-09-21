import * as env from "dotenv";
env.config();
import Axios from "axios";
const FINCRA_BASEURL = process.env.FINCRA_BASEURL;
const FINCRA_API_KEY = process.env.FINCRA_API_KEY;

const meTaInstance = Axios.create({
	headers: {
		"Accept": 'application/json',
		'Content-Type': 'application/json',
		"api-key": FINCRA_API_KEY,

	},
	baseURL: FINCRA_BASEURL,
});
const post = meTaInstance.post
const get = meTaInstance.get
export default {post, get}
