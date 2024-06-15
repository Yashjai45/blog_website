const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./models/Post');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.render('home', { posts: posts });
        }
    });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });

    post.save((err) => {
        if (!err) {
            res.redirect('/');
        }
    });
});

app.get('/posts/:postId', (req, res) => {
    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, (err, post) => {
        if (!err) {
            res.render('post', {
                title: post.title,
                content: post.content
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
