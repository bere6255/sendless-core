CREATE DEFINER=`root`@`%` PROCEDURE `createTransaction`(
            IN last_Balance BIGINT(255),
            IN last_BalanceReceiver BIGINT(255),
            IN uniqueKey TEXT,
            IN user_id BIGINT(255),
            IN peer_user_id BIGINT(255),
            IN asset_id BIGINT(255),
            IN amount_value BIGINT(255),
            IN description TEXT,
            IN reference TEXT,
            IN status TEXT,
            IN outward TEXT,
            IN type TEXT,
            IN provider TEXT,
            IN charge BIGINT(255),
            IN provider_reference TEXT,
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
                    INSERT INTO transactions (transactions.user_id, transactions.peer_user_id, transactions.asset_id, transactions.description, transactions.reference, transactions.status, transactions.outward,  transactions.type, transactions.provider, transactions.amount, transactions.balance, transactions.charge, transactions.created_at, transactions.updated_at, transactions.provider_reference, transactions.unique_key)
                    VALUES (user_id, peer_user_id, asset_id, description, reference, status, outward, type, provider, amount_value, @newBalance, charge, @date, @date, provider_reference, @uniqueKey);
                    SELECT ROW_COUNT() INTO @insertRowCount;
                    
                    IF (@insertRowCount = 1) THEN
                        INSERT INTO transactions (transactions.user_id, transactions.peer_user_id, transactions.asset_id, transactions.description, transactions.reference, transactions.status, transactions.outward, transactions.type, transactions.provider, transactions.amount, transactions.balance, transactions.charge, transactions.created_at, transactions.updated_at, transactions.provider_reference, transactions.unique_key)
                        VALUES (peer_user_id, user_id, asset_id, description, reference, status, outward, type, provider, @theAmountReceiver, @newBalanceReceiver, charge, @date, @date, provider_reference, @uniqueKeyReceiver);
                        SELECT LAST_INSERT_ID() INTO @creditId;
                        
                        UPDATE wallets SET ledger_balance = @newBalance WHERE wallets.user_id = user_id AND type="NGN"; 
                        UPDATE wallets SET amount = @newBalanceReceiver, ledger_balance = @newBalanceReceiver WHERE wallets.user_id = peer_user_id AND type="NGN";
                        SET @addedTransaction = 1;
                    END IF;
    
                    IF (@insertRowCount <> 1) THEN
                        SET @addedTransaction = 0;
                        SET @proceed = 0;
                    END IF;
                    
                END IF;
                IF (@newBalance < 0) THEN 
                    UPDATE wallets SET ledger_balance = @lastBalance WHERE wallets.user_id = user_id AND type="NGN"; 
                    SET @addedTransaction = 2;
                END IF; 
            END IF;
            IF (@theAmount >= 0 AND (peer_user_id = 4 OR peer_user_id = 4)) THEN
                SET @transactionType = 'credit';
                IF (@newBalance >= 0) THEN 
                    INSERT INTO transactions (transactions.user_id, transactions.peer_user_id, transactions.asset_id, transactions.description, transactions.reference, transactions.status, transactions.outward, transactions.type, transactions.provider, transactions.amount, transactions.balance, transactions.charge, transactions.created_at, transactions.updated_at, transactions.provider_reference, transactions.unique_key)
                    VALUES (user_id, peer_user_id, asset_id, description, reference, status, outward, type, provider, amount_value, @newBalance, charge, @date, @date, provider_reference, @uniqueKeyGateway);
                    SELECT ROW_COUNT() INTO @insertRowCount;
    
                    IF (@insertRowCount = 1) THEN
                        SET @addedTransaction = 1;
                        UPDATE wallets SET ledger_balance = @newBalance WHERE wallets.user_id = user_id AND type="NGN";
                    END IF;
    
                    IF (@insertRowCount <> 1) THEN
                        SET @addedTransaction = 0;
                        SET @proceed = 0;
                    END IF;
    
                END IF;
                IF (@newBalance < 0) THEN 
                    UPDATE wallets SET ledger_balance = @lastBalance WHERE wallets.user_id = user_id AND type="NGN"; 
                END IF;
            END IF;
            SELECT @addedTransaction, @newBalance, @lastBalance, @transactionType, @theAmount, @insertRowCount, @proceed, @creditId;
        END