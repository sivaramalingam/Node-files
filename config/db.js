const mysql = require('mysql');

const server = '151.106.97.51'; // REPLACE WITH YOUR DB SERVER
const database = 'u176910432_admin_pk';      // REPLACE WITH YOUR DB NAME
const username = 'u176910432_adminpk'; 
const pwd = 'AdmIn_Pk@94';
const port = '3306';
const dbConnect = mysql.createPool({
  host: server,
  port: port, 
  user: username,
  password: pwd,
  database: database,
  connectionLimit: 10
});

module.exports.connection = dbConnect; 

module.exports.connectDb = () => {
  dbConnect.getConnection((err) => {
    if (err) {
      console.error('Database connection error');
    } else {
      console.log('MySQL Database connection successful');
    }
  });
  dbConnect.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      connectDb();                                // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      // throw err;                                  // server variable configures this)
    }
  });
};
// module.exports = connectDb;