# Tada - browser based git ui that supports multiple git repositories
[![Travis CI Badge](https://travis-ci.org/agmen-hu/tada.png)](https://travis-ci.org/agmen-hu/tada "Travis CI") [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/agmen-hu/tada/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

You should definitely try tada if you maintain multiple git repositories in your project.

# Getting started

Install tada globally:
```Shell
sudo npm install -g tada
```

Enter the project root directory that holds all your git repositories and run:
```Shell
tada detect
```

That will search for git repositories under the project root and adds them to .tada/project.conf file.

To start tada simply run it from the project root and open the link in the browser:
```Shell
tada
```

Notes:
 * tada server will start in the background. Run `tada stop` in the project root whenever you wish to stop it.

# Support

For help and discussion you can find us:
 * IRC (freenode): #consoloid-tada
 * Google Groups: http://groups.google.com/group/consoloid-tada (email: consoloid-tada@googlegroups.com)

Known issues:
 * tada does not support Windows yet. It should work on any Linux based OS.

# Extending tada

Tada can be extended with new commands. Look for help at #consoloid-tada IRC channel.
