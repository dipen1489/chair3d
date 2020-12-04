const clock = new THREE.Clock();
var scene;
const BACKGROUND_COLOR = 0xdddddd;
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
  //console.log(window.devicePixelRatio);
  renderer.setPixelRatio( window.devicePixelRatio );
  
	//renderer.gammaOutput = true;
	//renderer.gammaFactor = 1.3;
	//renderer.shadowMap.enabled = false;
	//renderer.autoClear = false;
  
  camera.aspect = myCanvas.clientWidth / myCanvas.clientHeight;
  camera.updateProjectionMatrix();
  
  //var widthCanvas = ConvertPercentageToPx(window.innerWidth , myCanvas.style.width.replace("%", ""));
  //var heightCanvas = ConvertPercentageToPx(window.innerHeight , myCanvas.style.height.replace("%", ""));
  renderer.setSize( myCanvas.clientWidth, myCanvas.clientHeight);
  renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
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
  //cameraControls.dollyToCursor = true;
  //cameraControls.dollySpeed = 0;
  //cameraControls.maxPolarAngle = 1.24;
  
  
  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.enablePan = false;
  
  
  var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
  scene.add( ambientLight );
  
  var directionalLightFront = new THREE.DirectionalLight( 0xffffff, 0.3 );
  directionalLightFront.position.set(0,0,90);
  //directionalLightFront.castShadow = true;
  scene.add( directionalLightFront );
  
  var directionalLightBack = new THREE.DirectionalLight( 0xffffff, 0.3 );
  directionalLightBack.position.set(0,0,-90);
  //directionalLightBack.castShadow = true;
  scene.add( directionalLightBack );
  
    const light = new THREE.SpotLight( 0xffffff , 0.1 );
	light.position.set( 100, 1000, 100 ); 
	light.shadow.mapSize.width = 1024; 
	light.castShadow = true; // default false
	light.shadow.camera.far = 4000;
	light.shadow.camera.fov = 30;
	//scene.add( light );
	
	var light1 = new THREE.PointLight( 0x555555, 2.5, 150 );
    light1.position.set( 25, 35, 0 );
    light1.castShadow = true;            // default false
    scene.add( light1 );
  
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
	loader.load( './assets/models3d/chair normal.fbx', function ( object ) {
	object.position.set(0,-25,0);
	
	var mainMaterial = new THREE.TextureLoader().load( './assets/materials/m1.png' );
	var metal = new THREE.TextureLoader().load('./assets/materials/metallic.png');
	var rough = new THREE.TextureLoader().load( './assets/materials/roughness.png' );
	var normal = new THREE.TextureLoader().load('./assets/materials/normal.png' );
	
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				if(child.name == "seat1"){
					seatObj = child;
					const sphereMaterial1 = new THREE.MeshStandardMaterial();
					sphereMaterial1.metalnessMap = metal;
					sphereMaterial1.roughnessMap = rough;
					sphereMaterial1.roughness = 1;
					sphereMaterial1.normalMap = normal;
					sphereMaterial1.map = mainMaterial;
					child.material = sphereMaterial1;
					child.castShadow = true;
					child.receiveShadow = true;
				}
				else if(child.name == "wood1"){
					frameObj = child;
					const sphereMaterial1 = new THREE.MeshStandardMaterial();
					sphereMaterial1.metalnessMap = metal;
					//sphereMaterial1.roughnessMap = rough;
					sphereMaterial1.roughness = 0.4;
					sphereMaterial1.metalness = 0.9;
					sphereMaterial1.normalMap = normal;
					sphereMaterial1.map = mainMaterial;
					child.material = sphereMaterial1;
					child.castShadow = true;
					child.receiveShadow = true;
				}
				//child.castShadow = true;
				//child.receiveShadow = false;
				//child.material = sphereMaterial1;
				/* child.material.metalnessMap = metal;
				child.material.roughnessMap = rough;
				child.material.normalMap = normal;
				child.material.map = mainMaterial; */
				child.material.needsUpdate = true;
				console.log(child);
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

