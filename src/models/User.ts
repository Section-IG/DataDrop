import { IUser } from '@hunteroi/discord-verification';

export interface User extends IUser {
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: Date | null;
}
