export interface MailConfig {
  incoming: {
    server: string;
    protocol: string;
    port: number;
    ssl: string;
    auth: string;
  };
  outgoing: {
    server: string;
    protocol: string;
    port: number;
    ssl: string;
    auth: string;
  };
}

export const mailConfig: MailConfig = {
  incoming: {
    server: 'mail1.gnuweeb.org',
    protocol: 'IMAP',
    port: 143,
    ssl: 'STARTTLS',
    auth: 'Normal Password',
  },
  outgoing: {
    server: 'mail1.gnuweeb.org',
    protocol: 'SMTP',
    port: 587,
    ssl: 'STARTTLS',
    auth: 'Normal Password',
  },
};
