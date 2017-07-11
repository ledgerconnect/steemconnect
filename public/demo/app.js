sc2.init({
  baseURL: window.location.origin,
  app: 'busy.app',
  callbackURL: 'https://v2.steemconnect.com/demo',
  scope: ['vote', 'comment']
});

angular.module('app', [])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }])
  .controller('Main', function($scope, $location, $http) {
    $scope.loading = false;
    $scope.parentAuthor = 'siol';
    $scope.parentPermlink = '5vdmjq-test';
    $scope.accessToken = $location.search().access_token;
    $scope.expiresIn = $location.search().expires_in;
    $scope.loginURL = sc2.getLoginURL();

    if ($scope.accessToken) {
      sc2.setAccessToken($scope.accessToken);
      sc2.me(function (err, result) {
        console.log('/me', err, result);
        if (!err) {
          $scope.user = result.account;
          $scope.$apply();
        }
      });
    }

    $scope.isAuth = function() {
      return !!$scope.user;
    };

    $scope.loadComments = function() {
      steem.api.getContentReplies($scope.parentAuthor, $scope.parentPermlink, function(err, result) {
        if (!err) {
          $scope.comments = result.slice(-5);
          $scope.$apply();
        }
      });
    };

    $scope.comment = function() {
      $scope.loading = true;
      var permlink = steem.formatter.commentPermlink($scope.parentAuthor, $scope.parentPermlink);
      sc2.comment($scope.parentAuthor, $scope.parentPermlink, $scope.user.name, permlink, '', $scope.message, '', function(err, result) {
        console.log(err, result);
        $scope.message = '';
        $scope.loading = false;
        $scope.$apply();
        $scope.loadComments();
      });
    };

    $scope.vote = function(author, permlink, weight) {
      sc2.vote($scope.user.name, author, permlink, weight, function (err, result) {
        if (!err) {
          alert('You successfully vote for @' + author + '/' + permlink);
          console.log('You successfully vote for @siol/test', err, result);
          $scope.loadComments();
        } else {
          console.log(err);
        }
      });
    };

    $scope.logout = function() {
      sc2.revokeToken(function (err, result) {
        console.log('You successfully logged out', err, result);
        delete $scope.user;
        delete $scope.accessToken;
        $scope.$apply();
      });
    };
  });
