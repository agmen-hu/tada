defineClass('Tada.Git.Command.InitialInfo', 'Tada.Git.AbstractServerSideService',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
          forEachRefArguments: {
            '--sort': 'committerdate',
            '--format': "'%(tree) %(refname:short) %(upstream:short) %(committerdate:rfc2822) %(authorname) %(authoremail) %(subject) %(body)'"
          }
        },
        options));
    },

    getInfo: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo) {
        resultCallback("Missing repo request argument");
        return;
      }

      var
        options = {
          repo: this.getRepository(data.repo),
          resCallback: resultCallback,
          localRefList: "",
          remoteRefList: "",
          data: {},
          queue: this.get("async_function_queue")
      };
      options.queue.setDrain(function() {
        options.resCallback(undefined, options.data);
      });

      this.__addTasksToQueue(data.tasks || ["status", "remotes", "localRefList", "remoteRefList"], options);
    },

    __addTasksToQueue: function(tasks, options)
    {
      if (tasks.indexOf("remotes") != -1) {
        options.queue.add(undefined, this.__getRemoteList.bind(this), options);
      }

      if (tasks.indexOf("status") != -1) {
        options.queue.add(undefined, this.__getStatus.bind(this), options);
      }

      if (tasks.indexOf("localRefList") != -1) {
        options.queue.add(undefined, this.__getRefList.bind(this), { target: "refs/heads", options: options });
      }

      if (tasks.indexOf("remoteRefList") != -1) {
        options.queue.add(undefined, this.__getRefList.bind(this),  { target: "refs/remotes", options: options });
      }

      if (tasks.indexOf("localRefList") != -1 || tasks.indexOf("remoteRefList") != -1) {
        options.queue.add(undefined, this.__parseRefLists.bind(this), options);
      }
    },

    __getRemoteList: function(callback, options)
    {
      options.repo.remoteList((function(err, remotes) {
        if (err) {
          this.__callbackWithError(options, err);
          return;
        }
        options.data.remotes = remotes;
        callback();
      }).bind(this));
    },

    __callbackWithError: function(options, err)
    {
      options.resCallback(err);
      options.queue.killQueue();
    },

    __getStatus: function(callback, options)
    {
      options.repo.status((function(err, status) {
        if (err) {
          this.__callbackWithError(options, err);
          return;
        }
        options.data.status = status;
        callback();
      }).bind(this));
    },

    __getRefList: function(callback, options)
    {
      var
        forEachRefArguments = $.extend({ "--perl": undefined }, this.forEachRefArguments),
        $this = this;

      forEachRefArguments[options.target] = undefined;
      options.options.repo.forEachRef(forEachRefArguments, (function(err, refList) {
        if (err) {
          this.__callbackWithError(err);
          return;
        }

        if (options.target == 'refs/heads') {
          options.options.localRefList = refList;
        } else {
          options.options.remoteRefList = refList;
        }
        callback();
      }).bind(this));
    },

    __parseRefLists: function(callback, options)
    {
      var parser = this.create('Tada.Git.Command.OutputParser.RefList'),
        parsedRefList = parser.parse(options.localRefList, options.remoteRefList);

      parsedRefList.status = options.data.status;
      parsedRefList.remotes = options.data.remotes;

      options.data = parsedRefList;
      callback();
    },
  }
);
