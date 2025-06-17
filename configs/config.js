module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DEV_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_TEST_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mariadb",
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_PROD_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mariadb",
    logging: false,
  }
}