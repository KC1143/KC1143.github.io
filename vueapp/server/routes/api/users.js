const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();


//Get Post
router.get('/', async (req, res) => {
    const users = await loadUserCollection();
    res.send(await users.find({}).toArray());
});

//Add Post
router.post('/', async (req, res) => {
    const users = await loadUserCollection();
    await users.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});


//Delete Post
router.delete('/:id', async (req, res) => {
    const users = await loadUserCollection();
    await users.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    res.status(200).send();
});

async function loadUserCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://admin:admin123@vueapp-zn7bh.mongodb.net/vueApp', {
        useNewUrlParser: true
    });

    return client.db('vueApp').collection('users');
}


module.exports = router;

