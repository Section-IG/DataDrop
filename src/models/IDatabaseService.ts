import { IStoringSystem } from '@hunteroi/discord-verification';

import { User } from './User';

export type IDatabaseService = {
    start: () => Promise<void>,
    stop: () => Promise<void>
} & IStoringSystem<User>;
