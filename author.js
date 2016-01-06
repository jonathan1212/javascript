    (function($){

        Author = {

            addauthorURL : '/admin.php/program_content_author/addAuthor',
            add_author : function(options)
            {
                settings = $.extend({
                    _callback: function(){}

                },options);

                var addUrl =  Author.addauthorURL;
                $.ajax({
                    url: addUrl,
                    type: "GET",
                    success: function( response ) {
                        
                          setTimeout(function(){
                            tinyMCE.execCommand('mceRemoveControl', false, 'author_description');
                            tinyMCE.execCommand('mceAddControl', false, 'author_description');
                          },500);    
                        
                        $submit = $('<button />', {
                                text: 'Add Author',
                                "id": 'add_author'
                            });

                        $form = $('<form method="POST" id ="add_author_form" enctype="multipart/form-data" />')
                            .attr('action', addUrl)
                            .html(response)
                            .append($submit)
                            .on('submit', function(e){

                                 $('#author_container').prepend('<div class = "loading">'+
                                                '<div class="bar">'+
                                                    '<i class="sphere"></i>'+
                                                '</div>'+
                                                '</div>');
								tinyMCE.triggerSave();
                                var formData = new FormData($('#add_author_form')[0]);
                                 $.ajax({
                                    url: addUrl,
                                    type: "POST",
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function( response ) {
                                        if(response.is_successful){
                                            
                                            $('#content_authorID').val(response.id);
                                            $('#autocomplete_content_authorID').val(response.name);
                                            $('#author_container').dialog('close');

                                            if( typeof settings._callback == 'function' ){
                                                settings._callback.call(this);
                                             }
                                        }
                                        else if(!response.is_successful){

                                            for(i in response.errors) {
                                                if(0 < $.trim(response.errors[i]).length) {

                                                    $('#' + i + '_errors').remove();
                                                    //$('#' + i).after($('<div id="'+i+'_errors" style="display:none;" />').html(response.errors[i]).slideDown().delay(1500).slideUp());
                                                    $('#' + i).after($('<div id="'+i+'_errors" style="display:none;" />').html(response.errors[i]).slideDown().delay(1500));
                                                }
                                            }

                                        }

                                        $('.loading').remove();

                                    }

                                   });
                                 e.preventDefault();

                                

                            })
                            ,

                        $('#author_container').html($form);
                        $('#author_container').dialog({
                            autoOpen: true,
                            modal: true,
                            resizable:true,
                            width: 800,
                            top :20,
                            draggable:false
                        });

                    },
                    complete: function(response){
                        //alert(response);
                    }
                });

            }
        }

    })(jQuery);

