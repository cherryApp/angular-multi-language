/**
* ng-ml Module
*
* Multi language module for angularjs.
*/
var ngMl = angular.module("ng-ml", []);

ngMl.constant( "NgMlConfig", {

    // Initiale settings.
    "initSettings": {
        "dir": "lang/",
        "prefix": "app-translate-",
        "suffix": ".json",
        "fallback": "en"
    },
    "reg": {
        "_var": /\#([0-9a-zA-Z]*)\#/g,
        "_clean": /\#[0-9a-zA-Z]*\#/g,
        "_key": /[^a-zA-Z0-9_\$]/g,
        "_br": /[\{\}]/g,
        "_space": / +/g
    }

} );

ngMl.config( [ "$provide", function ( $provide ) {
    
    // Decorate $interpolate.
    $provide.decorator( "$interpolate", [ "$delegate", "TranslateService", "NgMlConfig",
        function ( $delegate, TranslateService, NgMlConfig ) {
        
        // Wrapping interpolator.
        var interpolateWrap = function(){
            var interpolationFn = $delegate.apply(this, arguments);
            if( interpolationFn ) {
                return interpolationFnWrap( interpolationFn, arguments );
            }
        };

        // Clean object keys.
        var getVarsFromString = function( str ) {
            var exd = [], m;
            while ((m = NgMlConfig.reg._var.exec(str)) !== null) {
                if (m.index === NgMlConfig.reg._var.lastIndex) {
                    NgMlConfig.reg._var.lastIndex++;
                }
                exd.push( m[1] );
            }
            // console.log( exd );
            return exd;
        };
        var cleanKeys = function( key ) {

            var rVars;
            if ( key.indexOf("#") !== -1 ) {
                rVars = getVarsFromString( key );
                key = key.replace( NgMlConfig.reg._clean, "$" );
            }

            key = key.replace( NgMlConfig.reg._br, "" );
            key = key.trim().replace( NgMlConfig.reg._space, "_" );
            key = key.replace( NgMlConfig.reg._key, "" );

            return {
                "key": key,
                "rvars": rVars
            };

        };

        var pushVars = function( str, vars ) {

            vars = vars.rvars;
            for ( var k in vars ) {
                var kn = parseInt( k, 10 );
                str = str.replace( "$"+(kn+1), vars[k] );
            }
            return str;

        };
 
        // Run interpolation and replace available translation.
        var interpolationFnWrap = function( interpolationFn, interpolationArgs ){
            return function(){

                // Get original result.
                var result = interpolationFn.apply(this, arguments);

                // Find result in translated text.
                // If translates contains result, change it.
                var nResult = false,
                    phrase,
                    last;
                if ( result && result !== "" && typeof result.trim !== "undefined" ) {
                    phrase = cleanKeys( result );
                    nResult = TranslateService.get( phrase.key );
                }
                if ( nResult === false ) {
                    last = cleanKeys( interpolationArgs[0] );
                    nResult = TranslateService.get( last.key );
                }
                if ( nResult !== false ) {
                    result = pushVars( nResult, phrase || last );
                    // result = nResult;
                }

                // Return checked result.
                return result;

            };
        };
 
        angular.extend(interpolateWrap, $delegate);
        return interpolateWrap;

    } ] );

} ] )
.service( "TranslateService", [ "NgMlConfig", '$http', '$q', function( Config, $http, $q ) {

    console.log( "config", Config );


    var getTranslateFile = function() {

        var lang = localStorage.preferredLanguage ? localStorage.preferredLanguage : navigator.language;

        var temp = Config.initSettings.dir+Config.initSettings.prefix+"#lang#"+Config.initSettings.suffix;
        return {
            "current": temp.replace( "#lang#", lang ),
            "fallback": temp.replace( "#lang#", Config.initSettings.fallback )
        };
    };

    var translateFile = getTranslateFile();

    // Instance.
    var TranslateService = function() {

        this.translates = {};

        this._construct = function() {
            
            // Get translates.
            // If current language not found, get fallback language file.
            var self = this;

            this.getLanguageFile( translateFile.current )
                .then( function( d ) {
                    self.translates = d.data;
                } )
                .catch( function( e ) {
                    self.getLanguageFile( translateFile.fallback )
                        .then( function( d ) {
                            console.log( "tjson", d );
                            self.translates = d.data;
                        } );
                } );

        };

        this.getLanguageFile = function( url ) {
            
            var deferred = $q.defer();

            $http.get( url )
                .then( function( d ) {
                    deferred.resolve( d );
                }, function( e ) {
                    deferred.reject( e );
                } );

            return deferred.promise;

        };

        this.get = function( name ) {
            return this.translates[name] || false;
        };

        this._construct();
    
    };

    // Return new instance of the function.
    return new TranslateService();

} ] );
