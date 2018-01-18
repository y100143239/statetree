const $ = require( "jquery" );

const NAMESPACE = "pkui.tree.state";

const StateTree = require( "./tree" );

$.fn.stateTree = function ( options ) {

    if ( typeof options === "string" ) {
        var
            instance = this.data( NAMESPACE )
        ;
        return instance[ options ].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
    }

    this.each( function () {
        var
            $this = $( this ),
            instance = $this.data( NAMESPACE )
        ;

        // 如果没有初始化，则进行初始化
        if ( ! instance ) {
            instance = new StateTree( $this, options );
            $this.data( NAMESPACE, instance );
        }

    } );

    return this;
};