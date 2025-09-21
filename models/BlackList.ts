import { Model } from "objection"

class BlackList extends Model {
	// Table name is the only required property.
	static get tableName() {
		return "black_list";
	}

	static get idColumn() {
		return "id";
	}
}

export default BlackList;
