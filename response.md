# Response
目前所需的 API 都已經完成並且透過 postman 寫好了文件，不過測試的部分由於本人完全沒有實作經驗，因此遺憾無法在這次作業完成。

## API Documentation
  https://documenter.getpostman.com/view/7992002/2sB2x9iALX

## How to run this project

1. `cp .env.example .env`
2. edit your .env file
  For this assignment, I want to develop and debug my app as easy as possible, so I want only following variables editable:
  - Please set `MYSQL_ROOT_PASSWORD` and `MYSQL_PASSWORD` to be the same.
  - set `RUN_INSERT_SCRIPT` to `true` or `false` if you need to insert json data into DB or not
3. run docker through docker-compose: `docker-compose up -d`
4. domain: `localhost:11451`
