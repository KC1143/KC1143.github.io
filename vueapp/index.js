const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
 
const users = require('./routes/users');
const courses = require('./routes/courses');
const ratings = require('./routes/ratings');
 
const app = express();
 
// app.use(axios());
app.use(cors());
app.use(bodyParser.json());
 
app.get('/', (req, res) => {
    res.json('[ BACKEND SERVER RUNNING ]');
});
 
//users APIs
app.get('/users', (req, res) => {
    users.getAll().then((users) => {
        res.json(users);
    });
});
 
app.delete('/users', (req, res) => {
    users.deleteAll().then((users) => {
        res.json(users);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

app.post('/users', (req, res) => {
    users.create(req.body).then((users) => {
        res.json(users);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

//courses/ class APIs
app.get('/courses', (req, res) => {
    courses.getAll().then((courses) => {
        res.json(courses);
    });
});
 
app.delete('/courses', (req, res) => {
    courses.deleteAll().then((courses) => {
        res.json(courses);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

app.post('/courses', (req, res) => {
    courses.create(req.body).then((courses) => {
        res.json(courses);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

//ratings/ class ratings APIs
app.get('/ratings', (req, res) => {
    ratings.getAll().then((ratings) => {
        res.json(ratings);
    });
});
 
app.delete('/ratings', (req, res) => {
    ratings.deleteAll().then((ratings) => {
        res.json(ratings);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});

app.post('/ratings', (req, res) => {
    ratings.create(req.body).then((ratings) => {
        res.json(ratings);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
});


 
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on localhost: ${port}`);
});