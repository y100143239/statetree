const path = require( "path" );


module.exports = {

    // dev
    // devtool: 'cheap-module-eval-source-map',

    // product
    devtool: 'cheap-module-source-map',

    externals: {
        jquery: 'jQuery'
    },

    entry: {
        app: './src/index.js'
    },

    plugins: [
    ],

    output: {
        filename: 'statetree.js',
        path: path.resolve( __dirname, "dist/" )
    },

    module: {

        rules: [

        ]

    }
};