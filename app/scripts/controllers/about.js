'use strict';

/**
 * @ngdoc function
 * @name webglApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webglApp
 */
angular.module('webglApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
