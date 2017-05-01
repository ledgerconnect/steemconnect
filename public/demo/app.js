sc2.init({
  baseURL: 'http://localhost:3000',
  app: 'busy.app',
  callbackURL: 'http://localhost:3000/demo'
});

angular.module('app', [])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }])
  .controller('Main', function($scope, $location, $http) {
    $scope.accessToken = $location.search().access_token;
    $scope.expiresIn = $location.search().expires_in;
    $scope.loginURL = sc2.getLoginURL();

    if ($scope.accessToken) {
      sc2.setAccessToken($scope.accessToken);
      sc2.me(function (err, result) {
        console.log('/me', err, result);
        $scope.user = result;
        $scope.$apply();
      });
    }

    this.submit = function() {
      sc2.vote($scope.user.name, 'siol', 'test', 100, function (err, result) {
        console.log('/broadcast', err, result);
      });
    }
  });
