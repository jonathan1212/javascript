
(function($){

 

    $(document).on('click','.share .sharestory,.sharestory',function(e){

        $.sharetoFb($(this),{});
    });

    init = {
        picture: 'http://www.storya.ph/bundles/yolandamain/sandbox/app/images/storya-share.jpg'
    }

    settings = {
        method: 'feed',
        name: 'storya.ph',
        link: 'http://www.storya.ph',
        picture: init.picture,
        caption: '',
        description: '',
        owner: '',
        author:'',
        user: '',
        domain_name: '',
        coverphoto:'',

        shortenedUrl : '',
        url          : (window.location.href).split('#')[0],
        title        : $(document).attr('title'),
        //redirect_uri : '',
        message      : 'www.storya.ph',
        display      : 'popup',
        via          : 'Storya.ph',
        withvia      : 'true',
        related      : '',
        hashtags     : '',
        lang         : '',
    };


    $.sharetoFb = function(obj,setting){
        $me = obj;

        var author = $me.attr('author');
        var owner = $me.attr('owner'); 
        var sharetitle = $me.attr('sharetitle');

        var title = getTitle(author,owner,sharetitle,$me.attr('user'));   

        var options = {
            link: $me.attr('path'),
            caption: title.sharetitle,
            description: $me.attr('description'),
            owner: owner,
            name: title.title,
            user: $me.attr('user'),
            coverphoto: $me.attr('coverphoto')

        }

        

        openFbPopUp(options,setting); 
    }

    $.sharetoFbV2 = function(options,extraparams){

        var author = options.author ? options.author : settings.author;
        var owner = options.owner ? options.owner : settings.owner; 
        var user = options.user ? options.user : settings.user; 
        var coverphoto = options.coverphoto ? options.coverphoto : settings.coverphoto; 
        var domain_name = options.domain_name ? options.domain_name : settings.domain_name; 
        
        var title = getTitle(author,owner,options.sharetitle,user);   
 

        var options = {
            author: options.author,
            link: options.path,
            caption: title.sharetitle,
            description: options.description,
            owner: owner,
            name: title.title,
            user: user,
            coverphoto: coverphoto,
            domain_name: domain_name

        }
        settings = $.extend(settings, options); 

        var func = {
            share: function(obj,extraparams){
                
                obj.on('click',function(){
                    $.shareToFbProcess(extraparams);
                });
            }
        } 

        return func;
    }

    $.shareToFbProcess = function(extraparams){
        var options = settings;
        openFbPopUp(options,extraparams);
    }

    $.truncateText = function(text,limit){
       return truncateText(text,limit);
    }
    
    var getTitle = function(author,owner,sharetitle,user){
        
        var storyAuthor = getPosessiveText(owner);

        if(user){

            if(user == owner)
                var title = 'I Survived to Share My Story';
            /*else if(author == owner){
                var title = 'I Survived to Share My Story';
            }*/else{
                var title = storyAuthor+' Survivor Story';
                var sharetitle = "Narrated by " + author;

            }

        }else{

            var title = storyAuthor+' Survivor Story';
            if(author == owner)
                var sharetitle = "by " + author;
            else
                var sharetitle = "Narrated by " + author;
        }

        return {
            title: title,
            sharetitle: sharetitle
        }
    }

    var openFbPopUp = function( options,extra) {
        
        var options = $.extend(settings, options);
        options.picture = options.coverphoto == '' ? init.picture : options.domain_name + options.coverphoto;
        
        //console.log(options);

        FB.ui(
          options,
          function(response) {
            if (response && response.post_id) {
              //alert('Post was published.');
            } else {
              //alert('Post was not published.');
            }
            if( typeof extra.callback == 'function' ){
                extra.callback.call(this);
            }
          }
        );
    }

    var getPosessiveText = function(text){
        return "s" == text.substr(text.length - 1) ? text +"'" : text + "'s";
    }
  

    var truncateText = function(text,limit){
        text = text.replace(/(<([^>]+)>)/ig,"");
        return text.length > limit ? jQuery.trim(text).substring(0, limit).trim(this) + "..." : jQuery.trim(text).substring(0, 320).trim(this) + '...';
    }

    Twitter = {
        share : function(info) {
            var originalRefer = (info.url || (window.location.href).split('#')[0]);
            var url = info.shortenedUrl;
            if(info.shortenUrl && url=='')
            {
                $.ajax({
                  type: 'GET',
                  data: ({url: originalRefer}),
                  url: '/shorten-url',
                  tryCount : 0,
                  retryLimit : 10,
                  success:function(responseText){
                        info.shortenedUrl = responseText;
                        Twitter.doSharing(info);
                    },
                  error : function(xhr, textStatus) {
                        if (textStatus == 'timeout') {
                            this.tryCount++;
                            if (this.tryCount <= this.retryLimit) {
                                //try again
                                $.ajax(this);
                                return;
                            }            
                            return;
                        }
                        if (xhr.status == 500) {
                            //handle error
                        } else {
                            //handle error
                        }
                    }
                  });
            }
            else
            {
                info.url = (info.url || (window.location.href).split('#')[0]);
                Twitter.doSharing(info);
            }
        },

        doSharing : function(info) {
            var TWEET_URL = "https://twitter.com/intent/tweet";

            var url = (info.shortenedUrl || (window.location.href).split('#')[0]);
            var originalRefer = (info.url || (window.location.href).split('#')[0]);
            originalRefer = info.refererNoHash ? (window.location.href).split('#')[0] : originalRefer;
            var text = encodeURIComponent(info.title ? $.trim(info.title) : "");
            var via = info.via ? $.trim(info.via) : 'GoAbroad';
            var related = encodeURIComponent(info.related) || "";
            var hashtags = encodeURIComponent(info.hashtags) || "";
            var lang = info.lang ? $.trim(info.lang) : "en";

            var location = TWEET_URL+"?original_referer="+originalRefer+"&url="+url+"&text="+text+"&source=tweetbutton&via="+via+"&related="+related+"&hashtags="+hashtags;
            // window.open(location, '_blank');
            var share_win = window.open(location, 'sharewin','left=20,top=20,width=500,height=425,toolbar=1,resizable=0');
            var pollTimer = window.setInterval(function() {
                if (share_win != null && share_win.closed !== false) { // !== is required for compatibility with Opera
                    if ( $.isFunction( info.complete ) ) {info.complete.call(this);}
                    window.clearInterval(pollTimer);
                    return;
                }
            }, 200);
        },

        init : function() {
            !function(d,s,id){
                var js,fjs=d.getElementsByTagName(s)[0];

                if(!d.getElementById(id)){
                    js=d.createElement(s);
                    js.id=id;
                    js.src="https://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js,fjs);
            }}(document,"script","twitter-wjs");
        }
    }


    $.twittershare = function(options){
        var options = $.extend(settings, options);
        enableShare(options);
        

        function enableShare(options){

            $(document).on('click',options.id,function(e){
                Twitter.init();
                Twitter.share(options);

            });

        }
    }

    $.getTitle = function(options){

        var author = options.author ? options.author : settings.author;
        var owner = options.owner ? options.owner : settings.owner; 
        var user = options.user ? options.user : settings.user; 
        var coverphoto = options.coverphoto ? options.coverphoto : settings.coverphoto; 
        var domain_name = options.domain_name ? options.domain_name : settings.domain_name; 
        
        return getTitle(author,owner,options.sharetitle,user);   
    }

})(jQuery);
