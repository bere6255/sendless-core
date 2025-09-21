import { Model } from "objection"

class VerificationDocuments extends Model {
    [x: string]: any;
	// Table name is the only required property.
	static get tableName() {
		return "verification_documents";
	}

	static get idColumn() {
		return "id";
	}
}

export default VerificationDocuments;
