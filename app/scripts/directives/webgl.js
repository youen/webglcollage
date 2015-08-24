'use strict';

/**
 * @ngdoc directive
 * @name webglApp.directive:webgl
 * @description
 * # webgl
 */
angular.module('webglApp')
  .directive('webgl', ['webgl', function (webgl) {
    return {
      template: '',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element[0].appendChild(webgl.renderer.domElement );
      }
    };
  }]);

