export default interface User {
    id: string;
    username: string;
    email: string;
    password: string | undefined;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
}
