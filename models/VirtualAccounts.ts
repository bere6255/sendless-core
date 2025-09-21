import { Model } from "objection"

class VirtualAccounts extends Model {
	[x: string]: any;

	static get tableName() {
		return "virtual_accounts";
	}

	static get idColumn() {
		return "id";
	}

	static get relationMappings() {

		return {
		
		};
	}
}

export default VirtualAccounts;
