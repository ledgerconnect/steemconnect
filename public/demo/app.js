angular.module('app', [])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }])
  .controller('Main', function($scope, $location, $http) {
    $scope.accessToken = $location.search().access_token;
    $scope.expiresIn = $location.search().expires_in;

    if ($scope.accessToken) {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/api/v1/me?access_token=' + $scope.accessToken
      }).then(function (res) {
        $scope.user = res.data
      }, function (res) {
        console.log('Access token is not valid.');
      });
    }

    this.submit = function() {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/broadcast?access_token=' + $scope.accessToken,
        data: JSON.stringify({
          operations: [
            [
              'vote',
              {
                voter: $scope.user.name,
                author: 'snowflake',
                permlink: 'test',
                weight: 100,
              }
            ]
          ]
        })
      }).then(function (res) {
        console.log('Broadcast success', res);
      }, function (res) {
        console.log('Broadcast error', res);
      });

      $scope.comment = '';
      $scope.$apply();
    }
  });
