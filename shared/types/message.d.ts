export interface MessageDB {
    id?: string;
    content: string;
    userId: string;
    room: string;
    createdAt?: number;
    user: {
        username: string;
    };
}

export interface MessageFront {
    type: string;
    content: string;
}
