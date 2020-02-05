const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


const users = require('./routes/api/users');
app.use('/api/users', users);

const courses = require('./routes/api/courses');
app.use('/api/courses', courses);

// Handle production

if(process.env.NODE_ENV === 'production'){
    // static folder
    app.use(express.static(__dirname + '/public/'));

    // Handle Single Page App(SPA)
    app.get(/.*/, (req, res) => res.sendFile(__dirname + 'public/index.html')); //   "   /.*/   " will refer to any route 
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

