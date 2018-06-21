//var app = angular.module('fernweh',['ngCookies']);
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('red')
      .primaryPalette('red');

    $mdThemingProvider.theme('blue')
      .primaryPalette('blue');

})

app.controller('profileController',['$scope', '$mdDialog', '$http', '$cookies', function($scope, $mdDialog, $http, $cookies) {
        $scope.message="";

        console.log("Setting scope");
        
        var request = $http.get('/profileData');
        request.success(function(data) {
            $scope.data = data;
           console.log(data);
        });
        request.error(function(data){
            console.log('err');    
    }); 
    $scope.checkDate = function(date) {
        
        var now = new Date();
        console.log(new Date(date))
        if( (new Date(date) < now))
        {   
            return true;
        }
        return false;
      };

        $scope.theme = 'blue';


    $scope.addPlace = function(ev,templateId) {
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
        function DialogController($scope, $mdDialog) {
            
            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

            $scope.add = function() {

                var reqObj  = {}
                reqObj.place = $scope.place;

                var request = $http.post('/addPlace',reqObj);
                request.success(function(data) {
                   console.log("Place successfully added")
                   $scope.hide()

                });
                request.error(function(data){
                    console.log('error banthu');
                });
            }    
        }


       $scope.Update = function() {
        
        var now = new Date();
        console.log(new Date(date))
        if( (new Date(date) < now))
        {   
            return true;
        }
        return false;
      };

      
}]);
