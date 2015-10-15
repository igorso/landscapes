///////////////////////////////////////////////////////////////////////////////
//  Resource loader object. The parameter is the number of resources expected
var rl = new ResourceLoader(0);

//  Texture Manager object. The parameter is the number of textures expected
var tm = new TextureManager(0);

/**
*  Code to load resources. The number of resources loaded should be the same as
*  the number at the rl constructor
*/
var load = function(callback) {
   rl.check_is_done(callback);
};

/**
*  Code to configure necessary textures. The number of loaded textures should be
*  the same as explicited at the tm constructor
*/
var config_tex = function(callback) {
   tm.check_is_done(callback);
};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var mountain = new Mountain(1.25, 0.4, 33, 33);

var initial_quad = [vec2(0, 0),
                    vec2(0, mountain.nColumns-1),
                    vec2(mountain.nRows-1, mountain.nColumns-1),
                    vec2(mountain.nRows-1, 0), 0];

mountain.quad_queue.push(initial_quad);

var c_red = vec4 (1.0, 0.0, 0.0, 1.0);
var c_blue = vec4 (0.0, 0.0, 1.0, 1.0);
var c_black = vec4 (0.0, 0.0, 0.0, 1.0);

mountain.set_update_interval (40);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var lightAmbient = vec4(0.8, 0.03, 0.03, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 10000.0;

var ambientColor = mult (lightAmbient, materialAmbient);
var diffuseColor = mult (lightDiffuse, materialDiffuse);
var specularColor = mult (lightSpecular, materialSpecular);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var flatrender;
var fragphongrender;

/**
*  Code to render. 
*/  
var render_flat_with_normals = function (p, mv) {

   //  Draw normals
   flatrender.load_vbo (mountain.normalsLines, c_blue, WGL.gl.LINES, 2);
   flatrender.draw (p, mv);

   //  Draw tessalate Lines
   flatrender.load_vbo (mountain.vPosition, c_black, WGL.gl.LINE_LOOP, 4);
   flatrender.draw (p, mv);
   
   //  Draw mountain
   flatrender.load_vbo (mountain.vPosition, c_red, WGL.gl.TRIANGLE_FAN, 4);
   flatrender.draw (p, mv);


};

var render_frag_phong = function (p, mv) {

   // //  Draw normals
   // fragphongrender.load_vbo (mountain.normalsLines, c_blue, WGL.gl.LINES, 2);
   // fragphongrender.draw (p, mv);

   // //  Draw tessalate Lines
   // fragphongrender.load_vbo (mountain.vPosition, c_black, WGL.gl.LINE_LOOP, 4);
   // fragphongrender.draw (p, mv);
   
   //  Draw mountain
   fragphongrender.load_vbo (mountain.vPosition, mountain.vNormal, WGL.gl.TRIANGLE_FAN, 4,
                             lightPosition, ambientColor, diffuseColor, specularColor, materialShininess);
   fragphongrender.draw (p, mv);


};
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  WGL object
var WGL;

//  WGL parameters.
var wglParam = { 
            depth_test : true,
            blend      : true 
            };


window.onload = function init() {
   //  Init WGL when the window finish loading
   WGL = new WGL (wglParam, function(){});

   //  Queue the render code after WGL initialize
   WGL.queue_render (render_frag_phong);

   start();
   

};

//  Callback structure designed so the whole application can 
//  initialize in the desired sequence
function start () {
   load (function () {
      config_tex (function () {
            flatrender = new RENFlatColor ();
            fragphongrender = new RENFragPhong ("vs-phong-fragment-color",
                                                "fs-phong-fragment-mountain");
            WGL.render (WGL.scene_render);
      });
   });
}