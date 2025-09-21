import * as dotenv from "dotenv";
dotenv.config()
import { Model } from "objection"
import Wallet from "./Wallet"
import Pin from "./Pin"
import Address from "./Address";
const APP_URL = process.env.APP_URL;
class User extends Model {
	[x: string]: any;
	static theTableName() {
		return "users";
	}

	// Table name is the only required property.
	static get tableName() {
		return this.theTableName();
	}

	static get idColumn() {
		return "id";
	}

	static get relationMappings() {

		return {
			wallet: {
				relation: Model.BelongsToOneRelation,
				modelClass: Wallet,
				join: {
					from: "users.id",
					to: "wallets.user_id",
				},
			},

			pin: {
				relation: Model.HasOneRelation,
				modelClass: Pin,
				join: {
					from: "users.id",
					to: "pins.user_id",
				},
			},
			address: {
				relation: Model.HasOneRelation,
				modelClass: Address,
				join: {
					from: "users.id",
					to: "address.user_id",
				},
			},

		};
	}

	user() {
		let avatar = null;
		if (this.avatar) {
			const theAvatar = JSON.parse(this.avatar);
			if (theAvatar.length > 0) {
				const newAvatar = <any>[];
				for (let index = 0; index < theAvatar.length; index++) {
					newAvatar.push(`${APP_URL}${theAvatar[index]}`)
				}
				avatar = newAvatar;
			}
		}
		return {
			id: this.id,
			fullName: this.full_name,
			phone: this.phone,
			email: this.email,
			tag: this.tag,
			avatar,
			notification: this.notification !== 0,
			status: this.status,
			country: this.country,
			phone_verified_at: this.phone_verified_at ? true : false,
			email_verified_at: this.email_verified_at ? true : false,
			bvn_verified_at: this.bvn_verified_at ? true : false,
			isPin: false,
			isAddress: false,
			isBvn: false,
			isNextKin: false,
			isDocs: false,
			limit: this.limit,
			account_tier: this.account_tier,
			accounts: null,
			address: {

			},
			nextofkin: {

			},
			twofa: parseInt(this.twofa) > 0 ? true : false,
			googleAuth: parseInt(this.googleAuth) > 0 ? true : false,
			created_at: this.created_at,
			banned_at: this.banned_at,
			updated_at: this.updated_at,
		};
	}

	userSimplified() {
		return {
			fullName: this.fullName,
			phone: this.phone,
			email: this.email,
			tag: this.tag,
			avatar: !this.avatar ? null : this.avatar,
			created_at: this.created_at,
		};
	}


}

export default User;
