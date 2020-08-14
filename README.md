# excel-to-dmn-plugin

> :warning: This project is still work in progress and depends on unreleased Camunda Modeler changes.

[Camunda Modeler](https://github.com/camunda/camunda-modeler/) plugin to import Excel Sheets to DMN Tables.

![Screencast](./docs/screencast.gif)

## Components

* [`converter`](./converter) - Node.js module to convert `.xlsx` files to DMN 1.3.
* [`plugin`](./plugin) - Camunda Modeler plugin.
* [`api`](./api) (@deprecated) - REST API to the original [`camunda-dmn-xlsx`](https://github.com/camunda/camunda-dmn-xlsx) Java application.

## Installation

Integrate Plugin into [Camunda Modeler](https://github.com/camunda/camunda-modeler/). See the [Plugin Section](./plugin) for further instructions.

## Contributors

This project was built at the 2020 Camunda Summer Hack days.

<a href="https://github.com/felixAnhalt"><img src="https://avatars2.githubusercontent.com/u/40368420?s=460&v=4" title="felixAnhalt" width="80" height="80"></a> <a href="https://github.com/pinussilvestrus"><img src="https://avatars1.githubusercontent.com/u/9433996?s=460&u=0426fea4ffc99242b620874ae84e8920ad643cdc&v=4" title="pinussilvestrus" width="80" height="80"></a>


## License

MIT
