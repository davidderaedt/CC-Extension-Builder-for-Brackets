/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function () {
    "use strict";
    
    var sys = require('sys');
    var exec = require('child_process').exec;
        
        
    /**
     * @private
     * Handler function for the ccext.copyTemplate command.
     * @return true
     */
    function cmdCopyTemplate(source, extid, cb) {
        
        var cmd = "'" + __dirname + "/scripts/deployext.sh' '" + source + "' " + extid;
        
        exec(cmd, function (error, stdout, stderr) {
            sys.puts(error);
        });

        return cmd;
    }
    
    /**
     * @private
     * Returns the path of the home directory
     * @return string
     */
    function cmdGetHomeDirectory() {
        //console.log(process.env.USER);
        return process.env.HOME;
    }
    
    
    /**
    * @private
    * Update the preferences to allow direct install of extensions
    * MAC ONLY
    */
    
    function setDebugMode() {

        var cmd = __dirname + "/scripts/setdebugmode.sh";
        
        exec(cmd, function (error, stdout, stderr) {
            sys.puts(error);
        });
        
        return true;
    }
    
    
    
    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} DomainManager The DomainManager for the server
     */
    function init(DomainManager) {
        
        if (!DomainManager.hasDomain("ccext")) {
            DomainManager.registerDomain("ccext", {major: 0, minor: 1});
        }

        DomainManager.registerCommand(
            "ccext",       // domain name
            "setDebugMode",    // command name
            setDebugMode,   // command handler function
            false,          // this command is synchronous
            "Update the preferences to allow direct install of extensions",
            [],// parameters
            []// return value
        );
                        
        DomainManager.registerCommand(
            "ccext",       // domain name
            "copyTemplate",    // command name
            cmdCopyTemplate,   // command handler function
            false,          // this command is synchronous
            "Copies the extension template to the appropriate location",
            [
                {
                    name: "source",
                    type: "String",
                    description: "source folder"
                },
                {
                    name: "extid",
                    type: "String",
                    description: "extension id"
                }
            ],// parameters
            [{name: "success",
                type: "String",
                description: "success of file operation"}]
        );
        
        DomainManager.registerCommand(
            "ccext",       // domain name
            "getHomeDirectory",    // command name
            cmdGetHomeDirectory,   // command handler function
            false,          // this command is synchronous
            "Gets user home directory",
            [],// parameters
            [{name: "path",
                type: "String",
                description: "user home directory"}]
        );
                
        
    }
        
    exports.init = init;
    
}());
