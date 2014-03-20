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
      this.queue.add(callback, (this.__refresh).bind(this), { arguments: { repo: repo, tasks: tasks }, exceptionCallback: callback });
      return this;
    },

    __refresh: function(callback, options)
    {
      this.get('git.command.initial_info').callAsync(
        'getInfo',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              this.get("git.project").update(options.arguments.repo, data);
              callback();
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    __dealWithError: function(error, callback)
    {
      if (!(error instanceof getClass("Tada.Git.Error.UserMessage"))) {
        throw(error);
      }

      callback(error.toString());
    },

    push: function(callback, repo, remote, branch)
    {
      this.queue.add(callback, (this.__push).bind(this), {
        arguments: {
          repo: repo,
          remote: remote,
          branch: branch
        },
        exceptionCallback: callback
      });

      return this;
    },

    __push: function(callback, options)
    {
      this.get('git.command.push').callAsync(
        'push',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              callback(null, data);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    fetch: function(callback, repo, prune)
    {
      this.queue.add(callback, (this.__fetch).bind(this), {
        arguments: { repo: repo, prune: prune },
        exceptionCallback: callback
      });
      return this;
    },

    __fetch: function(callback, options)
    {
      this.get('git.command.fetch').callAsync(
        'fetch',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              callback(null, data);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    createBranch: function(callback, repo, branch)
    {
      this.queue.add(callback, (this.__createBranch).bind(this), {
        arguments: { repo: repo, branch: branch },
        exceptionCallback: callback
      });
      return this;
    },

    __createBranch: function(callback, options)
    {
      this.get('git.command.create.branch').callAsync(
        'branch',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              callback(null, data);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    deleteRemoteBranch: function(callback, repo, remote, branch)
    {
      this.queue.add(callback, (this.__deleteRemoteBranch).bind(this), {
        arguments: { repo: repo, remote: remote, branch: branch },
        exceptionCallback: callback
      });
      return this;
    },

    __deleteRemoteBranch: function(callback, options)
    {
      this.get('git.command.delete.remote.branch').callAsync(
        'delete',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              callback(null, data);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    deleteLocalBranch: function(callback, repo, branch, unmerged)
    {
      this.queue.add(callback, (this.__deleteLocalBranch).bind(this), {
        arguments: { repo: repo, branch: branch, unmerged: unmerged },
        exceptionCallback: callback
      });
      return this;
    },

    __deleteLocalBranch: function(callback, options)
    {
      this.get('git.command.delete.branch').callAsync(
        'delete',
        [ options.arguments ],
        {
          success: (function(err) {
            try {
              callback(err);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    checkout: function(callback, repo, branch, create)
    {
      this.queue.add(callback, (this.__checkout).bind(this), {
        arguments: { repo: repo, branch: branch, create: create },
        exceptionCallback: callback
      });
      return this;
    },

    __checkout: function(callback, options)
    {
      this.get('git.command.checkout').callAsync(
        'checkout',
        [ options.arguments ],
        {
          success: (function(err) {
            try {
              callback(err);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    rebase: function(callback, repo, branch)
    {
      this.queue.add(callback, (this.__rebase).bind(this), {
        arguments: { repo: repo, branch: branch },
        exceptionCallback: callback
      });
      return this;
    },

    __rebase: function(callback, options)
    {
      this.get('git.command.rebase').callAsync(
        'rebase',
        [ options.arguments ],
        {
          success: (function(err) {
            try {
              callback(err);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    runExternalCommand: function(callback, repo, commandName)
    {
      this.queue.add(callback, (this.__runExternalCommand).bind(this), {
        arguments: { repo: repo, commandName: commandName },
        exceptionCallback: callback
      });
      return this;
    },

    __runExternalCommand: function(callback, options)
    {
      this.get('git.command.external').callAsync(
        'execOnRepo',
        [ options.arguments ],
        {
          success: (function(err) {
            try {
              callback(err);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },

    stash: function(callback, repo, option)
    {
      this.queue.add(callback, (this.__stash).bind(this), {
        arguments: { repo: repo, option: option },
        exceptionCallback: callback
      });
      return this;
    },

    __stash: function(callback, options)
    {
      this.get('git.command.stash').callAsync(
        'stash',
        [ options.arguments ],
        {
          success: (function(data) {
            try {
              callback(null, data);
            } catch(error) {
              this.__dealWithError(error, options.exceptionCallback);
            }
          }).bind(this),
          error: function(err) {
            callback(err);
          }
      });
    },
  }
);
