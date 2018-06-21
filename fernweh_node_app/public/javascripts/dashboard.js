//var app = angular.module('fernweh',['ngCookies']);
app.controller('dashboardController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {
        $scope.message="";
        
        var request = $http.get('/dashboardData');
        request.success(function(data) {
            $scope.data = data;

        });



        request.error(function(data){
            console.log('err');    
    }); 

    $scope.checkDate = function(date) {
        
        var now = new Date();
        console.log(new Date(date))
        if( (new Date(date) >= now))
        {   
            return true;
        }
        return false;
      };


}]);

