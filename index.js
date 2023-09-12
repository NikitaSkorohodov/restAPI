const express = require('express');
const app = express();
const connection = require("./config");

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/tere', (req, res) => {
  res.send('tere maa');
});

app.get('/api/v1.0/categories', (req, res) => {
  connection.query('SELECT name FROM category', (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      throw err;
    }
    res.json(rows); // Отправляем результат запроса в формате JSON
  });
});
app.get('/api/v1.0/film', (req, res) => {
  connection.query('SELECT title FROM film', (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      throw err;
    }
    res.json(rows); // Отправляем результат запроса в формате JSON
  });
});
app.get('/api/v1.0/actors', (req, res) => {
  connection.query('SELECT first_name, last_name FROM actor ORDER BY first_name, last_name LIMIT 10', (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      throw err;
    }
    res.json(rows); // Отправляем результат запроса в формате JSON
  });
});
app.get('/api/v1.0/films/:genre', (req, res) => {
  const genre = req.params.genre;
  const query = `
    SELECT film.title 
    FROM film 
    INNER JOIN film_category ON film.film_id = film_category.film_id 
    INNER JOIN category ON film_category.category_id = category.category_id 
    WHERE category.name = ?;
  `;

  connection.query(query, [genre], (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      return;
    }
    
    res.json(rows); // Отправляем результат запроса в формате JSON
  });
});

app.get('/api/v1.0/actor/films/:lastName', (req, res) => {
  const lastName = req.params.lastName;
  const query = `
    SELECT film.title 
    FROM film 
    INNER JOIN film_actor ON film.film_id = film_actor.film_id 
    INNER JOIN actor ON film_actor.actor_id = actor.actor_id 
    WHERE actor.last_name = ?
  `;

  connection.query(query, [lastName], (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'Фильмы с участием актера указанной фамилии не найдены' });
    } else {
      res.json(rows); // Отправляем результат запроса в формате JSON
    }
  });
});
app.get('/api/v1.0/films/actors/:startingLetters', (req, res) => {
  const startingLetters = req.params.startingLetters;
  const query = `
    SELECT film.title 
    FROM film 
    INNER JOIN film_actor ON film.film_id = film_actor.film_id 
    INNER JOIN actor ON film_actor.actor_id = actor.actor_id 
    WHERE actor.last_name LIKE ?;
  `;

  connection.query(query, [`${startingLetters}%`], (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'Фильмы с участием актеров, фамилия которых начинается с указанных букв, не найдены' });
    } else {
      res.json(rows); // Отправляем результат запроса в формате JSON
    }
  });
});
app.get('/api/v1.0/genre/count', (req, res) => {
  const query = `
    SELECT category.name AS genre, COUNT(*) AS movie_count
    FROM film
    INNER JOIN film_category ON film.film_id = film_category.film_id
    INNER JOIN category ON film_category.category_id = category.category_id
    GROUP BY category.name;
  `;

  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      return;
    }

    if (rows.length === 0) {
      res.status(404).json({ error: 'Нет данных о количестве фильмов в жанрах' });
    } else {
      res.json(rows); // Отправляем результат запроса в формате JSON
    }
  });
});






app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
