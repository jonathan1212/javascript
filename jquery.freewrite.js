var yolandaNotifier = YolandaNotifier(),
FreeWrite = (function($){
	return {
		init : function() {
			var urlAutoSave = $('#pathToAutoSAve').val();

			var editor = new MediumEditor('div.story-main', {
	            buttonLabels: 'fontawesome',
	            cleanPastedHTML: true,
	            forcePlainText: false,
	            targetBlank: true,
        	});

			$.kcAutoSave({
				url : urlAutoSave,
				every : 5000,
				unique_key : $.now(),
				callbacks: {
					coverphoto: {
						start: function(){
                            $("#add-cover-photo img").attr("src" , "/bundles/yolandamain/sandbox/app/images/loader.gif");
                        },
						success: function(image_source) {
							$("#add-cover-photo img").attr("src" , "/bundles/yolandamain/sandbox/app/images/add-photo.png");
							$('.story-image-wrapper').attr('style', 'background: url("'+image_source+'") #21ebba center center; background-size: cover;');
						},
					}
				},
				before_save: function() {
                    yolandaNotifier.showInfoNotification('Saving...', 'autosave_status', true);
                },
                success_save: function() {
                    yolandaNotifier.showSuccessNotification('Saved', 'autosave_status');
                },
				error_save : function(response) {
					FreeWrite.bindErrorMessage(response.responseJSON);
				}
			});

        	$('div.story-main').focus(function() {
        		$('p.error').remove();
        		if ($.trim($(this).text()) == 'Start writing your story here...') {
        			$(this).html('<br>');
        		}
        	}).blur(function() {
        		if (!$.trim($(this).text()).length) {
        			FreeWrite.bindErrorMessage('Story should have a content.');
        		}
        	})
		},	

		bindSaveAndOrPublishStory : function() {
			$('#save, #save-and-publish').on('click', function() {
				var id      = $(this).data('id'),
					action  = $(this).html(),
					urlSave = $(this).data('url'),
					$story  = $('div.story-main'),
					publish = (this.id == "save-and-publish") ? 1 : 0;
				
				// added by Nash Lesigon <nash.lesigon@goabroad.com>
				// truncate description for fbshare
				var description = ( $('.story-main').text().length > 250 ) ? $('.story-main').text().substr(0,247) + "..." : $('.story-main').text() ;
				$.sharetoFbV2({description: description });
					
				FreeWrite.bindAjaxRequest($story, id, urlSave, publish, action);
			});
		},

		bindAjaxRequest : function($story, id, urlSave, publish, action) {
			var data = {}, _data;

			data['content'] = $.trim($story.html());
			data['storyId'] = id;
			data['owner']   = '';
			data['publish'] = publish;
			
			var tags = StoryTags.getTags();
            for (var i=1; i<=tags.length; i++) {
                data['tag-' + i] = tags[i-1];
            }

			_data =  {'data' : data };


			$.ajax({
				type : 'POST',
				url  : urlSave,
				data : _data,
				async: false,
				beforesend : function() {
					yolandaNotifier.showInfoNotification(action.substr(0, action.length - 1) + 'ING..', id);
				},
				success : function(response) {
					yolandaNotifier.showSuccessNotification(action + ' SUCCESS', id);

					if(publish == 1){
						$.shareToFbProcess({
							callback: function(){
								window.location.href = $story.data('url');							
		 					}
						});
					}
				},
				error : function(response) {
					FreeWrite.bindErrorMessage(response.responseJSON);
				}
			}).done(function() {
				if(publish == 0)
					window.location.href = $story.data('url');
			});	
		},

		bindRemoveStory : function() {
			$('#remove-story').on('click', function() {
				var id        = $(this).data('id'),
					action    = $(this).html(),
					urlRemove = $(this).data('url');

				if(confirm("Are you sure you want to delete this story?")) {

					$.ajax({
						type : 'POST',
						url  : urlRemove,
						beforesend : function() {
							yolandaNotifier.showInfoNotification(action + 'ING...', id);
						},
						success : function(response) {
							yolandaNotifier.showSuccessNotification(action + ' SUCCESS', id);
						}
					}).done(function() {
						window.location.href = $('div.story-main').data('url');
					});
				}
			});
		},	

		bindErrorMessage : function(msg) {
			if (!$('p.error').length) {
				$('.story-content').prepend('<p class="error" style="font-size: 19px">' + msg + "</p>");
			}
		}
	}
})(jQuery);

$(document).ready(function() {
	FreeWrite.init();
	FreeWrite.bindSaveAndOrPublishStory();
	FreeWrite.bindRemoveStory();
});
   