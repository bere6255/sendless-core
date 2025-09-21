import { Model } from "objection"
import User from "./User";
class Refferal extends Model {
	[x: string]: any;

	static get tableName() {
		return "refferal";
	}

	static get idColumn() {
		return "id";
	}

	static get relationMappings() {

		return {
			user: {
				relation: Model.HasManyRelation,
				modelClass: User,
				filter: (query) => query.select(  "firstName", "lastName"),
				join: {
					from: "refferal.peer_user_id",
					to: "users.id",
				},
			},
		};
	}
}

export default Refferal;
