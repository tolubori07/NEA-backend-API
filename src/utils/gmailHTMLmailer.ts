const tls = await import("tls");
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";


const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465; // TLS uses port 465
const USER = "olifesavers@gmail.com";
const PASSWORD = "vrwg jywb hdpe jcrv"; // Use App Password if 2FA is enabled
const FROM = USER;

/**
 * Send HTML Email using Gmail and Bun
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML content for the email body
 */

export const sendHTMLmail = async (to: string, subject: string, htmlBody: string) => {
  return new Promise((resolve, reject) => {
    const client = tls.connect(SMTP_PORT, SMTP_HOST, () => {
      console.log("✅ Connected to Gmail SMTP");
      const boundary = "----BunCustomEmailBoundary";

      const content = [
        `Subject: ${subject}`,
        `From: ${FROM}`,
        `To: ${to}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        `This is the plain text version of the email for clients that don't support HTML.`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset="UTF-8"`,
        ``,
        `${htmlBody}`,
        ``,
        `--${boundary}--`,
        `.`, // Marks end of the email data
      ].join("\r\n");

      const commands = [
        `EHLO localhost`,
        `AUTH LOGIN`,
        Buffer.from(USER).toString("base64"),
        Buffer.from(PASSWORD).toString("base64"),
        `MAIL FROM:<${FROM}>`,
        `RCPT TO:<${to}>`,
        `DATA`,
        content,
        `QUIT`,
      ];

      let index = 0;
      client.on("data", (data) => {
        console.log(data.toString());
        if (index < commands.length) {
          client.write(`${commands[index++]}\r\n`);
        } else {
          client.end();
          resolve("📨 Email sent successfully!");
        }
      });

      client.on("error", (err) => reject(err));
    });
  });
};
