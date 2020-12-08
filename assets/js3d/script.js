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
	CameraControls.install( { THREE: THREE } );

	camera = new THREE.PerspectiveCamera( 56, window.innerWidth/window.innerHeight, 0.1, 10000 );
	camera.position.set( 0, 27, 76 );

	var myCanvas = document.getElementById("previewCanvas");
	renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});
	renderer.setPixelRatio( window.devicePixelRatio );
	camera.aspect = myCanvas.clientWidth / myCanvas.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( myCanvas.clientWidth, myCanvas.clientHeight);
	renderer.shadowMap.enabled = true;
	if(getMobileOperatingSystem() == "unknown"){
		cameraControls = new CameraControls( camera, renderer.domElement );
		cameraControls.dollyToCursor = true;
		cameraControls.maxDistance = 150;
	}
	else{
		cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
		cameraControls.enablePan = false;
		cameraControls.maxDistance = 150;
	}
	
	var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
	scene.add( ambientLight );

	var directionalLightFront = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLightFront.position.set(0,0,90);
	scene.add( directionalLightFront );

	var directionalLightBack = new THREE.DirectionalLight( 0xffffff, 0.3 );
	directionalLightBack.position.set(0,0,-90);
	scene.add( directionalLightBack );
  
	var light1 = new THREE.PointLight( 0x555555, 2.5, 150 );
    light1.position.set( 25, 35, 0 );
    light1.castShadow = true;         
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

function RemvePreviousObject(){
	var textObject = scene.getObjectByName("Chair");
	if(textObject !== undefined){
		scene.remove(textObject);
		animate();
	}
}

function loadSofaObject()
{
	$(".loadingImageContainerStyle").css("display","block");
	cameraControls.reset();
	RemvePreviousObject();
	var loader = new THREE.FBXLoader();
	var mainMaterialWood = new THREE.TextureLoader().load( './assets/Sofa/rtt2.png');
	loader.load( './assets/Sofa/sofa xiu.fbx', function ( object ) {
	object.name = "Chair";
	object.position.set(-25,0,0);
	object.scale.set(0.033,0.033,0.033);
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				console.log(child);
				child.material.map = mainMaterialWood;
			}
		});  
		$(".loadingImageContainerStyle").css("display","none");
		scene.add( object );
	} , undefined , function ( e ) {
		console.log( e );
		$(".loadingImageContainerStyle").css("display","none");
	}); 
}

function loadClientObject()
{
	$(".loadingImageContainerStyle").css("display","block");
	cameraControls.reset();
	RemvePreviousObject();
	var loader = new THREE.FBXLoader();
	var mainMaterialSeat = new THREE.TextureLoader().load( selectedSeatObject.src );
	mainMaterialSeat.wrapS = THREE.RepeatWrapping;
	mainMaterialSeat.wrapT = THREE.RepeatWrapping;
	mainMaterialSeat.repeat.set( 1, 1 );
	var mainMaterialWood = new THREE.TextureLoader().load( selectedFrameObject.src );
	loader.load( './assets/models3d/Rudolf_Castle_Line.FBX', function ( object ) {
	object.name = "Chair";
	object.position.set(0,-25,0);
	object.scale.set(0.7,0.7,0.7);
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				frameObj = child.material[0];
				seatObj = child.material[1];
				child.material[0].map = mainMaterialWood;
				child.material[1].map = mainMaterialSeat;
				child.material.needsUpdate = true;
			}
		}); 
		$(".loadingImageContainerStyle").css("display","none");
		scene.add( object );
	} , undefined , function ( e ) {
		console.log( e );
		$(".loadingImageContainerStyle").css("display","none");
	}); 
}

var texturePromises = [];
var textures = {};
function LoadTexture(map ,roughnessMap, metalnessMap , normalMap)
{
	var textureLoader = new THREE.TextureLoader();
	textures = {
		'map': {
		  url: map,
		  val: undefined
		},
		'roughness': {
		  url: roughnessMap,
		  val: undefined
		},
		'metal': {
		  url: metalnessMap,
		  val: undefined
		},
		'normal': {
		  url: normalMap,
		  val: undefined
		}
	};
	  // earth textures
	for (var key in textures) {
		texturePromises.push(new Promise((resolve, reject) => {
		  var entry = textures[key]
		  var url = entry.url
		  textureLoader.load(url,
			texture => {
			  entry.val = texture;
			  if (entry.val instanceof THREE.Texture) resolve(entry);
			},
			xhr => {
			  console.log(url + ' ' + (xhr.loaded / xhr.total * 100) +
				'% loaded');
			},
			xhr => {
			  reject(new Error(xhr +
				'An error occurred loading while loading: ' +
				entry.url));
			}
		  );
		}));
	}
	return textures;
}

async function loadObject()
{
	$(".loadingImageContainerStyle").css("display","block");
	var seatTexture = await LoadTexture(selectedSeatObject.src , './assets/materials/seat/roughness.png' ,'./assets/materials/seat/metal.png' , './assets/materials/seat/normal.png' );
	
	var frameTexture = await LoadTexture(selectedFrameObject.src , './assets/materials/wood/roughness.png' ,'./assets/materials/wood/metal.png' , './assets/materials/wood/normal.png' );

	cameraControls.reset();
	RemvePreviousObject();
	var loader = new THREE.FBXLoader();
	loader.load( './assets/models3d/chair_uv.fbx', function ( object ) {
	object.position.set(0,-25,0);
	object.name = "Chair";
	object.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			if(child.name == "polySurface13"){ // seat
				const seatMaterial = new THREE.MeshStandardMaterial();
				seatMaterial.metalnessMap = seatTexture.metal.val;
				seatMaterial.roughnessMap = seatTexture.roughness.val;
				seatMaterial.roughness = 1;
				seatMaterial.normalMap = seatTexture.normal.val;
				seatMaterial.map = seatTexture.map.val;
				seatMaterial.map.wrapS = THREE.RepeatWrapping;
				seatMaterial.map.wrapT = THREE.RepeatWrapping;
				seatMaterial.map.repeat.set( 1, 1 );
				child.material = seatMaterial;
				child.castShadow = true;
				child.receiveShadow = true;
				seatObj = child.material;
			}
			else if(child.name == "polySurface10"){ // Frame
				const frameMaterial = new THREE.MeshStandardMaterial();
				frameMaterial.metalnessMap = frameTexture.metal.val;
				//frameMaterial.roughnessMap = roughFrame;
				frameMaterial.roughness = 0.4;
				frameMaterial.metalness = 0.9;
				frameMaterial.normalMap = frameTexture.normal.val;
				frameMaterial.map = frameTexture.map.val;
				frameMaterial.map.wrapS = THREE.RepeatWrapping;
				frameMaterial.map.wrapT = THREE.RepeatWrapping;
				frameMaterial.map.repeat.set( 1, 1 );
				child.material = frameMaterial;
				child.castShadow = true;
				child.receiveShadow = true;
				frameObj = child.material;
			}
			child.material.needsUpdate = true;
		}
	}); 
	$(".loadingImageContainerStyle").css("display","none");
	scene.add( object );
	
	} , undefined , function ( e ) {
		console.log( e );
		$(".loadingImageContainerStyle").css("display","none");
	}); 
	
}

var animate = function animate() {
	if(getMobileOperatingSystem() == "unknown"){
		const delta = clock.getDelta();
		const hasControlsUpdated = cameraControls.update( delta );
	}
	else{
		cameraControls.update();
	}
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (/windows phone/i.test(userAgent)) {
		return "Windows Phone";
	}
	if (/android/i.test(userAgent)) {
		return "Android";
	}
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "iOS";
	}
	return "unknown";
}

function start()
{
	init();
	//loadClientObject();
	loadSofaObject();
	animate();
}

