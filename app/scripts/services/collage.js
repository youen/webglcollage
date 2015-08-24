'use strict';

/**
 * @ngdoc service
 * @name webglApp.collage
 * @description
 * # collage
 * Service in the webglApp.
 */
angular.module('webglApp')
  .service('collage', ['webgl', function (webgl) {
    var self = this;
    
    self.originalImage = null;
    self.imagescollection = [];
    self.context = null;
    
    self.setContext = function(context){
      self.context = context;
      
    }
    
    self.setImagesCollection = function(images){
      self.imagescollection = images;
      webgl.computeTexture(self.imagescollection);
      webgl.initPopulation();
      webgl.initCollage();
      webgl.initDiff();
      webgl.initBlur();
      //webgl.initWriteScore();
      webgl.render();
      
    }
  }]);
