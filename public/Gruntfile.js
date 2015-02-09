module.exports = function (grunt) {
    grunt.loadNpmTasks('steal-tools');

    grunt.initConfig({
        stealBuild: {
            main: {
                options: {
                    system: {
                        config: __dirname + "/config.js",
                        main: "core",
                        baseURL: __dirname + '/',
                        bundlesPath: "js/plugins/dist/bundles"
                    },
                    buildOptions: {}
                }
            }
        }
    });

    grunt.registerTask('build', ['stealBuild']);
};