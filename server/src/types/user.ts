import { Document } from "mongoose";
export type TAdmin = Document & {
    name: string;
    username:string;
    email: string;
    password: string;
    role: 'superAdmin' | 'admin';
    category: string;
    mediaType: String;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}