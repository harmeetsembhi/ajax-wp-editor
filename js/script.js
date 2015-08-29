(function($){

	var generateUID = function (separator) {

	    var delim = separator || "-";

	    function S4() {
	        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }

	    return (S4() + S4());
	};

	$(document).ready(function() {

		var button  = $('#generate-metabox'),
			holder  = $('#editor-holder'),
			editor  = $('#wp-1234-wrap'),
			id      = generateUID(),
			initID  = 'initialize'
			preInitSaved = null,
			content;

		button.on('click', function() {

			id      = generateUID();

			content = 'Text Editor with Unique ID: ' + id;

			if( !preInitSaved ) {
				preInitSaved = jQuery.extend(true, {}, tinyMCEPreInit);

				preInitSaved.mceInit[initID].selector = '#placeholder';
				preInitSaved.mceInit['placeholder'] = preInitSaved.mceInit[initID];
				delete preInitSaved.mceInit[initID];

				preInitSaved.qtInit[initID].id = 'placeholder';
				preInitSaved.qtInit['placeholder'] = preInitSaved.qtInit[initID];
				delete preInitSaved.qtInit[initID];
			}


			// Ajax Call
			$.ajax({
				url: ajaxurl,
				method: 'post',
				data: {'action': 'get_wp_editor', 'editorID': id, 'content': content},
				success: function(data) {

					holder.prepend( data );

					rebuild = jQuery.extend(true, {}, preInitSaved);

					rebuild.mceInit['placeholder'].selector = '#' + id;
					rebuild.mceInit[id] = rebuild.mceInit['placeholder'];
					delete rebuild.mceInit['placeholder'];

					rebuild.qtInit['placeholder'].id = id;
					rebuild.qtInit[id] = rebuild.qtInit['placeholder'];
					delete rebuild.qtInit['placeholder'];

					init = rebuild.mceInit[id];

					$wrap = tinymce.$( '#wp-' + id + '-wrap' );

					if ( ( $wrap.hasClass( 'tmce-active' ) || ! rebuild.qtInit.hasOwnProperty( id ) ) && ! init.wp_skip_init ) {

						tinymce.init( init );

						if ( ! window.wpActiveEditor ) {
							window.wpActiveEditor = id;
						}
					}

					if ( typeof quicktags !== 'undefined' ) {

						quicktags( rebuild.qtInit );

						if ( ! window.wpActiveEditor ) {
							window.wpActiveEditor = id;
						}

						QTags( {'id': id } );
                		QTags._buttonsInit();
					}
				}
			});
		});
	});
})(jQuery);
