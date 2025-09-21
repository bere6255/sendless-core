import { Model } from "objection"

class Bans extends Model {
	// Table name is the only required property.
	static get tableName() {
		return "bans";
	}

	static get idColumn() {
		return "id";
	}
}

export default Bans;
