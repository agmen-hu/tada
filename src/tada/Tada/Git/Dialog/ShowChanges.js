defineClass('Tada.Git.Dialog.ShowChanges', 'Tada.Git.Dialog.DataFromModel',
  {
    __constructor: function(options)
    {
      this.__base($.extend({
        repositoryTemplateId: "Tada-Git-Dialog-RepoInfo",
      }, options));
    },

    _processRepository: function(name)
    {
      var repo = this.get("git.project").getRepository(name);
      this._renderRepository(name, {
        repo: repo,
        titleLinks: repo.getFileStatus().isDirty() ? [{
          sentence: "Show changes in tracked files",
          arguments: { "in repo <value>": name },
          referenceText: "Changes in files",
          autoExecute: true
        }] : [],
        message: (!repo.getFileStatus().isDirty() && !repo.getFileStatus().getUntracked().length) ? {
          type: this.__self.MESSAGE_INFO,
          text: __("Repository is clean.")
        } : null,
        otherInfo: {
          templateId: "#Tada-Git-Dialog-ShowChangeRepo",
          data: {
            repo: repo,
            singleRepo: this.arguments.repo
          }
        }
      });
    },

  }
);
