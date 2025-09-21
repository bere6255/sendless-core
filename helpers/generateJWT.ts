import * as dotenv from "dotenv";
dotenv.config()
import jwt from "jsonwebtoken"
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export default (id: string) => {
    const token = jwt.sign(
        { id, created_at: new Date() },
        ENCRYPTION_KEY,
        {
            expiresIn: '24h'	// expires in 1 hour
        }
    );

    return token;
}