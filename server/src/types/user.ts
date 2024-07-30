import { Document } from "mongoose";
export type TAdmin = Document & {
    name: string;
    username:string;
    email: string;
    password: string;
    role: 'superAdmin' | 'admin';
    category: string;
    mediaType: String;
    resetPasswordToken: string | undefined;
    resetPasswordExpires: Number | undefined;
    isDeleted: Boolean;
    createJWT(): string;
    comparePassword(givenPassword: string): Promise<boolean>;
}