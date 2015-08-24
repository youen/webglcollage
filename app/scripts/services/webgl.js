'use strict';

/**
 * @ngdoc service
 * @name webglApp.webgl
 * @description
 * # webgl
 * Service in the webglApp.
 */
angular.module('webglApp')
  .service('webgl', [  function () {
    var self = this;
    

    self.clock = new THREE.Clock();

    //For 2D minpulation
    self.canvas = document.createElement("canvas");
    self.canvas.width = Math.pow(2,10);
    self.canvas.height = Math.pow(2,10);
    self.context = self.canvas.getContext("2d");
    
    self.originalImage = null;
    
    self.collectionTexture = new THREE.Texture(self.canvas);


    self.cameraRTT =  new THREE.OrthographicCamera( -1,1, -1,1, -10000, 10000 );

    this.renderer = new THREE.WebGLRenderer();
   
    self.sizes = [128, 128]
    self.renderer.setSize(self.sizes[0], self.sizes[1]);
    
    function nextPowOf2(n){
                n--;
                n |= n >> 1;   // Divide by 2^k for consecutive doublings of k up to 32,
                n |= n >> 2;   // and then or the results.
                n |= n >> 4;
                n |= n >> 8;
                n |= n >> 16;
                n++;
                return n;
    }
    
    self.changeSizes = function(sizes){
        self.orignialSizes = sizes;
        var max = sizes[0] > sizes[1] ? sizes[0] : sizes[1];
        var renderRatio = self.sizes[0]/self.sizes[1]
        var originalRatio = self.orignialSizes[0]/self.orignialSizes[1]
        if(renderRatio > originalRatio){
            self.cropWidth = 2 * originalRatio/renderRatio;
            self.cropHeight = 2;
        }
        else{
            self.cropWidth = 2
            self.cropHeight = 2 /  originalRatio*renderRatio;
        
        }
        self.cropTexture = new THREE.WebGLRenderTarget(self.sizes[0], self.sizes[1]);
        self.diffTexture = new THREE.WebGLRenderTarget(self.sizes[0], self.sizes[1]);
        self.collageTexture = new THREE.WebGLRenderTarget(self.sizes[0], self.sizes[1]);
        self.pingTexture = new THREE.WebGLRenderTarget(self.sizes[0], self.sizes[1]);
        self.pongTexture = new THREE.WebGLRenderTarget(self.sizes[0], self.sizes[1]);

 
    }
    
    self.setOriginalImage = function(image) {
      console.log(image)
      self.changeSizes([image.width, image.height])
      self.originalImage = THREE.ImageUtils.loadTexture( image.src ,{}, function() {


          self.initCropImage();
          self.renderer.render( self.sceneCollage, self.cameraCollage, self.cropTexture );

          });


    
    }
    
    self.initCropImage = function() {
      if( !self.originalImage) return;
      
        self.sceneCollage = new THREE.Scene();
        self.cameraCollage = new THREE.OrthographicCamera( -1,1, -1,1, -10000, 10000 );
        self.cameraCollage.position.x = 0;
        self.cameraCollage.position.y = 0;
        self.cameraCollage.position.z = 5;
      
        var geometry = new THREE.PlaneBufferGeometry(self.cropWidth,self.cropHeight);
        var material = new THREE.MeshBasicMaterial( { map: self.originalImage, side: THREE.DoubleSide } );
        var plan = new THREE.Mesh( geometry, material );
        plan.rotation.z += Math.PI/2;
        plan.rotation.z += Math.PI/2;

        self.sceneCollage.add( plan );

      
    }


    self.initCollage = function() {
      if( !self.images) return;
      
        self.sceneCollage = new THREE.Scene();
        self.cameraCollage = new THREE.OrthographicCamera( -1,1, -1,1, -10000, 10000 );
        self.cameraCollage.position.x = 0;
        self.cameraCollage.position.y = 0;
        self.cameraCollage.position.z = 5;
      
        var geometry  = new THREE.BufferGeometry();

        console.log(self.vertices)
        geometry.addAttribute( 'indice', self.indices );

        geometry.addAttribute( 'position', self.vertices );

        geometry.addAttribute( 'uv', self.texCoord);


        console.log(self.texCoord);
        console.log(self.indices);
        self.uniforms =  {
                tCollection: {
                    type: "t", 
                    value: self.collectionTexture
                },
                tPopulation:{
                    type:'t',
                    value: self.PopulationTexture
                },
                time: {
                    type: 'f',
                    value : 0,
                }
        }

        var material = new THREE.RawShaderMaterial( {

            uniforms:self.uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.DoubleSide,
            transparent: true

        } );



        var plan = new THREE.Mesh( geometry, material );
        plan.rotation.z += Math.PI/2;
        plan.rotation.z += Math.PI/2;

        self.sceneCollage.add( plan );

      
    }
    

    self.initPopulation = function() {
        // Generate random noise texture
        var noiseSize = 256;
        var size = noiseSize * noiseSize;
        var data = new Uint8Array( 4 * size );
        for ( var i = 0; i < size * 4; i ++ ) {
            data[ i ] = Math.random() * 255 | 0;
        }
        if(self.PopulationTexture){self.PopulationTexture.image = ( new THREE.DataTexture( data, noiseSize, noiseSize, THREE.RGBAFormat )).image}
        else{
        self.PopulationTexture = new THREE.DataTexture( data, noiseSize, noiseSize, THREE.RGBAFormat );
        self.PopulationTexture.wrapS = THREE.RepeatWrapping;
        self.PopulationTexture.wrapT = THREE.RepeatWrapping;
        }
        
        self.PopulationTexture.needsUpdate = true;
        /*
        self.PopulationCanvas = document.getElementById('population-canvas');
        self.PopulationCanvas.width =256;
        self.PopulationCanvas.height = 256;
        var ctx= self.PopulationCanvas.getContext('2d');
        var grd=ctx.createLinearGradient(0,0,170,0);
        grd.addColorStop(0,"rgba(0, 0, 0, 0)");
        grd.addColorStop(1,"rgba(255, 255, 255, 255)");

        ctx.fillStyle=grd;
        ctx.fillRect(0,0, 256, 256);
        self.PopulationTexture = new THREE.Texture(self.PopulationCanvas,THREE.UVMapping,THREE.RepeatWrapping ,THREE.RepeatWrapping );
        self.PopulationTexture.needsUpdate = true;
        */

    };

    self.initDiff = function(){
        self.sceneDiff= new THREE.Scene();
        self.cameraDiff = new THREE.OrthographicCamera( -1,1, -1,1, -10000, 10000 );
        self.cameraDiff.position.x = 0;
        self.cameraDiff.position.y = 0;
        self.cameraDiff.position.z = 5;
      
        var geometry = new THREE.PlaneBufferGeometry(2,2);
        var material = new THREE.ShaderMaterial( {

            uniforms:{
                tCrop: {
                    type: "t", 
                    value: self.cropTexture,
                },
                tCollage: {
                    type: "t", 
                    value: self.collageTexture,
                }
            },
            vertexShader: document.getElementById( 'DiffVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'DiffFragmentShader' ).textContent,
            side: THREE.DoubleSide,
            transparent: true

        } );
        //var material = new THREE.MeshBasicMaterial( { map: self.collageTexture, side: THREE.DoubleSide } );
        var plan = new THREE.Mesh( geometry, material );
        plan.rotation.z += Math.PI/2;
        plan.rotation.z += Math.PI/2;

        self.sceneDiff.add( plan );
        

    }


    self.initBlur = function(){
        self.sceneBlur= new THREE.Scene();

      

        var geometry = new THREE.PlaneBufferGeometry(1,1);//2/self.sizes[0],2/self.sizes[1]);
      
        self.blurMaterial = new THREE.MeshBasicMaterial( { map: self.collageTexture, side: THREE.FrontSide } );
        var plan = new THREE.Mesh( geometry, self.blurMaterial );
        plan.rotation.x += Math.PI;
        //plan.rotation.y += Math.PI/2;

        self.sceneBlur.add( plan );
        

    }

    self.initWriteScore = function(){
        self.sceneWriteScore= new THREE.Scene();

        var geometry = new THREE.PlaneBufferGeometry(2,2);
        var material = new THREE.ShaderMaterial( {

            uniforms:{
                fIndividu: {
                    type :"f",
                    value : 0.
                },
                tCrop: {
                    type: "t", 
                    value: self.cropTexture,
                },
                tCollage: {
                    type: "t", 
                    value: self.collageTexture,
                }
            },
            vertexShader: document.getElementById( 'WriteScoreVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'WriteScoreFragmentShader' ).textContent,
            side: THREE.DoubleSide,
            transparent: true

        } );      

        var geometry = new THREE.PlaneBufferGeometry(2,2);//2/self.sizes[0],2/self.sizes[1]);
      
        self.materialWriteScore = new THREE.MeshBasicMaterial( { map: self.pongTexture, side: THREE.DoubleSide } );
        var plan = new THREE.Mesh( geometry, self.materialWriteScore );
        plan.rotation.z += Math.PI/2;
        plan.rotation.z += Math.PI/2;

        self.sceneWriteScore.add( plan );
        

    }


    this.render = function render () {
      

        requestAnimationFrame( render );
        self.uniforms.time.value += 0.2 * self.clock.getDelta();
        self.initPopulation()
        self.renderer.render( self.sceneCollage, self.cameraCollage, self.collageTexture );
        self.renderer.render( self.sceneDiff, self.cameraDiff, self.pongTexture );
        self.blurMaterial.map = self.pongTexture;

        for(var i =0 ; i <1; i++){
           
           self.renderer.render( self.sceneBlur, self.cameraDiff)

           self.renderer.render( self.sceneBlur, self.cameraDiff, self.pingTexture );
           self.pongTexture = self.pingTexture
           self.pingTexture = self.blurMaterial.map;
           self.blurMaterial.map = self.pongTexture;
   

        }
        self.renderer.render( self.sceneBlur, self.cameraDiff );

        //self.renderer.render( self.sceneBlur, self.cameraDiff)//, self.pingTexture );
        /*self.uniformsBlur.fWindow.value = 0.005
        self.uniformsBlur.tInput.value = self.pingTexture;
        self.renderer.render( self.sceneBlur, self.cameraDiff, self.pongTexture );
        self.uniformsBlur.fWindow.value = 0.01
        self.uniformsBlur.tInput.value = self.pongTexture;
        self.renderer.render( self.sceneBlur, self.cameraDiff, self.pingTexture );
        self.uniformsBlur.fWindow.value = 0.05
        self.uniformsBlur.tInput.value = self.pingTexture;
        self.renderer.render( self.sceneBlur, self.cameraDiff);//, self.pongTexture );
*/
    }

    
    self.computeTexture = function(images){

      self.images = images;
      self.indices = new THREE.BufferAttribute( new Float32Array( self.images.length * 2 *3 ), 1);
      self.vertices = new THREE.BufferAttribute( new Float32Array( self.images.length * 2 * 3 * 3  ), 3);
      self.texCoord = new THREE.BufferAttribute( new Float32Array( self.images.length * 2 * 3 * 2  ), 2);

      angular.forEach(images, function(img, i){
        if(this.x + img.width > self.canvas.width){
          this.x=0;
          this.y = this.y + this.maxHeight;
          this.maxHeight = 0
        }
        self.context.drawImage(img, this.x, this.y);

        var indice = i / images.length;
        self.indices.setX(6*i    , indice );
        self.indices.setX(6*i + 1, indice );
        self.indices.setX(6*i + 2, indice );
        self.indices.setX(6*i + 3, indice );
        self.indices.setX(6*i + 4, indice );
        self.indices.setX(6*i + 5, indice );    

            
        var u0 = this.x / self.canvas.width;
        var u1 = (this.x + img.width )/ self.canvas.width;
        var v0 = 1-this.y / self.canvas.height;
        var v1 = 1-(this.y  + img.height)/ self.canvas.height;

        self.texCoord.setXY(6*i    , u0, v0 );
        self.texCoord.setXY(6*i + 1, u0, v1 );
        self.texCoord.setXY(6*i + 2, u1, v0 );
        self.texCoord.setXY(6*i + 3, u1, v1 );
        self.texCoord.setXY(6*i + 4, u1, v0 );
        self.texCoord.setXY(6*i + 5, u0, v1 );

        var max = img.height > img.width ? img.height : img.width;
        var x0 = 0;
        var x1 = img.width / max;
        var y0 = 0 ;
        var y1 = img.height/max;

        self.vertices.setXYZ( 6*i    , x0, y0, indice );
        self.vertices.setXYZ( 6*i + 1, x0, y1, indice );
        self.vertices.setXYZ( 6*i + 2, x1, y0, indice );
        self.vertices.setXYZ( 6*i + 3, x1, y1, indice );
        self.vertices.setXYZ( 6*i + 4, x1, y0, indice );
        self.vertices.setXYZ( 6*i + 5, x0, y1, indice );


        this.maxHeight = this.maxHeight > img.height ? this.maxHeight : img.height;
        this.x += img.width;
        
      }, {x:0,y:0});
      
      self.collectionTexture.needsUpdate = true;
      
    }

  }]);
