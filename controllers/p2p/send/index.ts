import { NextFunction, Request, Response } from "express";
import User from "../../../models/User";
import validation from "./validation";
import debit from "../../../services/wallet/debitP2P";
import generateRef from "../../../utils/generateRef";
import redisConnection from "../../../redis/redisConnection";
import AppError from "../../../utils/AppError";

const logPrefix = "[P2P:SEND:CONTROLLER]";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = req.user;

		console.log(`${logPrefix} init ===> `, JSON.stringify({
			user: { id: user.id, email: user.email, phone: user.phone },
			payload: { ...req.body, transactionPin: null }
		}));

		const { errors, value } = await validation(req.body);

		if (errors) {
			throw new AppError(errors[0], 400, logPrefix, errors);
		}

		let { wallet, usernames, amount, description, meta } = value;

		// Check Redis config for transfer availability
		let transferStatus = await redisConnection({ type: "get", key: "p2p", value: null, time: null });
		if (transferStatus) {
			transferStatus = JSON.parse(transferStatus);
			if (!transferStatus.transfer) {
				throw new AppError("Transfers are currently not available, please try again in a few minutes", 400, logPrefix, {});
			}
		}

		// Check if any of the usernames (email, phone, tag) exist
		const checkUserDetaild = await User.query()
			.select("id")
			.where(builder =>
				builder
					.whereIn("email", usernames)
					.orWhereIn("phone", usernames)
					.orWhereIn("tag", usernames)
			);

		if (checkUserDetaild.length === 0) {
			throw new AppError("Account not found", 400, logPrefix, {});
		}

		// Get array of IDs from matched users
		const userIds = checkUserDetaild.map(u => u.id);

		// Process each peer transfer
		for (let peerUserId of userIds) {
			const payload = {
				user_id: user.id,
				peer_user_id: peerUserId,
				description,
				reference: generateRef({ type: "p2p" }),
				amount,
				limit: parseInt(user.limit),
				charge: 0,
				type: "p2p",
				wallet,
				meta
			};

			const debitPayload = await debit(payload);

			console.log(`${logPrefix} send Response ===> `, JSON.stringify(debitPayload));

			if (debitPayload.status === false) {
				return res.status(400).send(debitPayload);
			}
		}

		// Success response
		return res.status(200).send({
			status: true,
			data: {},
			message: "Processing transaction"
		});

	} catch (error: any) {
		error.logPrefix = logPrefix;
		next(error);
	}
};
