import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type { ISenderAPI, SenderAPIData } from "@hunteroi/discord-verification";

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
            subject: "Code d'Authentification Discord",
            text: `Hello ${name}! Ton code est ${code}. A plus tard o/`,
            html: `<p>Hello ${name}!</p><p>Ton code est ${code}.</p><p>A plus tard o/</p>`,
        });
    }
}
