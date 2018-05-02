var mysql = require('mysql');
var db = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT first_name, last_name, resume_name FROM resume JOIN account ON resume.account_id = account.account_id ORDER BY first_name;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.selectUser = function(callback) {
    var query = 'SELECT * FROM account';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getInfo = function(account_id, callback) {
    var query = 'CALL resume_getinfo(?);';
    var queryData = [account_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (resume_name, account_id) VALUES (?, ?)';
    var queryData = [params.resume_name, params.account_id];

    connection.query(query, queryData, function(err, result) {
        if(err) {
            console.log(err);
            callback(err, result);
        } else {
            // If the company was successfully inserted,
            // then the auto generated company_id value will be stored
            // in the result.insertId property. We will use that to
            // then insert records into the company_address table
            var resume_id = result.insertId;

            // Notice that there is only one question mark after
            // values instead of (?, ?)
            var query = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';

            // create a multidimensional array of the values
            var resumeCompanyData = [];

            // if the user only selected one address
            // and its id is 10 or greater JavaScript will treat the
            // number as a string array i.e. ['1', '0']. We have this
            // if/else check to handle that problem
            if (params.company_id.constructor === Array) {
                // first we check if its an array of values
                for (var i = 0; i < params.company_id.length; i++) {
                    resumeCompanyData.push([resume_id, params.company_id[i]]);
                }
            }
            else {
                resumeCompanyData.push([resume_id, params.company_id]);
            }
            // Notice the extra [] around companyAddressData.
            // This is different from inserting one record
            // at a time like we did for company
            connection.query(query, [resumeCompanyData],
                function (err, result) {
                    if(err) {
                        console.log(err);
                        callback(err, result);
                    } else {
                        // If the company was successfully inserted,
                        // then the auto generated company_id value will be stored
                        // in the result.insertId property. We will use that to
                        // then insert records into the company_address table
                        //var resume_id = result.insertId;

                        // Notice that there is only one question mark after
                        // values instead of (?, ?)
                        var query = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

                        // create a multidimensional array of the values
                        var resumeSchoolData = [];

                        // if the user only selected one address
                        // and its id is 10 or greater JavaScript will treat the
                        // number as a string array i.e. ['1', '0']. We have this
                        // if/else check to handle that problem
                        if (params.school_id.constructor === Array) {
                            // first we check if its an array of values
                            for (var i = 0; i < params.school_id.length; i++) {
                                resumeSchoolData.push([resume_id, params.school_id[i]]);
                            }
                        }
                        else {
                            resumeSchoolData.push([resume_id, params.school_id]);
                        }
                        // Notice the extra [] around companyAddressData.
                        // This is different from inserting one record
                        // at a time like we did for company
                        connection.query(query, [resumeSchoolData],
                            function (err, result) {
                                if(err) {
                                    console.log(err);
                                    callback(err, result);
                                } else {
                                    // If the company was successfully inserted,
                                    // then the auto generated company_id value will be stored
                                    // in the result.insertId property. We will use that to
                                    // then insert records into the company_address table
                                    //var resume_id = result.insertId;

                                    // Notice that there is only one question mark after
                                    // values instead of (?, ?)
                                    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

                                    // create a multidimensional array of the values
                                    var resumeSkillData = [];

                                    // if the user only selected one address
                                    // and its id is 10 or greater JavaScript will treat the
                                    // number as a string array i.e. ['1', '0']. We have this
                                    // if/else check to handle that problem
                                    if (params.skill_id.constructor === Array) {
                                        // first we check if its an array of values
                                        for (var i = 0; i < params.skill_id.length; i++) {
                                            resumeSkillData.push([resume_id, params.skill_id[i]]);
                                        }
                                    }
                                    else {
                                        resumeSkillData.push([resume_id, params.skill_id]);
                                    }
                                    // Notice the extra [] around companyAddressData.
                                    // This is different from inserting one record
                                    // at a time like we did for company
                                    connection.query(query, [resumeSkillData],
                                        function (err, result) {
                                            callback(err, result);
                                        });
                                }
                            });
                    }
                });
        }

    });
};