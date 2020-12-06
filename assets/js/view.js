/*
 * Prepare container view
 * Version : v1.0.0
*  @2020
*  
*  Author : Sagar S
*  https://www.fiverr.com/sagarsudra
*  
*/


	'use strict';
	var viewFrames = [];
	var viewSeats = [];
	var selectedFrameObject = {};
	var selectedSeatObject = {};
	
$( document ).ready(function() {
	
	
	const canvas 	= $('#canvas');
	const controls= $('#controls');
	
	const selectedFrame = $('.frame.selected');
	const selectedSeat 	= $('.seat.selected');
	
	selectedFrameObject = {title : 'Frame1',thumb:'./assets/materials/WoodTexture/wood_red_brown_thumb.jpg', src:'./assets/materials/WoodTexture/wood_red_brown.jpg'};
	
	selectedSeatObject = {title : 'Seat5',thumb:'./assets/materials/SeatTexture/sofa_leather3_thumb.jpg', src:'./assets/materials/SeatTexture/sofa_leather3.jpg'};
	
	$('.frame.selected').html($('<img>').attr({'src':selectedFrameObject.src,class:''}));
	$('.seat.selected').html($('<img>').attr({'src':selectedSeatObject.src,class:''}));
	
	start();
	
	//$('.frame.selected').html($('<img>').attr({'src':'./assets/materials/WoodTexture/wooden-wood-backgrounds-textured-pattern-wallpaper-concept.jpg',class:''}));
	//$('.seat.selected').html($('<img>').attr({'src':'./assets/materials/SeatTexture/fabric-textured-background.jpg',class:''}));
	
	
	const frames = {title : "FRAME FINISH OPTIONS", id: 'frames', materials : [
	{name : 'Wooden Frames', materials:[
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/abstract-surface-wood-texture-background_thumb.jpg', src:'./assets/materials/WoodTexture/abstract-surface-wood-texture-background.jpg'},
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/brown-wooden-floor_thumb.jpg', src:'./assets/materials/WoodTexture/brown-wooden-floor.jpg'},
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/brown-wooden-flooring_thumb.jpg', src:'./assets/materials/WoodTexture/brown-wooden-flooring.jpg'},
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/scratched-beige-wooden-textured_thumb.jpg', src:'./assets/materials/WoodTexture/scratched-beige-wooden-textured.jpg'},
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/wooden-wood-backgrounds-textured-pattern-wallpaper-concept_thumb.jpg', src:'./assets/materials/WoodTexture/wooden-wood-backgrounds-textured-pattern-wallpaper-concept.jpg'},
		{title : 'Frame1',thumb:'./assets/materials/WoodTexture/wood_red_brown_thumb.jpg', src:'./assets/materials/WoodTexture/wood_red_brown.jpg'}
		]}
	]};
	var allFrames = frames.materials;
	
	const seats = {title : "SEAT FINISH OPTIONS", id: 'seats', materials : [
	{name : 'Leather Seats', materials:[
		{title : 'Seat1',thumb:'./assets/materials/SeatTexture/fabric-textured-background_thumb.jpg', src:'./assets/materials/SeatTexture/fabric-textured-background.jpg'},
		{title : 'Seat2',thumb:'./assets/materials/SeatTexture/fabric-textured-background1_thumb.jpg', src:'./assets/materials/SeatTexture/fabric-textured-background1.jpg'},
		{title : 'Seat3',thumb:'./assets/materials/SeatTexture/fabric-textured-background2_thumb.jpg', src:'./assets/materials/SeatTexture/fabric-textured-background2.jpg'},
		{title : 'Seat4',thumb:'./assets/materials/SeatTexture/greenish-brown-linen-textile-textured_thumb.jpg', src:'./assets/materials/SeatTexture/greenish-brown-linen-textile-textured.jpg'},
		{title : 'Seat5',thumb:'./assets/materials/SeatTexture/white-texture-background_thumb.jpg', src:'./assets/materials/SeatTexture/white-texture-background.jpg'},
		{title : 'Seat5',thumb:'./assets/materials/SeatTexture/sofa_leather3_thumb.jpg', src:'./assets/materials/SeatTexture/sofa_leather3.jpg'}
		]}
	]};
	
	var allSeats = seats.materials;
	
	generateNestedHTML(controls.find('.frames'), allFrames,'frame');
	
	generateNestedHTML(controls.find('.seats'), allSeats,'seat');
	
	/*for(var i=0; i<allSeats.length; i++){
		var span = $('<span>').attr({'title':allSeats[i].title});
		var img = $('<img>').attr({'src':allSeats[i].src,class:'seat-img','data-id':i});
		span.html(img);
		controls.find('.seats').append(span);
	}*/
    	
    	controls.on('click','.frames img', function(){
    		var id = parseInt($(this).attr('data-id'));
    		/*controls.find('.frames img.selected').removeClass('selected');
    		$(this).addClass('selected');*/
    		var img = $('<img>').attr({'src':$(this).attr('src'),class:''});
    		selectedFrame.html(img);
    		updateFrame(viewFrames[id]);
    	});
    	
		controls.on('click','.seats img', function(){
			var id = $(this).attr('data-id');
    		/*controls.find('.seats img.selected').removeClass('selected');
    		$(this).addClass('selected');*/
    		var img = $('<img>').attr({'src':$(this).attr('src'),class:''});
    		selectedSeat.html(img);
    		updateSeat(viewSeats[id]);
    	});
		
		$('a[data-toggle="tooltip"]').tooltip({
		    animated: 'fade',
		    placement: 'bottom',
		    html: true
		});
		
});

function generateNestedHTML(container, objectArr, type){
	
	try{
		objectArr = JSON.parse(objectArr);
	}catch(e){}
	
	for(var j=0; j<objectArr.length; j++){
		try{
			var thisObj = objectArr[j];
			if(thisObj.materials){
				var headDiv = $('<div>').attr({'data-toggle':"tooltip", class:'border-bottom py-3 mb-2 sub-header'}).html(thisObj.name);
				container.append(headDiv);
				container.append(generateNestedHTML(container, thisObj.materials, type));
			}else{
				
				var imgClass = 'frame-img test';
				var dataId = 0;
				if(type == 'frame'){
					dataId = viewFrames.length;
					viewFrames.push(objectArr[j]);
				}else{
					imgClass = 'seat-img';
					dataId = viewSeats.length;
					viewSeats.push(objectArr[j]);
				}
				
				var span = $('<span>').attr({'title':objectArr[j].title, 'data-toggle':"tooltip"});
				var img = $('<img>').attr({'src':objectArr[j].thumb,class:imgClass, 'data-id':dataId});
				span.html(img);
				container.append(span);
			}
		}catch(e){
			console.error(e);
		}
	}
}

function updateFrame(obj){
	selectedFrameObject = obj;
	console.log('Update Frame :',obj);
	var mainMaterial = new THREE.TextureLoader().load(obj.src);
	mainMaterial.wrapS = THREE.RepeatWrapping;
	mainMaterial.wrapT = THREE.RepeatWrapping;
	mainMaterial.repeat.set( 1, 1 );
	//seatObj.material.map = mainMaterial;
	frameObj.map = mainMaterial;
	//frameObj.material[2].map = mainMaterial;
	//seatObj , frameObj;
	
	/* var canvas = document.getElementById('previewCanvas'),
	context = canvas.getContext('2d');
	
	var base_image = new Image();
	base_image.src = obj.src;
	base_image.onload = function(){
	    context.drawImage(base_image, 0, 0);
	}   */
}

function updateSeat(obj){
	selectedSeatObject = obj;
	console.log('Update Seat :',obj);
	var mainMaterial = new THREE.TextureLoader().load(obj.src);
	mainMaterial.wrapS = THREE.RepeatWrapping;
	mainMaterial.wrapT = THREE.RepeatWrapping;
	mainMaterial.repeat.set( 1, 1 );
	seatObj.map = mainMaterial;
	//frameObj.material[0].map = mainMaterial;
}

		