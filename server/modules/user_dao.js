'use strict';

/*Dao module for the user*/

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('plan.db', (err) => {
  if(err) throw err;
});

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
            const user = {id: row.id, username: row.email, name: row.name , tipo: row.tipopiano}
            resolve(user);
          }
      });
    });
  };
  
  exports.getUser = (email, password) => {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.get(sql, [email], (err, row) => {
          if (err) { reject(err); }
          else if (row === undefined) { resolve(false); }
          else {
            const user = {id: row.id, username: row.email, name: row.name, tipo: row.tipopiano};
            
            const salt = row.salt;
            crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
              if (err) reject(err);
  
              const passwordHex = Buffer.from(row.password, 'hex');
  
              if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
                resolve(false);
              else resolve(user); 
            });
          }
        });
      });
    };

    exports.setPlanType = (id, type) => {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET tipopiano = (?) WHERE id = (?)';
          db.run(sql, [type,id], (err) => {
            if (err) 
              reject(err);
            else {
              resolve({ id: this.lastID, changes: this.changes })
            }
        });
      });
    }