'use strict';

/**
 * @ngdoc function
 * @name webglApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webglApp
 */
angular.module('webglApp')
  .controller('MainCtrl', ['$scope', '$q', 'collage', 'webgl', function ($scope, $q, collage, webgl) {
      var image = new Image();
      image.onload = function() {
        console.log('loaded')
        webgl.setOriginalImage(image);
      }
      image.src = "images/dali.jpg";  // MUST BE SAME DOMAIN!!!
      
      var imagescollectionURL = [
        "images/dali1.jpg",
        "images/dali2.jpg",
        
    
        "images/dali3.jpg",
        "images/dali4.jpg",
      
        
        "images/dali5.jpg",
        "images/dali6.jpg",
        "images/dali7.jpg",
        "images/dali8.jpg",
        "images/dali9.jpg",
        "images/dali10.jpg",
        "images/dali11.jpg",


      ]

      
      var promises = [];
      angular.forEach(imagescollectionURL, function(url){
        var deferred = $q.defer();
        var image = new Image();
        image.src = url;  // MUST BE SAME DOMAIN!!!
        image.onload = function() {
          deferred.resolve(this);
          console.log(this)
        };        
        this.push(deferred.promise);
      }, promises );
      
    $q.all(promises).then(function(images){
      collage.setImagesCollection(images);
    });
  }]);
