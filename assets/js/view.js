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
	
$( document ).ready(function() {
	start();
	
	const canvas 	= $('#canvas');
	const controls= $('#controls');
	
	const selectedFrame = $('.frame.selected');
	const selectedSeat 	= $('.seat.selected');
	
	
	const frames = {title : "FRAME FINISH OPTIONS", id: 'frames', materials : [
		{name : 'Wooden Frames', materials:[{title : 'Frame1',thumb:'assets/images/m1Frame.png', src:'./assets/materials/m1.png'},{title : 'Frame2', thumb:'assets/images/m2Feame.png', src:'./assets/materials/m2.png'}]}
					]};
	var allFrames = frames.materials;
	
	const seats = {title : "FRAME FINISH OPTIONS", id: 'seats', materials : [
	{name : 'Leather Seats', materials:[{title : 'Seat1',thumb:'assets/images/m1Seat.png', src:'./assets/materials/m1.png'},{title : 'Seat2',thumb:'assets/images/m2Seat.png', src:'./assets/materials/m2.png'}]}
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
	
	console.log('Update Frame :',obj);
	var mainMaterial = new THREE.TextureLoader().load(obj.src);
	//seatObj.material.map = mainMaterial;
	frameObj.material.map = mainMaterial;
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
	console.log('Update Seat :',obj);
	var mainMaterial = new THREE.TextureLoader().load(obj.src);
	seatObj.material.map = mainMaterial;
	//frameObj.material[0].map = mainMaterial;
}

		