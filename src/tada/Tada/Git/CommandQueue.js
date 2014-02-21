defineClass('Tada.Git.CommandQueue', 'Consoloid.Base.Object',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        queue: options.queue || options.container.get("async_function_queue")
      }, options));
    },

    createChildQueue: function()
    {
      return this.create('Tada.Git.CommandQueue', {queue: this.queue.createChildQueue(), container: this.container});
    },

    killQueue: function()
    {
      this.queue.killQueue();
      return this;
    },

    refresh: function(callback, repo, tasks)
    {
      this.queue.add(callback, (this.__refresh).bind(this), { repo: repo, tasks: tasks });
      return this;
    },

    __refresh: function(callback, options)
    {
      this.get('git.command.initial_info').callAsync(
        'getInfo',
        [ options ],
        {
          success: (function(data) {
            this.get("git.project").update(options.repo, data);
            callback();
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    push: function(callback, repo, remote, branch)
    {
      this.queue.add(callback, (this.__push).bind(this), {
        repo: repo,
        remote: remote,
        branch: branch
      });

      return this;
    },

    __push: function(callback, options)
    {
      this.get('git.command.push').callAsync(
        'push',
        [ options ],
        {
          success: (function(data) {
            callback(null, data);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    fetch: function(callback, repo, prune)
    {
      this.queue.add(callback, (this.__fetch).bind(this), { repo: repo, prune: prune });
      return this;
    },

    __fetch: function(callback, options)
    {
      this.get('git.command.fetch').callAsync(
        'fetch',
        [ options ],
        {
          success: (function(data) {
            callback(null, data);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    createBranch: function(callback, repo, branch)
    {
      this.queue.add(callback, (this.__createBranch).bind(this), { repo: repo, branch: branch });
      return this;
    },

    __createBranch: function(callback, options)
    {
      this.get('git.command.create.branch').callAsync(
        'branch',
        [ options ],
        {
          success: (function(data) {
            callback(null, data);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    deleteRemoteBranch: function(callback, repo, remote, branch)
    {
      this.queue.add(callback, (this.__deleteRemoteBranch).bind(this), { repo: repo, remote: remote, branch: branch });
      return this;
    },

    __deleteRemoteBranch: function(callback, options)
    {
      this.get('git.command.delete.remote.branch').callAsync(
        'delete',
        [ options ],
        {
          success: (function(data) {
            callback(null, data);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    deleteLocalBranch: function(callback, repo, branch, unmerged)
    {
      this.queue.add(callback, (this.__deleteLocalBranch).bind(this), { repo: repo, branch: branch, unmerged: unmerged });
      return this;
    },

    __deleteLocalBranch: function(callback, options)
    {
      this.get('git.command.delete.branch').callAsync(
        'delete',
        [ options ],
        {
          success: (function(err) {
            callback(err);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    checkout: function(callback, repo, branch, create)
    {
      this.queue.add(callback, (this.__checkout).bind(this), { repo: repo, branch: branch, create: create });
      return this;
    },

    __checkout: function(callback, options)
    {
      this.get('git.command.checkout').callAsync(
        'checkout',
        [ options ],
        {
          success: (function(err) {
            callback(err);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    rebase: function(callback, repo, branch)
    {
      this.queue.add(callback, (this.__rebase).bind(this), { repo: repo, branch: branch });
      return this;
    },

    __rebase: function(callback, options)
    {
      this.get('git.command.rebase').callAsync(
        'rebase',
        [ options ],
        {
          success: (function(err) {
            callback(err);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    runExternalCommand: function(callback, repo, commandName)
    {
      this.queue.add(callback, (this.__runExternalCommand).bind(this), { repo: repo, commandName: commandName });
      return this;
    },

    __runExternalCommand: function(callback, options)
    {
      this.get('git.command.external').callAsync(
        'execOnRepo',
        [ options ],
        {
          success: (function(err) {
            callback(err);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    stash: function(callback, repo, option)
    {
      this.queue.add(callback, (this.__stash).bind(this), { repo: repo, option: option });
      return this;
    },

    __stash: function(callback, options)
    {
      this.get('git.command.stash').callAsync(
        'stash',
        [ options ],
        {
          success: (function(data) {
            callback(null, data);
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },
  }
);
