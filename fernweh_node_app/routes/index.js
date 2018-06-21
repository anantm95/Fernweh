var express = require('express');
var router = express.Router();
var path = require('path');

//Mongo connection details
var MongoClient = require('mongodb').MongoClient;
var mongoUri = "mongodb://127.0.0.1:27017/test"

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'group25.cf9su8qyr9ss.us-east-1.rds.amazonaws.com',
  user     : 'group25root',
  password : 'xyzzyspoon',
  database : 'group25db'
});

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});



router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var pwd = req.body.password;

  console.log("Recieved request for login: " + email +  " password " + pwd);

  MongoClient.connect(mongoUri, function(err, db) {

    db.collection('users').findOneAndUpdate({email: email},
                                            {
                                              $setOnInsert: {
                                                "email" : email,
                                                "password" : pwd,
                                                "name" : req.body.name
                                              }
                                            },
                                            {
                                              upsert: true,
                                            },
                                            function(err, result) {
                                              var returnObj = {}
                                              returnObj.email = email;
                                              returnObj.userFound = true;

                                              if(result.lastErrorObject.updatedExisting == false){
                                                  returnObj.userFound = false;
                                                  res.cookie('email',email);
                                              }
                                              res.json(returnObj); 
                                              console.log(returnObj);
                                            }
                                          );
  })

});

router.post('/login', function(req, res, next) { 
  var email = req.body.email;
  var password = req.body.password;

    console.log("Recieved request for login: " + email +  " password " + password);

    MongoClient.connect(mongoUri, function(err, db) {
    
    var cursor = db.collection('users').find({"email": email}).toArray(function(err, result) {
        var returnObj = {}

        if (err) throw err;
        
        console.log(result);

        if(result.length > 0 && email === result[0].email && password === result[0].password) { 
          console.log("User logged in " + email)
          returnObj.userFound = true;
          returnObj.email = email
          res.cookie('email',email);
        }
        else{
          console.log('No user with the email: ' + email + " found")
          returnObj.userFound = false;
        }
        res.json(returnObj); 
        db.close();
      });
  });
  
});

router.post('/logout',function(req, res, next) {
    var email = req.body.email;
    var returnObj = {}
    returnObj.email = email;
    returnObj.loggedOut = true;
    res.clearCookie("email");
    res.json(returnObj); 
})

router.post('/addPlace', function(req, res, next) { 
  var place = req.body.place;
  var email = req.cookies.email;

      console.log("Recieved request to add place");

      MongoClient.connect(mongoUri, function(err, db) {
    
    var cursor = db.collection('users').update({"email": email}, {"$push":{"wishlist":place}}, function(err, result) {
        var returnObj = {}

        if (err) throw err;
        
        console.log(result);

        
        res.json(returnObj); 
        db.close();
      });
  });

});

/* GET user dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/dashboardData', function(req, res, next) {
        console.log('Recieved request for dashData');
  MongoClient.connect(mongoUri, function(err, db) {
    
    console.log('Connecting to mongodb');
    
    var cursor = db.collection('users').find({"email":req.cookies.email}).toArray(function(err, result) {
        if (err) throw err;
          console.log(result);

        var returnObj = {}

        if(result.length > 0) { 
          console.log(result[0]);
          
          returnObj.userFound = true;
          returnObj.email = req.cookies.email;
          returnObj.data = result[0];
        }
      else{
        console.log('No user with the email: ' + req.cookies.email + " found")
        returnObj.userFound = false;

      }
      res.json(returnObj);

 
        db.close();
     
      });
    });


});
/* GET user profile page. */
router.get('/profile', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'profile.html'));
});

router.get('/profileData', function(req, res, next) {
        console.log('Recieved request for profileData');
  MongoClient.connect(mongoUri, function(err, db) {
    
    console.log('Connecting to mongodb');
    var cursor = db.collection('users').find({"email":req.cookies.email}).toArray(function(err, result) {
        if (err) throw err;
          console.log(result);

        var returnObj = {}

        if(result.length > 0) { 
          console.log(result[0]);
          
          returnObj.userFound = true;
          returnObj.email = result[0].email;
          returnObj.data = result[0];
        }
      else{
        console.log('No user with the email: ' + req.cookies.email + " found")
        returnObj.userFound = false;

      }
      res.json(returnObj);

 
        db.close();
     
      });
    });


});




router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});
router.get('/citydetails', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'citydetails.html'));
});
router.get('/questions', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'questions.html'));
})
router.get('/itinerary', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'itinerary.html'));
})

router.get('/data/:email', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var query = 'SELECT * from Person';
  // you may change the query during implementation
  var email = req.params.email;
  if (email != 'undefined') query = query + ' where login ="' + email + '"' ;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

// ----Your implemention of route handler for "Insert a new record" should go here-----
//NIDHI STUFF
router.get('/get_city_data/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  var query = 'SELECT DISTINCT B.city FROM business B';
  var city = req.params.cityname;
  console.log(city)
  //you may change the query during implementation
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        //console.log(rows)
        res.json(rows);
    }
    });
   // res.sendFile(path.join(__dirname, '../', 'views', 'citydetails.html'));
});


// Get Food places
router.get('/fooddetails/data/:cityname', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var query = 'select id, b.name, b.address from business b join category c on b.id= c.business_id';
  

  // you may change the query during implementation
  var cityname = req.params.cityname;
  if (cityname != 'undefined') query = query + ' where b.city= "'+cityname+'" and c.category="food" order by stars desc limit 5' ;
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});
// Get places to see details
router.get('/citydetails/data/:cityname', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var query = 'Select b.name, b.content, b.address from business b join category c on b.id= c.business_id';
  console.log("I am here");
  var latitude=0;
  var longitude=0;
  // you may change the query during implementation
  var cityname = req.params.cityname;
  if (cityname != 'undefined') query = query + ' where b.city= "'+cityname+'" and c.category="see" limit 5' ;
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {

        res.json(rows);

    }  
    });
});

//Get things to do
router.get('/thingsdetails/data/:cityname', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
 var query = 'Select b.name, b.content, b.address from business b join category c on b.id= c.business_id';
  //console.log("I am here");

  // you may change the query during implementation
  var cityname = req.params.cityname;
  if (cityname != 'undefined') query = query + ' where b.city= "'+cityname+'" and c.category="do" limit 5' ;
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});


 // router.post('/questionRoute', function(req, res){
 //        console.log('I am here');
 //        // Questions to ask 
 //        console.log(req.user.foodpref);
 //        console.log(req.user.cuisines);
 //        res.json();
 //    });


router.post('/questionRoute/', function(req,res){


  var foodpref = req.body.foodpref;
  var isgroup = req.body.isgroup;
  var isdrink = req.body.isdrink;

  console.log("foodpref "+foodpref);
  console.log("isgroup"+isgroup);
   var body = {
            "foodpref": foodpref,
            "isgroup": isgroup,
            "isdrink": isdrink          
        }
  res.json(body);
  // console.log("Sex "+req.body.sex);
  // console.log("RelationshipStatus "+req.body.relationshipStatus);
  // console.log("BirthYear "+req.body.birthYear);
  // var query = 'INSERT INTO Person VALUES ("'+req.body.login+'", "'+req.body.name+'",  "'+req.body.sex+'","'+req.body.relationshipStatus+'" , "'+req.body.birthYear+'")';
  // console.log(query)
  //  connection.query(query, function(err, rows, fields) {
  //   if (err) console.log(err);
  //   else {
  //       res.json(rows);
  //   }  
  //   });
 });

router.post('/setdate/', function(req, res) {

     var date = req.body.date;
     MongoClient.connect(mongoUri, function(err, db) {
        console.log("GOT DATEEeeeee" + date)
        console.log("Idondu"+req.body.Itinerary.Places.Breakfast)
        var cursor = db.collection('users').update({"email": req.cookies.email}, {"$push":{"Trips":{"Date":date, "Itinerary":{
          "city":req.body.Itinerary.city, "Places":{"Breakfast":req.body.Itinerary.Places.Breakfast, "See":req.body.Itinerary.Places.See, 
          "Do": req.body.Itinerary.Places.Do, "Lunch": req.body.Itinerary.Places.Lunch, "Dinner":req.body.Itinerary.Places.Dinner, 
          "Drinks":req.body.Itinerary.Places.Drinks}} }}}, function(err, result) {
            var returnObj = {}

            if (err) throw err;
            
            console.log(result);

            res.json(returnObj); 
            db.close();
          });
      });

});

router.post('/breakfast/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var query = 'select distinct id, b.name, stars, latitude, longitude from business b join category c join attribute a on b.id= c.business_id and b.id = a.business_id';
  console.log("I am here");

  // you may change the query during implementation
  var cityname = req.body.cityname;
  var wifi = req.body.wifi;
  var open24= req.body.open24;
  var indian = req.body.indian;
  var chinese= req.body.chinese;
  var thai = req.body.thai;
  var italian = req.body.italian;
  var mexican= req.body.mexican;
  var pizza = req.body.pizza;
  console.log(pizza);

  if (cityname != 'undefined') query = query + ' where b.city= "'+cityname+'" and  c.category="Breakfast & Brunch" ' ;
  if(wifi) query = query + 'and a.name ="WiFi"';
  if(open24) query = query + 'and a.name ="Open24Hours"';
  query = query + ' limit  5';
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
        
    }  
    });

});

router.post('/sightseeing1/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
 console.log("inside person email");
  var cityname = req.body.cityname;
  var lat= req.body.latitude;
  var long = req.body.longitude;
  console.log(req.body);
  //HAVING distance < 5 
 var query = 'Select B.id, name, 0 as distance, stars, latitude, longitude from business B join category C on B.id= C.business_id where B.city ="'+cityname+'" and C.category="see" limit 5';
  

  if (cityname != 'undefined' && lat != '0' && long !=  '0') query = 'Select t1.id, t1.name, t1.stars, 2*3959 * acos(if(d>1, 1, if(d<-1, -1, d))) as distance, t1.latitude, t1.longitude From (SELECT B.id as id, B.name as name, B.stars as stars, cos( radians('+lat+') ) * cos( radians( B.latitude ) ) * cos( radians( B.longitude ) - radians('+long+' ) ) + sin( radians('+lat+') ) * sin(radians(B.latitude)) AS d , B.latitude as latitude , B.longitude as longitude FROM business B join category C on B.id= C.business_id Where C.category="see" and B.city ="'+cityname+'") t1 having distance > 0 ORDER BY distance limit 5' ;


  // you may change the query during implementation
  console.log("Show me what you are sending");
  console.log(query);


  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
        console.log(rows);
    }  
    });

});


router.post('/sightseeing2/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var cityname = req.body.cityname;
  var lat= req.body.latitude;
  var long = req.body.longitude;
  console.log(req.params);
  //HAVING distance < 5 
  var query = 'Select B.id, B.name, 0 as distance, stars, latitude, longitude from business B join category C on B.id= C.business_id where B.city ="'+cityname+'" and C.category="do"';
  

  if (cityname != 'undefined' && lat != '0' && long !=  '0') query =  'Select t1.id, t1.name, t1.stars, 2*3959 * acos(if(d>1, 1, if(d<-1, -1, d))) as distance, t1.latitude, t1.longitude From (SELECT B.id as id, B.name as name, B.stars as stars, cos( radians('+lat+') ) * cos( radians( B.latitude ) ) * cos( radians( B.longitude ) - radians('+long+' ) ) + sin( radians('+lat+') ) * sin(radians(B.latitude)) AS d , B.latitude as latitude , B.longitude as longitude FROM business B join category C on B.id= C.business_id Where C.category="do" and B.city ="'+cityname+'") t1 having distance > 0 ORDER BY distance limit 5' ;
  console.log("Show me what you are queryingg:Sightsee2");
  console.log(query);
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });

});

router.post('/lunch/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  //console.log("inside person email");
  var cityname = req.body.cityname;
  var lat= req.body.latitude;
  var long = req.body.longitude;
  var open24= req.body.open24;
  var wifi = req.body.wifi;
  var indian = req.body.indian;
  var chinese= req.body.chinese;
  var thai = req.body.thai;
  var italian = req.body.italian;
  var mexican= req.body.mexican;
  var pizza = req.body.pizza;
  console.log(req.body);
  //HAVING distance < 5 
  var query = 'Select B.id, B.name, 0 as distance, stars, latitude, longitude from business B join category C join attribute a on B.id= C.business_id and B.id = a.business_id where B.city ="'+cityname+'" and C.category="Restaurants"';
  

  if (cityname != 'undefined' && lat !='undefined' && long != 'undefined') query =  'Select distinct t1.id, t1.name, t1.stars, 2*3959 * acos(if(d>1, 1, if(d<-1, -1, d))) as distance, t1.latitude, t1.longitude From (SELECT B.id as id, B.name as name, B.stars as stars, cos( radians('+lat+') ) * cos( radians( B.latitude ) ) * cos( radians( B.longitude ) - radians('+long+' ) ) + sin( radians('+lat+') ) * sin(radians(B.latitude)) AS d , B.latitude as latitude , B.longitude as longitude FROM business B join category C join attribute a on B.id= C.business_id and a.business_id = B.id Where B.city ="'+cityname+'"' ;
  if(wifi) query = query + ' and a.name ="WiFi"';
  if(open24) query = query + ' and a.name ="Open24Hours"';

console.log("Show me what you are queryingg:Lunch2");
  console.log(query);
  var dict =[];
  dict.push({
    key:   "Indian",
    value: indian
  });
  dict.push({
    key:   "Chinese",
    value: chinese
  });
    dict.push({
    key:   "Thai",
    value: thai
  });
     dict.push({
    key:   "Italian",
    value: italian
  });
   dict.push({
    key:   "Mexican",
    value: mexican
  });
   dict.push({
    key:   "Pizza",
    value: pizza
  });

  if (indian || chinese || thai || italian || mexican || pizza) {
      query = query + 'and ( ';


      //console.log(dict);
      var first = true;
      for (var key in dict) {
      // check if the property/key is defined in the object itself, not in parent
          if (dict.hasOwnProperty(key)) {           
            console.log(key, dict[key].key);
            if (dict[key].value)
            {
              if(first){ 
                first = false;
                query = query + 'C.category = "'+ dict[key].key +'"';
              }
              else {
                query = query + ' or C.category ="'+ dict[key].key +'"';
              }
            }
          }
      }
      query = query + ')';
}
else{
  query = query + 'and C.category="Restaurants"';
}

  query = query + ') t1 having distance > 0 ORDER BY distance limit 5';
console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
        
    }  
    });

});


router.post('/dinner/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var cityname = req.body.cityname;
  var lat= req.body.latitude;
  var long = req.body.longitude;
  var open24= req.body.open24;
  var wifi = req.body.wifi;
  var indian = req.body.indian;
  var chinese= req.body.chinese;
  var thai = req.body.thai;
  var italian = req.body.italian;
  var mexican= req.body.mexican;
  var pizza = req.body.pizza;
  console.log(req.body);
  //HAVING distance < 5 
  var query = 'Select B.id, B.name, 0 as distance, stars, latitude, longitude from business B join category C join attribute a on B.id= C.business_id and B.id = a.business_id where B.city ="'+cityname+'" and C.category="food"';
  

  if (cityname != 'undefined' && lat !='undefined' && long != 'undefined') query =  'Select distinct t1.id, t1.name, t1.stars, 2*3959 * acos(if(d>1, 1, if(d<-1, -1, d))) as distance, t1.latitude, t1.longitude From (SELECT B.id as id, B.name as name, B.stars as stars, cos( radians('+lat+') ) * cos( radians( B.latitude ) ) * cos( radians( B.longitude ) - radians('+long+' ) ) + sin( radians('+lat+') ) * sin(radians(B.latitude)) AS d , B.latitude as latitude , B.longitude as longitude FROM business B join category C join attribute a on B.id= C.business_id and a.business_id = B.id Where B.city ="'+cityname+'"' ;
  if(wifi) query = query + ' and a.name ="WiFi"';
  if(open24) query = query + ' and a.name ="Open24Hours"';

console.log("Show me what you are queryingg:dinner2");
  console.log(query);
  var dict =[];
  dict.push({
    key:   "Indian",
    value: indian
  });
  dict.push({
    key:   "Chinese",
    value: chinese
  });
    dict.push({
    key:   "Thai",
    value: thai
  });
     dict.push({
    key:   "Italian",
    value: italian
  });
   dict.push({
    key:   "Mexican",
    value: mexican
  });
   dict.push({
    key:   "Pizza",
    value: pizza
  });

  if (indian || chinese || thai || italian || mexican || pizza) {
      query = query + 'and ( ';


      //console.log(dict);
      var first = true;
      for (var key in dict) {
      // check if the property/key is defined in the object itself, not in parent
          if (dict.hasOwnProperty(key)) {           
            console.log(key, dict[key].key);
            if (dict[key].value)
            {
              if(first){ 
                first = false;
                query = query + 'C.category = "'+ dict[key].key +'"';
              }
              else {
                query = query + ' or C.category ="'+ dict[key].key +'"';
              }
            }
          }
      }
      query = query + ')';
}
else{
  query = query + 'and C.category="food"';
}

  query = query + ') t1 having distance > 0 ORDER BY distance limit 5';
console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });

});

router.post('/drinks/', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var cityname = req.body.cityname;
  var lat= req.body.latitude;
  var long = req.body.longitude;
  console.log(req.params);
  //HAVING distance < 5 
  var query = 'Select B.id, B.name, 0 as distance, latitude, longitude from business B join category C on B.id= C.business_id where B.city ="'+cityname+'" and C.category="Nightlife"';
  //console.log("I am here");

  // you may change the query during implementation
  
  if (cityname != 'undefined' && lat !=  'undefined' && long != 'undefined') query = 'Select t1.id, t1.name, t1.stars, 2*3959 * acos(if(d>1, 1, if(d<-1, -1, d))) as distance, t1.latitude, t1.longitude From (SELECT B.id as id, B.name as name, B.stars as stars, cos( radians('+lat+') ) * cos( radians( B.latitude ) ) * cos( radians( B.longitude ) - radians('+long+' ) ) + sin( radians('+lat+') ) * sin(radians(B.latitude)) AS d , B.latitude as latitude , B.longitude as longitude FROM business B join category C on B.id= C.business_id Where C.category="Nightlife" and B.city ="'+cityname+'") t1 having distance >0 ORDER BY distance limit 5' ;
  console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
        
    }  
    });

});



module.exports = router;