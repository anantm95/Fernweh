//var app = angular.module('fernweh',['ngCookies']);
app.controller('myController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
        var request = $http.get('/data/'+$scope.email);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});



// Connection URL


app.controller('cityController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {
        $scope.message="";
        $scope.cityname = $cookies.get('cityname');
        var loggedinUser = $cookies.get('email');
        
        if(loggedinUser){
            $scope.isLoggedOut = false
            console.log(loggedinUser)
            console.log("login found")
        }
        else{
            $scope.isLoggedOut = true
            console.log("No login found")
        }

        var request = $http.get('/fooddetails/data/'+$scope.cityname);
        request.success(function(data) {
            $scope.food = data;
            console.log(data);
        });
        request.error(function(data){
            console.log('err');
        });

        var request1 = $http.get('/citydetails/data/'+$scope.cityname);
        request1.success(function(data) {
            $scope.places = data;
            console.log(data)
        });
        request1.error(function(data){
            console.log('err');
        });
        
        var request2 = $http.get('/thingsdetails/data/'+$scope.cityname);
        request2.success(function(data) {
            $scope.things = data;
            console.log(data)
        });
        request2.error(function(data){
            console.log('err');
        });

        $scope.Back = function() {
        
            $window.location.href = '/';
      };

        $scope.Done = function() {
        
            $window.location.href = '/questions';
      };

}]);

app.controller('questionController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {
        
        $scope.Submit = function() {
        
        var body = {
            "foodpref": $scope.foodpref,
            "isgroup": $scope.isgroup,
            "isdrink": $scope.isdrink
            
        }
        console.log("Body "+JSON.stringify(body));
        $http({
          method: 'POST',
          url: '/questionRoute/',
          data: body
        }).then(function successCallback(response) {
            console.log('Success');
          }, function errorCallback(response) {
            console.log('err');
          });

        $cookies.put('isdrink', $scope.isdrink);
        $window.location.href = '/itinerary';
      };

}]);

app.controller('tripController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {
        // Get query results 
        var cityname = $cookies.get('cityname');
        var isdrink = $cookies.get('isdrink');

        $scope.latitude=3.0;
        var a = 1;
        $scope.longitude=0.0;
        var global_body = {};
        $scope.selected_breakfast = null;
        $scope.selected_sightsee1 = null;
        $scope.selected_lunch = null;
        $scope.selected_sightsee2 = null;
        $scope.selected_dinner = null;
        $scope.selected_drinks = null;
        $scope.freewifi = false;
        $scope.open24 = false;
        $scope.chinese = false;
        $scope.indian = false;
        $scope.italian = false;
        $scope.mexican = false;
        $scope.thai=false;
        $scope.pizza = false;
        //console.log($scope.freewifi);
        var body =  {"cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
        var request1 = $http({
                    url: '/breakfast/', 
                    method: "POST",
                    data: body
                 });

        request1.success(function(data) {
            $scope.breakfast= data;
            global_body['breakfast_data'] = data[0];
            lat=data[0].latitude;
            long=data[0].longitude;
            var latitude = lat;
            console.log(data[0].stars)
            var longitude = long;
            var body =  {"latitude": lat, "longitude": long, "cityname": cityname,  "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
            var request2 = $http({
                    url: '/sightseeing1/', 
                    method: "POST",
                    data: body
                 });
            
            request2.success(function(data) {
                console.log('Hurrayy');
                $scope.sightsee1 = data;
                console.log(data);
                global_body['sightsee1_data'] = data[0];
                if(data[0].latitude !='undefined'){
                    latitude =data[0].latitude;
                    longitude = data[0].longitude;
                }
                var body1=  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                console.log(body1);
                console.log(data[0].stars)
                var request3 = $http({
                    url: '/lunch/', 
                    method: "POST",
                    data: body1
                 });
                    
                   request3.success(function(data1) {

                    $scope.lunch = data1;
                    global_body['lunch_data'] = data1[0];

                   if(data[0].latitude !=0){
                        latitude =data[0].latitude;
                        longitude = data[0].longitude;
                    }
                    var body2 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                   console.log("Lunch to sightsee2");
                    console.log(body2);
                    console.log(data[0].stars)
                    var request4 =  $http({
                    url: '/sightseeing2/', 
                    method: "POST",
                    data: body2
                 });
                    request4.success(function(data) {
                        $scope.sightsee2 = data;
                        global_body['sightsee2_data'] = data[0];
                        console.log(data[0]);
                        if(data[0] != 'undefined'){
                            latitude =data[0].latitude;
                            longitude = data[0].longitude;
                        }
                        var body3 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname,  "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                        var request5 =  $http({
                            url: '/dinner/', 
                            method: "POST",
                            data: body3
                        });
                        request5.success(function(data) {
                            $scope.dinner = data;
                            global_body['dinner_data'] = data[0];
                            if(data[0].latitude !='undefined'){
                                latitude =data[0].latitude;
                                longitude = data[0].longitude;
                            }

                            console.log(JSON.stringify(body));
                            var body4 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                            var request6 =  $http({
                                url: '/drinks/', 
                                method: "POST",
                                data: body4
                            });
                                request6.success(function(data) {
                                $scope.drinks = data;
                                global_body['drinks_data'] = data[0];
                                console.log(data);

                                document.getElementById("hiding").style.display = "block";
                                document.getElementById("loading").style.display = "none";
                            });
                            request6.error(function(data){
                                console.log('err');
                            });

                        });
                        request5.error(function(data){
                            console.log('err');
                        });


                    });
                    request4.error(function(data){
                        console.log('err');
                    });



                });
                request3.error(function(data1){
                    console.log('err');
                });

            });
            request2.error(function(data){
                console.log('err');
            });
           
        });
        request1.error(function(data){
            console.log('err');
        });
    
        
        // Update function
       
        $scope.Update = function() {
        console.log("test global body");
        console.log(global_body);
        var body = {

            "selected_breakfast": global_body['breakfast_data'],
            "selected_sightsee1": global_body['sightsee1_data'],
            "selected_sightsee2": global_body['sightsee2_data'],
            "selected_lunch": global_body['lunch_data'],
            "selected_dinner": global_body['dinner_data'],
            "selected_drinks": global_body['drinks_data']
            //"selected_sightsee1": $scope.global_data.sightsee1_data[0],
        }

        if ($scope.selected_breakfast != null)
            body['selected_breakfast'] = $scope.selected_breakfast;
            global_body['selected_breakfast'] = $scope.selected_breakfast;
            
        if ($scope.selected_sightsee1 != null)
            body['selected_sightsee1'] = $scope.selected_sightsee1;
            global_body['selected_sightsee1'] = $scope.selected_sightsee1;
        if ($scope.selected_sightsee2 != null)
            body['selected_sightsee2'] = $scope.selected_sightsee2;
            global_body['selected_sightsee2'] = $scope.selected_sightsee2;
        if ($scope.selected_lunch != null)
            body['selected_lunch'] = $scope.selected_lunch;
            global_body['selected_lunch'] = $scope.selected_lunch;
        if ($scope.selected_dinner != null)
            body['selected_dinner'] = $scope.selected_dinner;
            global_body['selected_dinner'] = $scope.selected_dinner;
        if ($scope.selected_drinks != null)
            body['selected_drinks'] = $scope.selected_drinks;
            global_body['selected_drinks'] = $scope.selected_drinks;

        console.log($scope.freewifi);
        for (var i = 0; i < 5; i++) {
            if ($scope.breakfast[i] == body['selected_breakfast'])
                $scope.breakfast[i] = $scope.breakfast[0];
            if ($scope.sightsee1[i] == body['selected_sightsee1'])
                $scope.sightsee1[i] = $scope.sightsee1[0];
            if ($scope.sightsee2[i] == body['selected_sightsee2'])
                $scope.sightsee2[i] = $scope.sightsee2[0];
            if ($scope.lunch[i] == body['selected_lunch'])
                $scope.lunch[i] = $scope.lunch[0];
            if ($scope.dinner[i] == body['selected_dinner'])
                $scope.dinner[i] = $scope.dinner[0];
            if ($scope.drinks[i] == body['selected_drinks'])
                $scope.drinks[i] = $scope.drinks[0];
        }

        $scope.breakfast[0] = body['selected_breakfast'];
        $scope.sightsee1[0] = body['selected_sightsee1'];
        $scope.sightsee2[0] = body['selected_sightsee2'];
        $scope.lunch[0] = body['selected_lunch'];
        $scope.dinner[0] = body['selected_dinner'];
        $scope.drinks[0] = body['selected_drinks'];
    
      };

      $scope.Confirm= function() {
            console.log($scope.TripDate);

            
            if($scope.TripDate == undefined){
                var dateObj = new Date();
            }
            else
                var dateObj = $scope.TripDate;

            console.log(dateObj);
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            newdate = month + "-" + day + "-" + year;

            var breakfast = global_body['breakfast_data'].name;
            var lunch = global_body['lunch_data'].name;
            var dinner = global_body['dinner_data'].name;
            var see = global_body['sightsee1_data'].name;
            var doing = global_body['sightsee2_data'].name;
            var drinks = global_body['drinks_data'].name;

             if ($scope.selected_breakfast != null)
                breakfast = $scope.selected_breakfast.name;
            
            if ($scope.selected_sightsee1 != null)   
                see = $scope.selected_sightsee1.name;

            if ($scope.selected_sightsee2 != null)
                doing = $scope.selected_sightsee2.name;
            
            if ($scope.selected_lunch != null)
                lunch = $scope.selected_lunch.name;
                
            if ($scope.selected_dinner != null)
                dinner = $scope.selected_dinner.name;

            if ($scope.selected_drinks != null)
                drinks = $scope.selected_drinks.name;
               
             var requestforDate =  $http({
                                url: '/setdate/', 
                                method: "POST",
                                data: {"date" : newdate, "Itinerary": {"city":cityname, "Places":{"Breakfast":breakfast ,
                                 "Lunch": lunch, "See": see, "Do": doing, 
                                 "Dinner": dinner, "Drinks":drinks}}}
                                // , {"Itinerary": {"city":cityname, "Places":{"Breakfast": , "Lunch", "See", "Do", "Dinner", "Drinks"}}}
                            });
         };

      $scope.Filter = function() {

        var body =  {"cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
        var request1 = $http({
                    url: '/breakfast/', 
                    method: "POST",
                    data: body
                 });

         request1.success(function(data) {
            $scope.breakfast= data;
            global_body['breakfast_data'] = data[0];
            lat=data[0].latitude;
            long=data[0].longitude;
            var latitude = lat;
            var longitude = long;
            var body =  {"latitude": lat, "longitude": long, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
            var request2 = $http({
                    url: '/sightseeing1/', 
                    method: "POST",
                    data: body
                 });
            
            request2.success(function(data) {
                console.log('Hurrayy');
                $scope.sightsee1 = data;
                console.log(data);
                global_body['sightsee1_data'] = data[0];
                if(data[0].latitude !='undefined'){
                        latitude =data[0].latitude;
                        longitude = data[0].longitude;
                }
                console.log($scope.open24);
                var body1 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                console.log(body1);
                var request3 = $http({
                    url: '/lunch/', 
                    method: "POST",
                    data: body1
                 });
                    
                   request3.success(function(data1) {

                    $scope.lunch = data1;
                    global_body['lunch_data'] = data1[0];
                    if(data[0].latitude !='undefined'){
                        latitude =data[0].latitude;
                        longitude = data[0].longitude;
                    }
                    var body2 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                    var request4 =  $http({
                    url: '/sightseeing2/', 
                    method: "POST",
                    data: body2
                 });
                    request4.success(function(data) {
                        $scope.sightsee2 = data;
                        global_body['sightsee2_data'] = data[0];
                        if(data[0].latitude !='undefined'){
                                latitude =data[0].latitude;
                                longitude = data[0].longitude;
                        }
                        var body3 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname, "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                        var request5 =  $http({
                            url: '/dinner/', 
                            method: "POST",
                            data: body3
                        });
                        request5.success(function(data) {
                            $scope.dinner = data;
                            global_body['dinner_data'] = data[0];
                            if(data[0].latitude !='undefined'){
                                latitude =data[0].latitude;
                                longitude = data[0].longitude;
                            }
                            console.log("chutiya breakfast");
                            console.log(JSON.stringify(body));
                            var body4 =  {"latitude": latitude, "longitude": longitude, "cityname": cityname,  "wifi":$scope.freewifi, "open24": $scope.open24, "chinese":$scope.chinese, "indian":$scope.indian, "italian":$scope.italian, "mexican":$scope.mexican, "thai":$scope.thai,"pizza":$scope.pizza};
                            if(isdrink == "Yes"){
                                var request6 =  $http({
                                    url: '/drinks/', 
                                    method: "POST",
                                    data: body4
                            });
                                request6.success(function(data) {
                                $scope.drinks = data;
                                global_body['drinks_data'] = data[0];
                                console.log(data);
                            });
                            request6.error(function(data){
                                console.log('err');
                            });
                        }
                        else{
                             $scope.drinks = null;
                             global_body['drinks_data'] = null;
                        }


                        });
                        request5.error(function(data){
                            console.log('err');
                        });


                    });
                    request4.error(function(data){
                        console.log('err');
                    });



                });
                request3.error(function(data1){
                    console.log('err');
                });

            });
            request2.error(function(data){
                console.log('err');
            });
           
        });
        request1.error(function(data){
            console.log('err');
        });
    

      };

      $scope.checkDrink = function() {
        var issdrink = $cookies.get('isdrink');
        if (issdrink == 'Yes') {
            return true;
        }
            return false;
      };


}]);
