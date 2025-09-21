import { Model } from "objection"
import User from "./User";
class Transactions extends Model {
	[x: string]: any;
	// Table name is the only required property.
	static get tableName() {
		return "transactions";
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
					from: "transactions.user_id",
					to: "users.id",
				},
			},
			peeruser: {
				relation: Model.HasManyRelation,
				modelClass: User,
				filter: (query) => query.select(  "firstName", "lastName"),
				join: {
					from: "transactions.user_id",
					to: "users.id",
				},
			}
		};
	}

}

export default Transactions;
