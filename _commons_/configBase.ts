import * as dotenv from 'dotenv';
dotenv.config();

export default class ConfigBase {
    // system
    static NODE_ENV: string = `${process.env.NODE_ENV || "development"}`;
    static DEV_ENV: boolean = ConfigBase.NODE_ENV === "development";
    static SITE_URL: string = `${process.env.SITE_URL || "http://localhost:3000"}`;
    static MAILER_TRANSPORT: string = `${process.env.MAILER_TRANSPORT}`;
    static MAILER_USER: string = `${process.env.MAILER_USER}`;
    static MAILER_PASS: string = `${process.env.MAILER_PASS}`;
    static MAILER_HOST: string = `${process.env.MAILER_HOST}`;
    static MAILER_PORT: number = parseInt(`${process.env.MAILER_PORT}`);
    static DEFAULT_FROM: string = ConfigBase.getDefaultFrom(ConfigBase.MAILER_TRANSPORT);

    // database 
    static DATABASE_URL: string = `${process.env.DATABASE_URL}`;

    // blockchain
    static POSEIDON_PAY_CONTRACT: string = `${process.env.POSEIDON_PAY_CONTRACT}`;
    static INFURA_NETWORK: string = `${process.env.INFURA_NETWORK}`;
    static INFURA_API_KEY: string = `${process.env.INFURA_API_KEY}`;
    static ADMIN_PRIVATE_KEY: string = `${process.env.ADMIN_PRIVATE_KEY}`;

    // security
    static CORS_ORIGIN: string = `${process.env.CORS_ORIGIN || "*"}`;
    static JWT_SECRET: string = `${process.env.JWT_SECRET}`;
    static JWT_EXPIRES: number = parseInt(`${process.env.JWT_EXPIRES}`);
    static AES_KEY: string = `${process.env.AES_KEY}`;

    static getDefaultFrom(transport: string): string {
        if(!transport) return '';
        const spl = transport.split('//');
        return spl[spl.length - 1].split(':')[0];
    }
}