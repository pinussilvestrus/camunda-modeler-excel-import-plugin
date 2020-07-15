# camunda-modeler-excel-import-plugin

[![Compatible with Camunda Modeler version 3.4](https://img.shields.io/badge/Camunda%20Modeler-3.4+-blue.svg)](https://github.com/camunda/camunda-modeler)

WIP

## How to use

1. Download and copy this repository into the `plugins` directory of the Camunda Modeler
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

This plug-in is compatible with Camunda Modeler `v3.4+`.

## Resources

* [Camunda Modeler plugins documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins#plugging-into-the-camunda-modeler)

## License

MIT

