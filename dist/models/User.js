"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const objection_1 = require("objection");
const Wallet_1 = __importDefault(require("./Wallet"));
const Pin_1 = __importDefault(require("./Pin"));
const Address_1 = __importDefault(require("./Address"));
const APP_URL = process.env.APP_URL;
class User extends objection_1.Model {
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
                relation: objection_1.Model.BelongsToOneRelation,
                modelClass: Wallet_1.default,
                join: {
                    from: "users.id",
                    to: "wallets.user_id",
                },
            },
            pin: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Pin_1.default,
                join: {
                    from: "users.id",
                    to: "pins.user_id",
                },
            },
            address: {
                relation: objection_1.Model.HasOneRelation,
                modelClass: Address_1.default,
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
                const newAvatar = [];
                for (let index = 0; index < theAvatar.length; index++) {
                    newAvatar.push(`${APP_URL}${theAvatar[index]}`);
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
            address: {},
            nextofkin: {},
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
exports.default = User;
//# sourceMappingURL=User.js.map