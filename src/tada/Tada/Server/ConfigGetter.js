defineClass('Tada.Server.ConfigGetter', 'Consoloid.Base.Object',
  {
    getConfig: function(path, defaultValue)
    {
      return this.get('tada_config').get(path, defaultValue);
    }
  }
);