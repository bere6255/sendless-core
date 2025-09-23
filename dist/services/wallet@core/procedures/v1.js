"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mysql = require("mysql2");
const Wallet_1 = __importDefault(require("../../../models/Wallet"));
const table = process.env.TRANSACTION_TABLE;
const TENCOIN_USER_ID = process.env.TENCOIN_USER_ID;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        CREATE PROCEDURE createTransaction(
            IN last_Balance BIGINT(255),
            IN last_BalanceReceiver BIGINT(255),
            IN uniqueKey TEXT,
            IN user_id BIGINT(255),
            IN peer_user_id BIGINT(255),
            IN amount_value BIGINT(255),
            IN description TEXT,
            IN reference TEXT,
            IN status TEXT,
            IN outward TEXT,
            IN walletType TEXT,
            IN type TEXT,
            IN provider TEXT,
            IN charge BIGINT(255),
            IN provider_reference TEXT,
            IN meta TEXT,
            OUT addedTransaction BOOLEAN,
            OUT newBalance INT(20),
            OUT lastBalance INT(20),
            OUT transactionType TEXT,
            OUT theAmount TEXT,
            OUT insertRowCount TEXT,
            OUT proceed TEXT
        )
        BEGIN
            SET @lastBalance = last_Balance;
            SET @lastBalanceReceiver = last_BalanceReceiver;
            SET @date = CURRENT_TIMESTAMP(); 
            SET @proceed = 1; 
            SET @addedTransaction = 0; 
            SET @theAmount = amount_value;
            SET @theAmountReceiver = -(@theAmount);
            SET @newBalance = @lastBalance + @theAmount;
            SET @newBalanceReceiver = @lastBalanceReceiver + @theAmountReceiver;
            SET @creditId = 0;
            SET @uniqueKey = CONCAT('dr_', uniqueKey);
            SET @uniqueKeyReceiver = CONCAT('cr_', uniqueKey);
            SET @uniqueKeyGateway = CONCAT('init_', uniqueKey);
    
    
            IF (@theAmount < 0) THEN
                SET @transactionType = 'debit';
                IF (@newBalance >= 0) THEN 
                    INSERT INTO ${table} (${table}.user_id, ${table}.peer_user_id, ${table}.description, ${table}.reference, ${table}.status, ${table}.outward, ${table}.wallet_type,  ${table}.type, ${table}.provider, ${table}.amount, ${table}.balance, ${table}.charge, ${table}.provider_reference, ${table}.meta, ${table}.created_at, ${table}.updated_at, ${table}.unique_key)
                    VALUES (user_id, peer_user_id, description, reference, status, outward, walletType, type, provider, amount_value, @newBalance, charge, provider_reference, @date, @date, meta, @uniqueKey);
                    SELECT ROW_COUNT() INTO @insertRowCount;
                    
                    IF (@insertRowCount = 1) THEN
                        INSERT INTO ${table} (${table}.user_id, ${table}.peer_user_id, ${table}.description, ${table}.reference, ${table}.status, ${table}.outward, ${table}.wallet_type, ${table}.type, ${table}.provider, ${table}.amount, ${table}.balance, ${table}.charge, ${table}.provider_reference, ${table}.meta, ${table}.created_at, ${table}.updated_at, ${table}.unique_key)
                        VALUES (peer_user_id, user_id, description, reference, status, outward, walletType, type, provider, @theAmountReceiver, @newBalanceReceiver, charge, provider_reference, @date, @date, meta, @uniqueKeyReceiver);
                        SELECT LAST_INSERT_ID() INTO @creditId;
                        
                        SET @addedTransaction = 1;
                    END IF;
    
                    IF (@insertRowCount <> 1) THEN
                        SET @addedTransaction = 0;
                        SET @proceed = 0;
                    END IF;
                    
                END IF;
                IF (@newBalance < 0) THEN 
                    SET @addedTransaction = 2;
                END IF; 
            END IF;
            IF (@theAmount >= 0 AND (peer_user_id = ${TENCOIN_USER_ID})) THEN
                SET @transactionType = 'credit';
                IF (@newBalance >= 0) THEN 
                    INSERT INTO ${table} (${table}.user_id, ${table}.peer_user_id, ${table}.description, ${table}.reference, ${table}.status, ${table}.outward, ${table}.wallet_type, ${table}.type, ${table}.provider, ${table}.amount, ${table}.balance, ${table}.charge, ${table}.provider_reference, ${table}.meta, ${table}.created_at, ${table}.updated_at, ${table}.unique_key)
                    VALUES (user_id, peer_user_id, description, reference, status, outward, walletType, type, provider, amount_value, @newBalance, charge, provider_reference, meta, @date, @date, @uniqueKeyGateway);
                    SELECT ROW_COUNT() INTO @insertRowCount;
                    SET @addedTransaction = 1;
                 
    
                    IF (@insertRowCount <> 1) THEN
                        SET @addedTransaction = 0;
                        SET @proceed = 0;
                    END IF;
    
                END IF;
            END IF;
            SELECT @addedTransaction, @newBalance, @lastBalance, @transactionType, @theAmount, @insertRowCount, @proceed, @creditId;
        END;`;
    const params = [];
    const buildQuery = mysql.format(query, params);
    const procedureRes = yield Wallet_1.default.knex().raw(buildQuery);
    return procedureRes;
});
//# sourceMappingURL=v1.js.map