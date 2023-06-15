export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    dialect: process.env.DB_CONNECTION || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'p4ssw0rd',
    database: process.env.DB_DATABASE || 'db',
  },
  jwt: {
    expiresIn: process.env.JWT_EXPIRESIN,
    secretOrKey: process.env.JWT_SECRETORKEY,
    refreshTokenExpiresIn: process.env.JWT_REFREST_TOKEN_EXPIRESIN,
  },
  mail: {
    mail_host: process.env.MAIL_HOST,
    mail_port: parseInt(process.env.MAIL_PORT, 10) || 465,
    mail_from: process.env.MAIL_FROM,
    mail_username: process.env.MAIL_USERNAME,
    mail_password: process.env.MAIL_PASSWORD,
  },
});
