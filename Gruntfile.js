module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
      pkg : grunt.file.readJSON('package.json'),
      connect : { 
          serve : { // name of the target
              options : {
                  hostname : "localhost",
                  port : 8080,
                  base : "./",
                  open : "http://localhost:8080/ui/Component.html", 
                  middleware : function (connect, options) {
                      // See document in https://github.com/drewzboto/grunt-connect-proxy

                      if (!Array.isArray(options.base)) {
                          options.base = [options.base];
                      }

                      var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                      options.base.forEach(function (base) {
                          middlewares.push(connect.static(base));
                      });

                      var directory = options.directory || options.base[options.base.length - 1];
                      middlewares.push(connect.directory(directory));

                      return middlewares;
                  }
              }
          },
          
          proxies : [
                     {
                  context : '/resources',
                  host : 'vesapui5.dhcp.wdf.sap.corp',
                  port : 8080,
                  https : false,
                  rewrite : {
                      '^/resources' : '/sapui5-dist-1.40/resources'
                  }
              }
          ]
      },
      eslint : {
          target : ["webapp/**/*.js"]
      }
  });

  grunt.registerTask('serve', ['configureProxies:serve', 'connect:serve:keepalive']);

};

