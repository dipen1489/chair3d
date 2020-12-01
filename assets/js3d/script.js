const clock = new THREE.Clock();
var scene;
const BACKGROUND_COLOR = 0xeeeeee;
var camera;
var renderer;
var cameraControls ;
var wheelScroll = 0;
var mainObj = null;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var finalLatLngArray = [];
var xTotal = 0;
var zTotal = 0;
var altReducerFactor = 2;
var angleReducerFactor = 90;
var buondingBox;
var countI = 0;
var lastClickedDrone = null;
var lastClickedDroneMaterial = null;
var MAP_WIDTH = 22300;
var MAP_HEIGHT = 14800;

function init()
{
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR );
  //CameraControls.install( { THREE: THREE } );
  
  camera = new THREE.PerspectiveCamera( 56, window.innerWidth/window.innerHeight, 0.1, 10000 );
  //camera.position.set( 0, 90, 0 );
  camera.position.set( 0, 27, 76 );
  
  var myCanvas = document.getElementById("previewCanvas");
  console.log(myCanvas.clientWidth);
  console.log(myCanvas.clientHeight);
  renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
  console.log(window.devicePixelRatio);
  renderer.setPixelRatio( 3 );
  
  camera.aspect = myCanvas.clientWidth / myCanvas.clientHeight;
  camera.updateProjectionMatrix();
  
  //var widthCanvas = ConvertPercentageToPx(window.innerWidth , myCanvas.style.width.replace("%", ""));
  //var heightCanvas = ConvertPercentageToPx(window.innerHeight , myCanvas.style.height.replace("%", ""));
  renderer.setSize( myCanvas.clientWidth, myCanvas.clientHeight);
  //renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild( renderer.domElement ); 
  
  /* var myCanvas = document.getElementById("previewCanvas");
  renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
  renderer.setPixelRatio( window.devicePixelRatio );
  console.log("canvas height : ",myCanvas);
  var widthCanvas = ConvertPercentageToPx(window.innerWidth , myCanvas.style.width.replace("%", ""));
  var heightCanvas = ConvertPercentageToPx(window.innerHeight , myCanvas.style.height.replace("%", ""));
  renderer.setSize( widthCanvas, heightCanvas); */
  
  //cameraControls = new CameraControls( camera, renderer.domElement );
  //cameraControls.dollyToCursor = false;
  //cameraControls.dollySpeed = 0;
  //cameraControls.maxPolarAngle = 1.24;
  
  
  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.enablePan = false;
  
  
  var ambientLight = new THREE.AmbientLight( 0xcccccc, 3.5 );
  scene.add( ambientLight );
  
  var directionalLightFront = new THREE.DirectionalLight( 0xcccccc, 0.1 );
  directionalLightFront.position.set(0,27,76);
  scene.add( directionalLightFront );
  
  var directionalLightBack = new THREE.DirectionalLight( 0xcccccc, 0.1 );
  directionalLightBack.position.set(0,0,-90);
  scene.add( directionalLightBack );
}

function ConvertPercentageToPx(mainData , percentage)
{
  return ((mainData * percentage) / 100)
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
};

var seatObj , frameObj;

function loadObject()
{
	var loader = new THREE.FBXLoader();
	loader.load( './assets/models3d/chair.fbx', function ( object ) {
	object.position.set(0,-25,0);
	mainMaterial = new THREE.TextureLoader().load( './assets/materials/m1.png' );
	metal = new THREE.TextureLoader().load('./assets/materials/metallic.png');
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				//metal = new THREE.TextureLoader().load('./assets/materials/metallic.png');
				//normal = new THREE.TextureLoader().load('./assets/materials/normal.png' );
				//rough = new THREE.TextureLoader().load( './assets/materials/roughness.png' );
				//mainMaterial = new THREE.TextureLoader().load( './assets/materials/m1.png' );
				if(child.name == "polySurface29"){
					seatObj = child;
					//child.material.metalnessMap = metal;
					//child.material.normalMap = normal;
					//child.material.roughnessMap = rough;
					child.material.map = mainMaterial;
				}
				else if(child.name == "polySurface35"){
					frameObj = child;
					//child.material[1].metalnessMap = metal;
					//child.material[1].normalMap = normal;
					//child.material[1].roughnessMap = rough;
					child.material[1].map = mainMaterial;
				}
				console.log(child);
				child.material.needsUpdate = true;
			}
		}); 
		scene.add( object );
	} , undefined , function ( e ) {
		console.log( e );
	}); 
	  
}

var animate = function animate() {
  //const delta = clock.getDelta();
  //const hasControlsUpdated = cameraControls.update( delta );
  
    //console.log(camera.position);
	requestAnimationFrame( animate );
	cameraControls.update();
	renderer.render( scene, camera );
};

function start()
{
  init();
  loadObject();
  animate();
}

