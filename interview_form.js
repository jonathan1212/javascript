(function($){
    var settings;

    InterviewForm = {
        init: function(options) {
            settings = options;        
        },

        getListing: function(options) {
            var me = this;
            this.options = options;
            console.log('ads');

            this.getForm(options['clientID']);
        },

        getForm: function(clientID) {
            var options = this.options;

            $.ajax({
                //dataType: 'JSON',
                type: 'GET',
                data: ({clientID: clientID }),

                url: '/interview/ajaxClientListingDropDown',
                beforeSend: function() {
                    options['programContainer'].html('<p> <i class="fa fa-spinner fa-spin"></i> Loading Programs ...</p>');
                },
                success:function(response){

                    options['programContainer'].html(response);
                    var listingID = options['listingID'];
                    if (listingID && listingID > 0) {
                        console.log(listingID);

                        options['programContainer'].find( $('select option') )
                            .prop('selected',false)
                            .filter('[value="'+listingID+'"]')
                            .prop('selected', true);

                    }
                    
                },
                error:function(obj, e){
                    console.log('An error occurred while retrieving contact username.');
                }
            });

        }

    };

    Callback = {};
    Callback.trigger = function(val) {
        
        var options = $.extend(settings, {
            'clientID': val
        });

        InterviewForm.getListing(options);
    }

    $.fn.extend({
        
        previewImage: function(options) {

            $(this).on('change',function(){
                var file = this.files[0];
                options['previewContainer']
                    .html('<img style="border: 1px solid #000; max-width:200px; max-height:200px;" src="' + URL.createObjectURL(file) + '"/>')
                    .append('<p>' + file.name + '</p>');
            });
        },

        getListing: function(options) {

            if ($(this).val() != 0) {
                var params = $.extend(options, {
                    'clientID': $(this).val()
                });
                
                InterviewForm.getListing(params);
            }

        }

        

    });
    

    $.createInterviewForm = function(options){
        var setting = $.extend({},options); 
        
        create(setting);

        function create(optios) {

            options['form'].on('submit',function(e){
                e.preventDefault();
                
                var formdata = new FormData($(this)[0]);
                query(formdata,'post',{
                    contentType: false,
                    processData: false
                });
            
            });
        }
       
        function appenddata(result){

            setting['container'].html(result);
            setting['container'].find('form').on('submit',function(e){
                e.preventDefault();
                 $(this).find('button').prop('disabled', true);

                var formdata = new FormData($(this)[0]);
                query(formdata,'post',{
                    contentType: false,
                    processData: false
                });
            
            });
        }

        function query(params,type,options) {
            
            var data = $.extend({
                url: "/interview/ajaxInterviewForm",
                data: params,
                type: type,
                contentType: true,
                processData: true,
                beforeSend: function(){
                    setting['container'].find('form .actions button').after('<p> <i class="fa fa-spinner fa-spin"></i> Submitting Form ...</p>');
                }
            },options);

            var jqxhr = $.ajax(data)
            .done(function(data){
                appenddata(data);
            })
            .fail(function(xhr, textStatus, error){
                
                var p = '<p>response text: '+xhr.responseText+'</p>'+
                        '<p>'+error+'</p>';

                $div = $('<div/>')
                .addClass('container interview-form-ty')
                .html(p);

               appenddata($div);
            });
        }
        
   }

})(jQuery)