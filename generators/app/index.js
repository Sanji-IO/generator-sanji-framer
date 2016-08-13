'use strict';
var path = require('path');
var url = require('url');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var npmName = require('npm-name');
var superb = require('superb');
var _ = require('lodash');
var _s = require('underscore.string');
var uuid = require('uuid');
var optionOrPrompt = require('yeoman-option-or-prompt');

var proxy = process.env.http_proxy ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.HTTPS_PROXY ||
  null;

var githubOptions = {
  version: '3.0.0'
};

if (proxy) {
  var proxyUrl = url.parse(proxy);

  githubOptions.proxy = {
    host: proxyUrl.hostname,
    port: proxyUrl.port
  };
}

var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);

if (process.env.GITHUB_TOKEN) {
  github.authenticate({
    type: 'oauth',
    token: process.env.GITHUB_TOKEN
  });
}

var extractGeneratorName = function (appname) {
  var match = appname.match(/^sanji-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }

  return appname;
};

var emptyGithubRes = {
  name: '',
  email: '',
  html_url: ''
};

var githubUserInfo = function (name, cb, log) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      log.error('Cannot fetch your github profile. Make sure you\'ve typed it correctly.');
      res = emptyGithubRes;
    }

    cb(JSON.parse(JSON.stringify(res)));
  });
};

module.exports = generators.Base.extend({
  _optionOrPrompt: optionOrPrompt,
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('flat', {
      type: Boolean,
      required: true,
      defaults: true,
      desc: 'When specified, generators will be created at the top level of the project.'
    });
  },

  initializing: function () {
    this.pkg = require('../../package.json');
    this.currentYear = (new Date()).getFullYear();
    this.config.set('structure', this.options.flat ? 'flat' : 'nested');
    this.generatorsPrefix = this.options.flat ? '' : 'generators/';
    this.appGeneratorDir = this.options.flat ? 'app' : 'generators';
  },

  prompting: {
    askFor: function () {
      var done = this.async();

      this.log(yosay('Create your own ' + chalk.red('Sanji UI') + ' with superpowers!'));

      var prompts = [{
        name: 'realname',
        message: 'Would you mind telling me your username?',
        default: 'someuser'
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.realname = props.realname;
        done();
      }.bind(this));
    },

    askForEmail: function () {
      var done = this.async();

      var prompts = [{
        name: 'email',
        message: 'Would you mind telling me your email?',
        default: 'hello@world.io'
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.email = props.email;
        done();
      }.bind(this));
    },

    askForGeneratorName: function () {
      var done = this.async();
      var generatorName = extractGeneratorName(this.appname);

      var prompts = [{
        name: 'generatorName',
        message: 'What\'s the base name of your project? Prefix "sanji-" is already exist.',
        default: generatorName
      }];

      this._optionOrPrompt(prompts, function (props) {
        if (props.askNameAgain) {
          return this.prompting.askForGeneratorName.call(this);
        }

        this.generatorName = props.generatorName;
        this.appname = _s.slugify('sanji-' + this.generatorName);

        done();
      }.bind(this));
    },

    askForNgModuleName: function () {
      var done = this.async();

      var prompts = [{
        name: 'moduleName',
        message: 'What\'s the ngModule name of your component?',
        default: this.generatorName
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.moduleName = props.moduleName.toLowerCase();
        this.ngModuleName = 'sanji.' + props.moduleName;
        this.framerName = _.capitalize(props.moduleName.toLowerCase());
        this.constantModuleName = props.moduleName.toUpperCase();
        this.libraryName = 'sj' + _.capitalize(props.moduleName.toLowerCase());
        this.framerComponentClassName = _.capitalize(props.moduleName.toLowerCase()) + 'FramerComponent';
        this.framerControllerClassName = _.capitalize(props.moduleName.toLowerCase()) + 'FramerController';
        this.framerComponentName = 'sanji' + _.capitalize(props.moduleName.toLowerCase()) + 'Framer';
        this.componentTplName = 'sanji-' + props.moduleName.toLowerCase();
        done();
      }.bind(this));
    },

    askForVersion: function () {
      var done = this.async();

      var prompts = [{
        name: 'version',
        message: 'What is your semver version?',
        default: '1.0.0'
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.version = props.version;
        done();
      }.bind(this));
    },

    askForExternalUrl: function () {
      var done = this.async();

      var prompts = [{
        name: 'externalUrl',
        message: 'Specify a url to load in framer'
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.externalUrl = props.externalUrl;
        done();
      }.bind(this));
    },

    askForDescription: function () {
      var done = this.async();

      var prompts = [{
        name: 'description',
        message: 'Description for this compoent'
      }];

      this._optionOrPrompt(prompts, function (props) {
        this.description = props.description;
        done();
      }.bind(this));
    }
  },

  configuring: {
    enforceFolderName: function () {
      if (this.appname !== _.last(this.destinationRoot().split(path.sep))) {
        this.destinationRoot(this.appname);
      }

      this.config.save();
    },

    uuid: function() {
      this.uuid = this.options.uuid || uuid.v4();
    }

  },

  writing: {
    projectfiles: function () {
      this.template('_package.json', 'package.json');
      this.template('_travis.yml', '.travis.yml');
      this.template('editorconfig', '.editorconfig');
      this.template('babelrc', '.babelrc');
      this.template('eslintrc', '.eslintrc');
      this.template('README.md');
      this.template('index.js');
      this.template('webpack.config.js');
      this.template('webpack.build.js');
      this.template('webpack.dev.js');
    },

    npmfiles: function () {
      this.copy('npmignore', '.npmignore');
    },

    gitfiles: function () {
      this.copy('gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
    },

    app: function () {
      this.template('app/index.html');
      this.template('app/app.js');
      this.template('app/app.scss');
    },

    component: function() {
      this.template('app/component/component.resource.json');
      this.template('app/component/component.route.js');

      this.fs.copyTpl(
        this.templatePath('app/component/index.js'),
        this.destinationPath(this.generatorsPrefix, 'app/component/index.js'),
        {
          libraryName: this.libraryName,
          ngModuleName: this.ngModuleName,
          framerComponentClassName: this.framerComponentClassName,
          framerComponentName: this.framerComponentName
        }
      );

      this.fs.copyTpl(
        this.templatePath('app/component/framer.component.js'),
        this.destinationPath(this.generatorsPrefix, 'app/component/framer.component.js'),
        {
          framerComponentClassName: this.framerComponentClassName
        }
      );

      this.fs.copyTpl(
        this.templatePath('app/component/framer.controller.js'),
        this.destinationPath(this.generatorsPrefix, 'app/component/framer.controller.js'),
        {
          framerControllerClassName: this.framerControllerClassName
        }
      );
    },

    server: function () {
      this.fs.copyTpl(
        this.templatePath('server/dev-server.js'),
        this.destinationPath(this.generatorsPrefix, 'server/dev-server.js'),
        {
          superb: superb(),
          generatorName: _s.classify(this.generatorName)
        }
      );
    }
  },

  install: function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] || false, bower: false });
  }
});
