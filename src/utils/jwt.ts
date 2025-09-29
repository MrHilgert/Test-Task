import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import type { StringValue } from "ms";

export interface UserJwtPayload extends JwtPayload {
    id: number;
    username: string
};

export const generateUserToken = (payload: UserJwtPayload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET!, { expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '1d' });
};