const { Model } = require("objection");

class Wallet extends Model {
	// Table name is the only required property.
	static get tableName() {
		return "wallets";
	}

	static get idColumn() {
		return "id";
	}
	static get relationMappings() {

		return {
		
			
		};
	}

}

export default Wallet;
