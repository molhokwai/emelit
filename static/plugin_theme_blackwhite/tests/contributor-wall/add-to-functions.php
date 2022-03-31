<?php

/***********
 *  Add specific js to specific pages 
 * 
 *  @doc https://www.collectiveray.com/add-javascript-to-wordpress
 **********/
function collectiveray_load_js_script() {
  /* src: https://www.collectiveray.com/add-javascript-to-wordpress */
  if( is_single(1145) || is_single(1146) || is_single(1310) ) {
    /* IDs: Crowdfunding campaign products posts */
    wp_enqueue_script( 'js-file', 
        get_template_directory_uri() . '/assets/js/custom/contributor-wall.js');
  }
}
add_action('wp_enqueue_scripts', 'collectiveray_load_js_script');

