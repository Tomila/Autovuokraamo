let express = require('express');
let app = express();

const cors = require('cors');
let mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "car_rent"
});
let url = require("url");


//

// For file upload

const path = require('path');
const util = require('util');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET!!');
})

app.get('/api/location/:name', cors(), async function (req, res, url) {
    let sql = "SELECT * FROM location WHERE Location_name = '" + req.params.name + "' GROUP BY Location_name ";
    let db = makeDb();
    let result;
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
        });
    } catch (err) {
        console.log(err);
    }
    res.send(result);
});

// -------------------------------------- cars------------------

// app.get('/api/cars', cors(), async function (req, res) {
//     let q = url.parse(req.url, true).query;
//     let startDate = q.start;
//     let endDate = q.end;
//
//     let db = makeDb();
//     let sql = "SELECT vehicle.Vehicle_type, vehicle.Vehicle_model, vehicle.Reg_number, vehicle.Vehicle_descr, vehicle.Vehicle_src"
//         + " FROM vehicle"
//         + " WHERE vehicle.ordered = 'N'"
//         + " ORDER BY vehicle.Vehicle_type";
//     let result;
//     try {
//         await makeTransaction(db, async () => {
//             result = await db.query(sql);
//         });
//     } catch (err) {
//         console.log(err);
//     }
//     res.send(result);
// })

//Vapaat autot tietyllä aikavälillä
app.get('/api/cars', cors(), async function (req, res) {
    let q = url.parse(req.url, true).query;
    let startDate = q.from;
    let endDate = q.to;
    let type = q.type;

    let sql = "SELECT vehicle.Vehicle_id, Vehicle_type, Vehicle_model, Reg_number, Vehicle_descr, Vehicle_src, Price FROM vehicle, `order`" +
        " WHERE vehicle.Vehicle_id = order.Vehicle_id AND Vehicle_type = '" + type + "' AND order.Order_end <= '" + startDate +
        "' OR vehicle.Vehicle_id = order.Vehicle_id AND order.Order_start >= '" + endDate + "' " +
        "AND Vehicle_type = '" + type + "' OR NOT vehicle.Vehicle_id = order.Vehicle_id AND Vehicle_type = '" + type + "'" + //jos ajoneuvoa ei ole tilattu ollenkaan
        " GROUP BY Vehicle_Model " +
        "ORDER BY Vehicle_model ";

    let result;
    let db = makeDb();
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
        });
    } catch (err) {
        console.log(err);
    }
    res.send(result);
})

// Yksittäisen ajoneuvon tiedot id:lla
app.get('/api/car/:id', cors(), async function (req, res, url) {
    let sql = "SELECT vehicle.Vehicle_id, Vehicle_type, Vehicle_model, Reg_number, Vehicle_descr, Vehicle_src, Price FROM vehicle WHERE vehicle.Vehicle_id = '" + req.params.id + "' GROUP BY Vehicle_type ";
    let db = makeDb();
    let result;
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
        });
    } catch (err) {
        console.log(err);
    }
    res.send(result);
});

app.post('/api/orders/', async function (req, res, url) {
    let json = JSON.stringify(req.body);
    let jsonLength = Object.keys(json).length;
    if (jsonLength > 0) {
        try {
            let sql = "INSERT INTO `orders` (Personal_id, First_name, Last_name, Email, Phone_Number, Home_address," +
                "City,Postal_code,Additional_info,Payment,Vehicle_id, Date_create, Order_start, Order_end, Amount)"+
                "SELECT *" +
                " FROM JSON_TABLE ('" + json + "', '$' COLUMNS ( " +
                "Personal_id         VARCHAR(11)     PATH '$[0].Personal_id', " +
                "First_name          VARCHAR(45)     PATH '$[0].First_name', " +
                "Last_name           VARCHAR(45)     PATH '$[0].Last_name', " +
                "Email               VARCHAR(45)     PATH '$[0].Email', " +
                "Phone_Number        VARCHAR(13)     PATH '$[0].Phone_Number', " +
                "Home_address        VARCHAR(50)     PATH '$[0].Home_address', " +
                "City                VARCHAR(50)     PATH '$[0].City', " +
                "Postal_code         int(5)          PATH '$[0].Postal_code', " +
                "Additional_info	 TEXT 		     PATH '$[0].Additional_info', " +
                "Payment             VARCHAR(50)     PATH '$[0].Payment', " +
                "Vehicle_id          INT(11)         PATH '$[0].Vehicle_id'," +
                "Date_create         datetime        PATH '$[0].Date_create', " +
                "Order_start         datetime        PATH '$[0].Order_start', " +
                "Order_end           datetime        PATH '$[0].Order_end', " +
                "Amount              DECIMAL(10,2)   PATH '$[0].Amount')) AS 'order';"
            await insertValues(sql);
            res.status(200);
            res.send();
        } catch (e) {
            console.log(e);
            res.status(505);
            res.send('error');
        }
    }
})

// --------------------------------------------------------------

app.get('/api/events', cors(), async function (req, res) {
    let q = url.parse(req.url, true).query;
    let startDate = q.start;
    let endDate = q.end;

    let db = makeDb();
    let sql = "SELECT event_date.Date, event.Name, event.Type, Location.Location_name"
        + " FROM event_date, event, location"
        + " WHERE event_date.Event_id = event.Event_id and event.Location_Location_id = Location.Location_id"
        + " AND event_date.Date >= '" + startDate + "' and event_date.Date <= '" + endDate + "'"
        + " GROUP BY Name"
        + " ORDER BY event_date.Date";
    let result;
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
        });
    } catch (err) {
        console.log(err);
    }
    res.send(result);
})

// Lomake
app.get('/events', cors(), function (req, res) {
    res.sendFile(path.join(__dirname + '/listofevents.html'));
})


app.post('/api/events', cors(), async function (req, res, url) {
    console.log(req.body);
    let result;
    let eventId;
    let locationId = req.body.Location_Location_id;
    // Insert new location if needed
    if (req.body.Location_Location_id === '') {
        console.log(req.body.Location_Location_id);
        let sql = "INSERT INTO location (Location_name, Street_address, City, Zip, Country)"
            + " VALUES ('" + req.body.Location_name + "', '" + req.body.Street_address + "', '" + req.body.City + "', '" + req.body.Zip + "', '" + req.body.Country + "')";

        let db = makeDb();
        try {
            await makeTransaction(db, async () => {
                result = await db.query(sql);
                locationId = result.insertId; // Id of inserted location
                //console.log(result.insertId);
            });
        } catch (err) {
            console.log(err);
        }

    }
    // Update event
    let sql = "INSERT INTO event (Name, Type, Location_Location_id)"
        + " VALUES ('" + req.body.Name + "', '" + req.body.Type + "', '" + locationId + "')";

    let db = makeDb();
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
            eventId = result.insertId; // Id of inserted event
            //console.log(result.insertId);
        });
    } catch (err) {
        console.log(err);
    }

    // Update event_date
    sql = "INSERT INTO event_date (Date, Event_id)"
        + " VALUES ('" + req.body.Date + "', '" + eventId + "')";

    db = makeDb();
    try {
        await makeTransaction(db, async () => {
            result = await db.query(sql);
            //console.log(result.insertId);
        });
    } catch (err) {
        console.log(err);
    }
    res.send('Database updated!');
})


// This responds a POST request for the homepage
app.post('/', function (req, res) {
    var num = req.body.value
    console.log(num)
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
    console.log("Got a GET request for /list_user");
    res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function (req, res) {
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

function makeDb() {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123",
        database: "car_rent"
    });
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    };
}

async function makeTransaction(db, callback) {
    try {
        await db.beginTransaction();
        await callback();
        await db.commit();
    } catch (err) {
        await db.rollback();
        throw err;
    } finally {
        await db.close();
    }
}

async function insertValues(sql) {
    await connection.query(sql, function (err, result) {
        if (err) return false;
        console.log('Lisätty');
        return true;
    });
}