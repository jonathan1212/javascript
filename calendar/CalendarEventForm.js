/**
 * The class that handles the form for calendar creation and update.
 *
 * calendar_event object properties:
 *  - name(string)          => The name of the calendar.
 *  - is_editable(integer)  => The flag whether the events of this calendar is editable.
 *  - color_code(string)    => The color code of the calendar.
 *  - creator_id(integer)   => The ID of the creator.
 *
 */

(function() {
	/**
	 * Creates a new CalendarEventForm object.
	 */
	CalendarEventForm = function() {
		var props = null;
		var f = null;
		var event_id = null;
		var me = this;
		
		/**
		 * Cleans up the data.
		 *
		 * @param     boolean     callCancel     The flag whether to call the cancel callback.
		 */
		this.cleanUp = function(callCancel) {
			$('.with_bubble').removeClass('with_bubble');
			
			if(null != f && null != props) {
				$('#calendar_event_form_save').unbind();
				$('#calendar_event_form_cancel').unbind();
				$('#calendar_event_form_delete').unbind();
				f.unbind();
				
				var callback = props.cancel;				
				
				f.parent().remove();
				
				f = null;
				props = null;
				event_id = null;
				
				if(callCancel) {
					callback();
				}
			}
			
			return this;
		}
		
		
		this.equals = function(elem_id) {
			return (this.isVisible()) ? (props.elem_id == elem_id) : false; 
		}
		
		/**
		 * Returns true if the event form dialog is visible.
		 */
		this.isVisible = function() {
			return (null != f && null != props);
		}
		
		/**
		 * Initializes the current view.
		 *
		 * @param     object     obj      The options for calendar form.
		 * @param     integer    evt_id
		 */
		this.initialize = function(obj, evt_id) {
			if(null == props) {
				props = {
					elem_id:         (obj.elem_id)         ? obj.elem_id        : '',
					form_url:        (obj.form_url)        ? obj.form_url       : '',
					save_url:        (obj.save_url)        ? obj.save_url       : '',
					delete_url:      (obj.delete_url)      ? obj.delete_url     : '',
					save:            (obj.save)            ? obj.save           : function() {},
					cancel:          (obj.cancel)          ? obj.cancel         : function() {},
					deleteCallback:  (obj.deleteCallback)  ? obj.deleteCallback : function() {},
					onReadyForm:     (obj.onReadyForm)     ? obj.onReadyForm    : function() {},
					location:        (obj.location)        ? obj.location       : 'center',
					position:        (obj.position)        ? obj.position       : {}
				};
				
				event_id = evt_id;
				
				$.get(props.form_url, '', this.init);
			}
		}
		
		this.init = function(form) {
			$('.with_bubble').removeClass('with_bubble');
			
			f = $('<form method="post" />').html(form);
			f.click(function(e) {
				e.stopPropagation();
			});
			f.focus();
			
			var cont = $('<div class="form_bubble" style="position:absolute; top: '+(props.position.top - 55)+'px; left: '+(props.position.left)+'px;" />')
				.append('<img class="setBlock arrow" src="/images/bubbleArrow.png" />')
				.append(f);
			
			$('#' + props.elem_id)
				.addClass('with_bubble')
				.append(cont);
			
			$('#calendar_event_form_save').click(function() {
				var callback = props.save;

				$.post(props.save_url, f.serialize(), function(data) {
					var d = eval('(' + data + ')');

					if(d.is_successful) {
						me.cleanUp(false);

						callback(data);
					}
					else {
						for(i in d.errors) {
							if(0 < $.trim(d.errors[i]).length) {
								$('#' + i + '_errors').remove();
								$('#' + i).after($('<div id="'+i+'_errors" style="display:none;" />').html(d.errors[i]).slideDown().delay(1500).slideUp());
							}
						}
					}
				});

				return false;
			});
			
			$('#calendar_event_form_cancel').click(function() {
				me.cleanUp(true);
				
				return false;
			});
			
			if(null != event_id && 0 < event_id) {
				$('#calendar_event_link_delete').click(function() {
					$(document).unbind('click');
					
					$('<div title="Delete" />')
						.html('<p>Are you sure you want to delete this event?</p>')
						.dialog({
							closeText: 'Cancel',
							modal: true,
							close: function(event, ui) {
								CalendarEventForm.instance();								
							},
							buttons: {
								Cancel: function(e) {
									e.stopPropagation();
									
									$(this).dialog("close");
								},
								Delete: function() {
									$(this).dialog("close");
									
									var callback = props.deleteCallback;

									$.post(props.delete_url, '', function(data) {
										me.cleanUp(false);
										
										callback(data);
									});
								}
							}
						});
					
					return false;
				});
			}
			
			if(cont.offset().top + 442 > $(window).scrollTop() + $(window).height()) {
				$(document).scrollTop(cont.offset().top);
			}
			
			props.onReadyForm();
			
      $(document).click(function(e) {
        if(1 == e.which || 0 == e.which) {
          me.cleanUp(true);
          
          $(me).unbind(e);
        }
      });
		}
	}
	
	var inst = null;
	
	/**
	 * Creates the single instance of CalendarEventForm.
	 * 
	 * @return     CalendaEventForm     The single instance of CalendarEventForm.
	 */
	CalendarEventForm.instance = function() {
		if(null == inst) {
			inst = new CalendarEventForm();
		}
		
		return inst;
	}
})();