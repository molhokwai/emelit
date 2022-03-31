
jQuery(document).ready(function(){
    jQuery(".data-evt-triple-click").each(function(index){
        this.addEventListener('click', function (evt) {
          /* triple click */
          if (evt.detail === 3) {
              let attrs = {
                'src': this.src,
              }
              const sep = ',';
              const sep1 = '|:|';

              let params_s = this.dataset.evtTripleClick;
              let params = params_s.split(sep);
              params = params.map( x => x.split(sep1) )

              let new_params = []
              for( let i=0; i<params.length; i++ ){
                  this[ params[i][0] ] = params[i][1];
                  if( params[i][0] in attrs ){
                      params[i][1] = attrs[ params[i][0] ];
                  }
                  new_params.push(`${ params[i][0] }${ sep1 }${ params[i][1] }`)
              }
              console.log(new_params.join(sep))
              this.dataset.evtTripleClick = new_params.join(sep)
          }
        });
    });
});
