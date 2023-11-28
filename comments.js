// Create web server to handle comments
// GET, POST, PUT, DELETE

// Import express
const express = require('express');
const commentsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Import body-parser
const bodyParser = require('body-parser');
commentsRouter.use(bodyParser.json());

// Get all comments
commentsRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Comment WHERE is_deleted = 0 AND issue_id = $issueId', {
        $issueId: req.issue.id
    }, (err, comments) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({comments: comments});
        }
    });
});

// Check if comment with id exists
commentsRouter.param('commentId', (req, res, next, commentId) => {
    db.get('SELECT * FROM Comment WHERE id = $commentId AND issue_id = $issueId', {
        $commentId: commentId,
        $issueId: req.issue.id
    }, (err, comment) => {
        if (err) {
            next(err);
        } else if (comment) {
            req.comment = comment;
            next();
        } else {
            res.status(404).send();
        }
    });
});

// Get a comment with id
commentsRouter.get('/:commentId', (req, res, next) => {
    res.status(200).json({comment: req.comment});
});

// Create a new comment
commentsRouter.post('/', (req, res, next) => {
    const content = req.body.comment.content;
    const isDeleted = req.body.comment.isDeleted === 0 ? 0 : 1;
    const issueId = req.issue.id;
    if (!content) {
        res.status(400).send();
    } else {
        db.run('INSERT INTO Comment (content, is_deleted, issue_id) VALUES ($content, $isDeleted, $issueId)', {
            $content: content,
            $isDeleted: isDeleted,
            $issueId: issueId
        }, function(err) {
            if (err) {
                next(err);
            } else {
                db.get('SELECT * FROM Comment WHERE id = $commentId', {
                    $commentId: this.lastID
                }, (err, comment