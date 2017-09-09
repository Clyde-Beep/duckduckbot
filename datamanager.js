const fs = require('fs');
const db = require('sqlite');

class DataManager {
  constructor() {
    if (!fs.existsSync('./db')) {
      fs.mkdir('./db');
    }

    db.open('./db/persist.sqlite', { Promise })
      .then(() => db.run('CREATE TABLE IF NOT EXISTS Users(user_id INTEGER PRIMARY KEY, user_name TEXT)'))
      .catch((err) => {
        console.log('error creating the db');
        console.log(err.message);
      });
  }
}

module.exports = DataManager;
