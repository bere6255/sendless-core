import { Model } from "objection"

class Address extends Model {
	[x: string]: any;
	// Table name is the only required property.
	static get tableName() {
		return "address";
	}

	static get idColumn() {
		return "id";
	}
}

export default Address;
