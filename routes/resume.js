var express = require('express');
var router = express.Router();
var resume_dal = require('../dal/resume_dal');


/* GET users listing. */
router.get('/all', function(req, res, next) {
    resume_dal.getAll(function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(result);
            res.render('resume/resume_view_all', {resumes: result});
        }
    })
});

router.get('/add/selectuser', function(req, res, next) {
    resume_dal.selectUser(function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(result);
            res.render('resume/resume_selectuser', {users: result});
        }
    })
});

router.get('/add', function(req, res, next) {
    resume_dal.getInfo(req.query.account_id, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(result);
            res.render('resume/resume_add', {account_id: req.query.account_id,
                                             skills: result[0],
                                             schools: result[1],
                                             companies: result[2]});
        }
    })
});

router.get('/insert', function(req, res) {
    resume_dal.insert(req.query, function(err, result) {
        if(err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.redirect(302, '/resume/all');
        }
    });
});



module.exports = router;