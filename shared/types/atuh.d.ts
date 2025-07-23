declare module "#auth-utils" {
    interface User {
        id: string;
        email: string;
        username: string;
    }
    interface UserSession {
        user: User;
        loggedInAt: number;
    }
}

export {};
