defineClass('Tada.Server.Router', 'Consoloid.Server.Router',
  {
    configure: function()
    {
      this.__base();
      var application = this.get('webserver').getApplication();
      application.get('/pid', this.returnPid.bind(this));
      return this;
    },

    returnPid: function(req, res)
    {
      res.send(process.pid.toString());
    }
  }
);