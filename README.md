# AJAX WP_EDITOR

This code can be used to generate a new wp_editor() at the backend and frontend that you may need after an event. Eveything seems to work perfectly. WYSIWYG, quicktags and all.

## Installation & Usage

- Install the plugin in your WordPress install.
- Create a new page and click generate editor.
- You can add as much editor you want.


## Notes

```php
ob_start();
wp_editor( '', 'initialize');
$editor = ob_get_clean(); // We do not need the editor on the page load so no echo.
```
Above is required to load the required scripts in the footer for wp_editor to load via ajax.

```php
function get_wp_editor() {

	$id = $_POST['editorID'];
	$content = $_POST['content'];

	add_filter( 'wp_default_editor', create_function('', 'return "visual";') );

	wp_editor( $content, $id );

	die();
}

add_action('wp_ajax_get_wp_editor', 'get_wp_editor');
```
function above will send required HTML using ajax.


```js
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
```

This JavaScript code will make an ajax request, and returns back wp_editor required HTML, the **tinymce.init** further calls initialization of tinyMCE editor.
