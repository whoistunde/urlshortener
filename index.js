const express = require("express");
const mysql = require("mysql2");
const shortid = require("shortid");

const app = express();

app.use(express.static("public"));
app.use(express.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password=password",
    database: "shorturls"
});
connection.connect((err) => {
    if (!err) {
        console.log('Database connected');
    } else {
        console.log('Database connection failed \n Error : '+ JSON.stringify(err, undefined, 2));
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});

app.post("/api/create-short-url", (req, res) => {
    let uniqueID = shortid.generate();
    console.log(uniqueID);
    let sql = `INSERT INTO links(longurl, shorturlid) VALUES('${req.body.longurl}', '${uniqueID}')`;
    connection.query(sql, (err, result) => {
        if(err){
            res.status(500).json({
                status: "not ok",
                message: "Something went wrong \n Error:" + JSON.stringify(err, undefined, 2)
            });
        } else {
            res.status(200).json({
                status: "ok",
                shorturlid:uniqueID
            });
        }
    });
});

app.get("/api/get-all-short-urls", (req, res) => {
    let sql = `SELECT * FROM links`;
    connection.query(sql, (err, result) => {
        if(err){
            res.status(500).json({
                status: "not ok",
                message: "Something went wrong \n Error:" + JSON.stringify(err, undefined, 2)
            });
        } else {
            res.status(200).json(result);
        }
    })
});

app.get("/:shorturlid", (req, res) => {
    let shorturlid = req.params.shorturlid;
    let sql = `SELECT * FROM links WHERE shorturlid = '${shorturlid}' LIMIT 1`;
    connection.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({
                status: "not ok",
                message: "Something went wrong \n Error:" + JSON.stringify(err, undefined, 2)
            });
        } else {
            sql = `UPDATE links SET count = ${result[0].count+1} WHERE id='${result[0].id}' LIMIT 1`;
            connection.query(sql, (err, result2) => {
                if(err) {
                    res.status(500).json({
                        status: "not ok",
                        message: "Something went wrong \n Error:" + JSON.stringify(err, undefined, 2)
                    });
                } else {
                    res.redirect(result[0].longurl);
                }
            })
        }
    })
});

app.listen(5000, () => {
    console.log('listening...')
});