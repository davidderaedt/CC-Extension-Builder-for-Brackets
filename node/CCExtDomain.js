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
    * Give execution rights to scripts
    * MAC ONLY
    */
    
    function setExecPermissions() {

        var cmd1 = "chmod 755 '" + __dirname + "/scripts/setdebugmode.sh'";
        exec(cmd1, function (error, stdout, stderr) {
            sys.puts(error);
        });
        
        var cmd2 = "chmod 755 '" + __dirname + "/scripts/deployext.sh'";
        exec(cmd2, function (error, stdout, stderr) {
            sys.puts(error);
        });
        
        
        return true;
    }
              

    
    /**
    * @private
    * Update the preferences to allow direct install of extensions
    * MAC ONLY
    */
    
    function setDebugMode() {

        var cmd = "'" + __dirname + "/scripts/setdebugmode.sh'";
        
        exec(cmd, function (error, stdout, stderr) {
            sys.puts(error);
        });
        
        return true;
    }
    
  
    /**
     * @private
     * Returns the path of the home directory
     * @return string
     */
    function cmdInitialize() {
        //console.log(process.env.USER);
        
        setExecPermissions();
        setDebugMode();
        
        return process.env.HOME;
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
            "initialize",    // command name
            cmdInitialize,   // command handler function
            false,          // this command is synchronous
            "initialize domain and returns Home dir",
            [],// parameters
            [{name: "path",
                type: "String",
                description: "user home directory"}]
        );
                
        
    }
        
    exports.init = init;
    
}());
