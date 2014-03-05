require('./Webserver');
require('../Configuration/Factory');
require('../Configuration/FileHandler');
defineClass('Tada.Server.Supervisor', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        tadaConfig: undefined,
        env: 'prod',
        logFile: undefined,
        netModule: require('net'),
        childProcessModule: require('child_process'),
        httpModule: require('http')
      }, options));

      if (this.tadaConfig === undefined) {
        this.__createTadaConfig();
      }
    },

    __createTadaConfig: function()
    {
      this.tadaConfig = this.create('Tada.Configuration.FileHandler', {}).loadFrom(process.cwd());
    },

    getConfig: function(path, defaultValue)
    {
      return this.tadaConfig.get(path, defaultValue);
    },

    isServerRunning: function(callback)
    {
      this.__tryToListenOnPort(callback, this.tadaConfig.get('server/port'));
    },

    __tryToListenOnPort: function(callback, port)
    {
      this.testServer = this.netModule.createServer(function() {});

      this.testServer.once('error', function(err) {
        this.__handleTestError(err, callback);
      }.bind(this));

      this.testServer.once('listening', function() {
        this.__handleTestSuccess(callback);
      }.bind(this));

      this.testServer.listen(port);
    },

    __handleTestError: function(err, callback)
    {
      this.testServer.removeAllListeners('listening');

      delete this.testServer;
      callback(undefined, true);
    },

    __handleTestSuccess: function(callback)
    {
      this.testServer.removeAllListeners('error');
      this.testServer.close();
      delete this.testServer;

      callback(undefined, false);
    },

    spawnServer: function()
    {
      console.log("Starting server at http://localhost:" + this.tadaConfig.get('server/port') + '/');

      var logFile = "/tmp/tada-" + Math.random().toString(36).substring(7) + ".log";
      console.log('Log is written to file: ' + logFile);

      var child = this.childProcessModule.spawn(process.argv[0], [ process.argv[1], 'server-foreground', this.env, logFile ], {
        stdio: 'inherit',
        detached: true
      });

      child.unref();
    },

    startServer: function()
    {
      this.isServerRunning(function(err, result) {
        if (err) {
          throw Error(err);
        }

        if (!result) {
          new Tada.Server.Webserver({ env: this.env, tadaConfig: this.tadaConfig, logFile: this.logFile })
            .run();
        } else {
          console.log("Server already started on port " + this.tadaConfig.get('server/port'));
        }
      }.bind(this));
    },

    stopServer: function()
    {
      this.isServerRunning(function(err, result) {
        if (err) {
          throw Error(err);
        }

        if (!result) {
          console.log("Server was not running on port " + this.tadaConfig.get('server/port'));
        } else {
          this.__getPidOfRunningServer(this.__killPid.bind(this));
        }
      }.bind(this));
    },

    __getPidOfRunningServer: function(callback)
    {
      options = "http://localhost:" + this.tadaConfig.get('server/port') + "/pid";
      var req = this.httpModule.request(options, function(res) {
        res.on('data', function (data) {
          callback(data.toString());
        });
      });

      req.end();
    },

    __killPid: function(pid)
    {
      var exec = this.childProcessModule.exec;
      exec("kill " + pid, function (error, stdout, stderr) {
        if (error || stderr) {
          throw Error(error || stderr);
        }

        console.log("Tada stopped");
      });
    }
  }
);
