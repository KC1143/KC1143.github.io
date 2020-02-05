const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();


//Get Post
router.get('/', async (req,res) => {
    const courses = await loadCoursesCollection();
    res.send(await courses.find({}).toArray());
});

//Add Post
router.post('/', async (req, res) => {
    const courses = await loadCoursesCollection();
    await courses.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send();
});


//Delete Post
router.delete('/:id', async (req, res) => {
    const courses = await loadCoursesCollection();
    await courses.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadCoursesCollection(){
    const client = await mongodb.MongoClient.connect('mongodb+srv://admin:admin123@vueapp-zn7bh.mongodb.net/vueApp', {
        useNewUrlParser:true
    });

    return client.db('vueApp').collection('courses');
}


module.exports = router;

