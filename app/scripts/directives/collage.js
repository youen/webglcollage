'use strict';

/**
 * @ngdoc directive
 * @name webglApp.directive:collage
 * @description
 * # collage
 */
angular.module('webglApp')
  .directive('collage', [ 'collage', function (collage) {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        collage.setContext(element[0].getContext('2D'));
      }
    };
  }]);
