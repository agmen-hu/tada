# Introduction
[![Travis CI Badge](https://api.travis-ci.org/agmen-hu/tada.svg?branch=master)](https://travis-ci.org/agmen-hu/tada "Travis CI") [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/agmen-hu/tada/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

Tada is a git client that supports multiple git repositories simultaneously. You can fetch patches
from all repositories, or push branches in one step.

Tada has a Consoloid user interface, so it's like a console/terminal/shell but you can use
a natural language, like English (see [this video](https://www.youtube.com/watch?v=fJAnyRuJ0MI)).
If you know the concept of git, you can use tada without any further learning. For example, type
"Fetch patches" to fetch patches. Consoloid can also autocomplete the meaning of partial sentences,
so if you type slowly, just type "fe pa" to (yes you've guessed it) fetch patches.

Tada is under development. Only a subset of git functionality is supported by tada itself. Until
commiting and viewing version tree is possible, it depends on "git gui" and "gitk".

# Getting started

Install tada globally:
```Shell
sudo npm install -g tada
```

Enter the project root directory that holds all your git repositories and run:
```Shell
tada detect
```

That will search for git repositories under the project root and adds them to .tada/project.conf
file.

To start tada simply run it from the project root and open the link in the browser:
```Shell
tada
```

Notes:
 * tada server will start in the background. Run `tada stop` in the project root whenever you wish to stop it.

# Documentation

Starting points:
 * [Tada guide](https://github.com/agmen-hu/tada/wiki/Tada-guide) - the guide for new users

By default, tada collects usage statistics which includes executed commands/sentences without argument
values. Our goal is to better understand user requirements and usage habits and consider collected data
when selecting features to develop. If you do not wish your tada to collect stats, disable the feature
by editing your project config as [described here](https://github.com/agmen-hu/tada/wiki/Usage-statistics).

# Support

For help and discussion you can find us:
 * IRC (freenode): #consoloid-tada
 * Google Groups: http://groups.google.com/group/consoloid-tada (email: consoloid-tada@googlegroups.com)

Known issues:
 * tada does not support Windows yet. It should work on any Linux based OS.

# Extending tada

Tada can be extended with new commands. Look for help at #consoloid-tada IRC channel.
