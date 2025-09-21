import { Model } from "objection"

class Devices extends Model {
	[x: string]: any;
	// Table name is the only required property.
	static get tableName() {
		return "devices";
	}

	static get idColumn() {
		return "id";
	}
}

export default Devices;
