#!/bin/sh

npx sequelize-cli db:migrate

if [ "$RUN_INSERT_SCRIPT" = "true" ]; then
  echo "Insert data from json"
  npm run insertData
else
  echo "No need to insert"
fi

npm start