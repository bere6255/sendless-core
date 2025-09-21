import { Model } from "objection"

class Token extends Model {
	[x: string]: any;
	// Table name is the only required property.
	static get tableName() {
		return "token";
	}

	static get idColumn() {
		return "id";
	}
}

export default Token;
