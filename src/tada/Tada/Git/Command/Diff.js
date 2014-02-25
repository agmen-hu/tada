defineClass('Tada.Git.Command.Diff', 'Tada.Git.AbstractServerSideService',
  {
    getDiff: function(res, data)
    {
      var resultCallback = this.__getResultCallback(res);

      if (!data.repo) {
        resultCallback("Missing repo request argument");
        return;
      }

      var repo = this.getRepository(data.repo),
        args = (data.file) ? data.file : '',
        command = new this.git.Command(repo.path, "diff", [], args);

      command.exec((function(error, stdOut, stdErr) {
        var err = error || stdErr;
        if (err) {
          resultCallback(err);
          return;
        }

        resultCallback(undefined, {
          diffLines: JSON.stringify($.extend(
            {}, this.__removeNotNeededHeaderLines(stdOut.split('\n'))
          ))
        });
      }).bind(this));
    },

    __removeNotNeededHeaderLines: function(lines){
      var
        result = [],
        afterIndexLine = false;


      lines.forEach(function(line) {
        if (!afterIndexLine) {
          result.push(line);
        }

        if (line.substring(0,5) == "index") {
          afterIndexLine = true;
        }

        if (line.substring(0,3) == "+++") {
          afterIndexLine = false;
        }
      });

      return result;
    }
  }
);
