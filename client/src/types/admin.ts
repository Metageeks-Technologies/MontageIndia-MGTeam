export type TAdmin ={
    _id:string;
    name: string;
    username:string;
    email: string;
    password: string;
    role: 'superadmin' | 'admin';
    category: string[] | string;
    mediaType:string[] | string;
    resetPasswordToken: string | undefined;
    resetPasswordExpires: Number | undefined;
    isDeleted: Boolean;
 
}
