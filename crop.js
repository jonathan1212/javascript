
(function($){
	
	ImgSize = (function(){

		var img_width;
		var img_height;
		var src = $('.currently-viewed-photo').attr('src');

		var currentIndex = -1;

		function setIndex(index){
			currentIndex = index;
		}

		function getIndex(){
			return currentIndex;
		}

		
		function setImgSize(imgSrc) {

		    var newImg = new Image();
		    newImg.src = imgSrc; // this must be done AFTER setting onload

		    newImg.onload = function() {
		    	img_height = newImg.height;
		    	img_width = newImg.width;
		    }
		}

		function getImgSize()
		{
			return [img_width,img_height];
		}

		return {
			setsize: setImgSize,
			getsize: getImgSize,
			setIndex: setIndex, 
			getIndex: getIndex
		};

	})(jQuery);



	CropPhoto = function(){

		var img_height = 0;
		var img_width = 0;		

		this.removeui = function(){
			$('.jcrop-holder').remove();
			$('.currently-viewed-photo').removeAttr('style');
		}
		
		this.setparams = function(currentIndex){
			
			var $photo = $("a.photo").eq(currentIndex);
			$('#form-input-photoid').val($photo.attr('photoid'));
			var $revertImg = $('.view-revertImg').attr('photoid', $photo.attr('photoid'));
			$revertImg.parent('li').hide();
			if($photo.attr('iscrop') == '1')
				$revertImg.parent('li').show();
			
			$('#imagecrop_crop_image_path').val($photo.find('img').attr('src').split( '?' )[0]);
		}

		this.setparams2 = function(photo){			
			
			$('#form-input-photoid').val(photo.id);
			var $revertImg = $('.view-revertImg').attr('photoid', photo.id);
			$revertImg.parent('li').hide();
			if(photo.isCrop == '1')
				$revertImg.parent('li').show();
			
			$('#imagecrop_crop_image_path').val(photo.src.split( '?' )[0]);
		}
		
		this.clearcords = function(){
			$('#imagecrop_crop input:not(#imagecrop_crop__token)').val('');
		}
		
		
		this.imgWrapper = function(){
			//$('div.imgWrapper img').css("height", "auto");
			//$("div.imgWrapper img").css("width","auto");
			//$('div.img-innerWrapper img').css({'height': 'auto', 'width': 'auto'});
		}

		this.loading = function(){
			
			var $imgloading = $('<img />')
				.attr('src', $('#hidden-photo-loading').val())
				.attr('class','imgloading')
				.css({ 'position': 'absolute', 'z-index': 500, 'height': 'auto', 'width': 'auto', 'top': '30%', 'left': '40%' }),
				$imgWrapper = $('.imgWrapper');	
			
				$imgWrapper.prepend($imgloading);
				
			$('.currently-viewed-photo, .jcrop-holder').css('opacity','0.1');
			
		}
		
		this.removeloading = function(){
			
			$('.imgloading').remove();
		}
		
		this.jCropHolder = function(){
			
			$('.jcrop-holder').css({'margin': '0 auto' });
						
			/*var height = $('.currently-viewed-photo').height();
			var  top = '20px';

			if(height > 580)
				top = '20px';
			else if(height > 300)
				top = '20%';
			else
				top = '30%';*/
			
			//$('.captionWrapper').css({'top': '20%'});
			
		}
		
		this.miniButtonsAction = function(display){

			//$('.captionWrapper').css({'top': '20px'});
			if(display == 'show')
				$('.imgWrapper ul >li:not(:has(a.view-cropImg), :has(a.view-revertImg) )').show('slow');
			else
				$('.imgWrapper ul >li:not(:has(a.view-cropImg), :has(a.view-revertImg) )').hide();
		}
		
		this.doneCroppingBtn = function(){
			me = this;
			$('.cropfile_class').remove();

			var cropbutton = $('<button>', {
				text: 'Done Cropping',
				"id": 'cropfile',
				"class": 'cropfile_class'
			}).on('click',function(){
				me.submitForm();
			}).appendTo($('.img-lowerWrapper'));

		}

		this.submitForm = function(){
			
			$('form[name=photoGallery]').trigger('submit');
			
		}
		
		this.newImg = function(data){
			
			var $currentImg = $('a#img'+ data.id);
			$currentImg.attr('iscrop',data.is_cropped);
			$currentImg.find('img').remove();
			
			var $newImg = $('<img />')
					.attr('src',data.new_image_path + '?' + Math.floor(Math.random()*90000) + 10000)
					.attr('id',data.id);
			
				$currentImg.prepend($newImg);
			
			this.removeloading();
		}

		this.closeImg = function(){

			$('.imgWrapper').fadeOut(300,function(){
				$('.shieldBlack').fadeOut(300);	
			});
		}

	}
	
	
	$(function(){
		/**
		 *	Crop
		 */
		$('.view-cropImg').on('click',function(e){
			
			letCrop();
			
	  	});
		
	  	 var letCrop = function(){
		
			var crop = new CropPhoto();
			crop.removeui();
			crop.clearcords();
			crop.imgWrapper();
			crop.miniButtonsAction('hide');
			crop.doneCroppingBtn();
			imgSz = ImgSize.getsize();

	  	 	var api;
	  		jcrop_api = $.Jcrop('.currently-viewed-photo',{
		      	// start off with jcrop-light class
		      	//aspectRatio: 1,
			    bgOpacity: 0.5,
			    bgColor: 'white',
			    addClass: 'jcrop-light',
			    //boxWidth: 860,
			    //boxHeight: 580,
			    trueSize: [imgSz[0],imgSz[1]],
			    //minSize: [860,580],
			    //maxSize: [900,700],
			    onSelect: updateCoords,
			    onRelease: crop.clearcords
		    },function(){
		      	api = this;
		      	//api.setSelect([130,65,130+350,65+285]);
		      	api.setOptions({ bgFade: true });
		      	api.ui.selection.addClass('jcrop-selection');
		    });

		      function updateCoords(c)
		      {
		        $('#imagecrop_crop_x').val(c.x);
		        $('#imagecrop_crop_y').val(c.y);
		        $('#imagecrop_crop_w').val(c.w);
		        $('#imagecrop_crop_h').val(c.h);
		      };    
			
			crop.jCropHolder();
	  	}
		
		/*
		$('#cropfile').on('click',function(){
			console.log('test');
			$('form[name=photoGallery]').trigger('submit');
		});
		*/

		/**
		*	Form Submission
		*/
		
		$(document).on('submit',"form[name=photoGallery]",function(e){

			e.preventDefault();
			if(validateForm())
				submitform(this,'cropImage','');

		});
		
		/**
		*	Revert 
		*/
		$('.view-revertImg').on('click',function(){
			submitform(this,'revertToOriginal', '&photoid='+$(this).attr('photoid'));
		});

		
	});

	
	/**
 	 *	validate Form Submission
	 */
	function validateForm(){
		
		var error = 0;
		$('#imagecrop_crop input:not(#imagecrop_crop__token)').each(function(){
			if($(this).val() == ""){
				error++;
			}
		});

		if(error > 0)
			return false;

		return true;
	}

	function submitform(me,action,extraParams){
		
		var crop = new CropPhoto();
		crop.loading();

		$.ajax({
			url: Routing.generate('crop_set'),
			data: $(me).serialize() + '&action=' + action + extraParams,
			type: 'POST',
			beforeSend: function(){
				$('a').css({'pointer-events': 'none' });
			},
			success: function(data) {
				if(data.is_success){
					crop.newImg(data); //location.reload();
					//$('a.viewImg-close').trigger('click');
					//crop.closeImg();
					$('a').css({'pointer-events': 'auto' });
					var p = new PhotoViewer();
					var index = ImgSize.getIndex();
					p.updatePhotoAt(index);
				}	
			},
			async: false,
			error: function(xhr) {
			  $.notify('An error occurred while processing the request.', 'Error!!!', true);
			  //location.reload();
			}

		});

	}

})(jQuery)