var app = angular.module('fernweh',['ngCookies','ngMaterial', "ngAnimate","ngAria", 'ngMessages']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('red')
      .primaryPalette('red');

    $mdThemingProvider.theme('blue')
      .primaryPalette('blue');

})


app.controller('indexController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {
        $scope.selected = null;
        $scope.theme = 'blue';

        //$scope.cities = [];
        var request = $http.get('/get_city_data/');

        console.log(request)
        request.success(function(data) {
            $scope.cities = data;
            console.log($scope.cities);
            // Setting a cookie

        });
        request.error(function(data){
            console.log('err');
        });


        $scope.Submit = function() {
        
        $cookies.put('cityname', $scope.selected);
        var cityname = $cookies.get('cityname');
        console.log(cityname);

        $window.location.href = '/citydetails';

      };

}]);



app.controller('loginController', ['$scope', '$mdDialog','$http', '$cookies','$window', function($scope, $mdDialog,$http,$cookies, $window) {
    $scope.theme = 'blue';

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

    $scope.showDaialog = function(ev,templateId) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: templateId,
          parent: angular.element(document.body),
          targetEvent: ev,
          scope: $scope,
          preserveScope: true,

          clickOutsideToClose:true
        });
    }

    $scope.logout = function(){
        var reqObj  = {}
        reqObj.email = $cookies.get('email');

        var request = $http.post('/logout',reqObj);
            request.success(function(data) {
                if(data.loggedOut){
                    $scope.isLoggedOut = true;
                    $window.location.href = '/';

                }
            });
            request.error(function(data){
                console.log('err');
            });

    }

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.signup = function() {
            var reqObj  = {}

            reqObj.email = $scope.email;
            reqObj.password = $scope.password;
            reqObj.name = $scope.fullname;


            var request = $http.post('/register',reqObj);
            request.success(function(data) {
                if(!data.userFound){
                    $scope.isLoggedOut = false
                    $scope.hide()
                }
                else{
                    console.log("User already exists")
                }
                
            });
            request.error(function(data){
                console.log('err');
            });
        }

        $scope.login = function() {



            var reqObj  = {}
            reqObj.email = $scope.email;
            reqObj.password = $scope.password;

            var request = $http.post('/login',reqObj);
            request.success(function(data) {
                if(data.userFound){
                    $scope.isLoggedOut = false
                    $scope.hide()
                }
                else{
                    console.log("User not found")
                }

            });
            request.error(function(data){
                console.log('err');
            });
        }    
    }


    


}]);




