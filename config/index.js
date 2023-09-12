const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Укажите пароль к вашей MySQL базе данных, если есть
  database: 'sakila'
});

// Установка соединения с базой данных
connection.connect((err) => {
  if (err) {
    console.error('Ошибка при подключении к базе данных:', err);
    throw err;
  }
  console.log('Успешное подключение к базе данных');
});

module.exports = connection; // Экспортируем подключение к базе данных
