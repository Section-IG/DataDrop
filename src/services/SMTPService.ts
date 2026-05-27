import type { ISenderAPI, SenderAPIData } from "@hunteroi/discord-verification";
import { createTransport, getTestMessageUrl } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export type SMTPServiceOptions = SMTPTransport.Options;

export class SMTPService implements ISenderAPI {
    readonly #options: SMTPServiceOptions;

    constructor(options: SMTPServiceOptions) {
        this.#options = options;
    }

    async send({ name, code, ...data }: SenderAPIData): Promise<void> {
        const transporter = createTransport(this.#options);
        await transporter.verify();
        const result = await transporter.sendMail({
            from: this.#options.from,
            to: data.to,
            subject: "Code d'Authentification Discord",
            text: `Hello ${name}! Ton code est ${code}. A plus tard o/`,
            html: `<p>Hello ${name}!</p><p>Ton code est ${code}.</p><p>A plus tard o/</p>`,
        });
        console.debug("Preview URL: %s", getTestMessageUrl(result));
    }
}
