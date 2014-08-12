var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  projectfiles: function () {
    this.copy('_bower.json', 'bower.json');
    this.copy('_package.json', 'package.json');
    this.copy('bowerrc', '.bowerrc');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gulpfile.js', 'gulpfile.js');
  },

  app: function() {
    this.directory('api', 'api');
    this.directory('client', 'client');
    this.directory('_docs', '_docs');
    this.copy('server.js', 'server.js');
  }

});
