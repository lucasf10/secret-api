export default interface User {
    id: string;
    username: string;
    email: string;
    password: string | undefined;
    createdAt: Date;
}
