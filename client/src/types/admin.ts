export type TAdmin ={
    name: string;
    username:string;
    email: string;
    password: string;
    role: 'superAdmin' | 'admin';
    category: string[] | string;
    mediaType:string[] | string;
    resetPasswordToken: string | undefined;
    resetPasswordExpires: Number | undefined;
    isDeleted: Boolean;
 
}