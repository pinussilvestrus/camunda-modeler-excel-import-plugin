# camunda-modeler-excel-import-plugin

> :warning: This project depends on unreleased Camunda Modeler changes.

[![Build Status](https://travis-ci.org/pinussilvestrus/camunda-modeler-excel-import-plugin.svg?branch=master)](https://travis-ci.org/pinussilvestrus/camunda-modeler-excel-import-plugin) [![Compatible with Camunda Modeler Branch hackdays-excel-plugin](https://img.shields.io/badge/Camunda%20Modeler-4.3-blue.svg)](https://github.com/camunda/camunda-modeler)

[Camunda Modeler](https://github.com/camunda/camunda-modeler/) plugin to import Excel Sheets to DMN Tables.

![Screencast](./docs/screencast.gif)

## How to use

1. Download and copy this `plugin` subfolder into the `plugins` directory of the Camunda Modeler
2. Start the Camunda Modeler

Refer to the [plugins documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins#plugging-into-the-camunda-modeler) to get detailed information on how to create and integrate Camunda Modeler plugins.

## Development Setup

Firstly, clone this repository to your machine
```bash
$ git clone https://github.com/pinussilvestrus/excel-to-dmn-plugin.git
$ cd excel-to-dmn-plugin 
$ cd plugin
```

Install all dependencies

```bash
$ npm install
```

To work properly inside the Camunda Modeler this plugin needs to be bundled.

```bash
$ npm run all
```

## Compatibility Notice

This plug-in is currently only compatible with Camunda Modeler `v4.3+`.

## Contributors

This project was built at the 2020 Camunda Summer Hack days.

<a href="https://github.com/felixAnhalt"><img src="https://avatars2.githubusercontent.com/u/40368420?s=460&v=4" title="felixAnhalt" width="80" height="80"></a> <a href="https://github.com/pinussilvestrus"><img src="https://avatars1.githubusercontent.com/u/9433996?s=460&u=0426fea4ffc99242b620874ae84e8920ad643cdc&v=4" title="pinussilvestrus" width="80" height="80"></a>

## Resources

* [Camunda Modeler plugins documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins#plugging-into-the-camunda-modeler)


## License

MIT
