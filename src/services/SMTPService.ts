import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ISenderAPI, SenderAPIData } from '@hunteroi/discord-verification';

export type SMTPServiceOptions = SMTPTransport.Options;

export default class SMTPService implements ISenderAPI {
    #options: SMTPServiceOptions;

    constructor(options: SMTPServiceOptions) {
        this.#options = options;
    }

    async send({ name, code, ...data }: SenderAPIData): Promise<void> {
        const transporter = createTransport(this.#options);
        await transporter.verify();
        await transporter.sendMail({
            from: this.#options.from,
            to: data.to,
            subject: 'Discord Authentication Code',
            text: `Hello ${name}! Your code is ${code}. See you soon o/`,
            html: `<p>Hello ${name}!</p><p>Your code is ${code}.</p><p>See you soon o/</p>`
        });
    }
}
