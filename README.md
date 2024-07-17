# Fleetbase Verdaccio Extensions Middleware Plugin

The Fleetbase Verdaccio Extensions Middleware Plugin enhances the Fleetbase Registry by providing middleware functionality. This allows the Fleetbase API to connect directly to the Verdaccio package registry to retrieve detailed information and metrics about packages, enhancing the overall efficiency and capabilities of the registry.

This plugin is an essential component of the official Fleetbase registry ([https://registry.fleetbase.io](https://registry.fleetbase.io)), a specialized Verdaccio instance tailored to support both npm and composer protocols. It includes bespoke modifications to cater to the specific needs of the Fleetbase ecosystem, particularly for Fleetbase extensions.

## Features

- **Direct API Connectivity**: Enables the Fleetbase API to interact directly with the Verdaccio registry, fetching details and metrics about stored packages.
- **Enhanced Data Retrieval**: Facilitates comprehensive data access capabilities for registry-stored packages, supporting advanced management and operational tasks.

## Installation

To install the plugin, run the following command in your terminal:

```bash
npm install @fleetbase/verdaccio-fleetbase-extensions-middleware
```

## Configuration

Once installed, configure the plugin in your Verdaccio server's `config.yaml` file. Add the plugin to the middleware section as follows:

```yaml
middlewares:
  fleetbase-extensions-middleware:
    enabled: true
```

Ensure that the plugin is properly enabled and configured to meet your specific operational requirements.

## Usage

After configuration, the Fleetbase API will automatically utilize the middleware to query and retrieve information from the Verdaccio registry. No additional steps are required for basic operation.

## Contributing

We welcome contributions from the community! If you are interested in enhancing the Fleetbase Verdaccio Extensions Middleware Plugin, please review our contribution guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This plugin is released under the AGPL v3 License. See the [LICENSE.md](LICENSE.md) file for more details.

## Support

For support, feature requests, or any questions, please visit our issues page on GitHub at [https://github.com/fleetbase/verdaccio-fleetbase-extensions-middleware/issues](https://github.com/fleetbase/verdaccio-fleetbase-extensions-middleware/issues).

## Acknowledgments

- Thanks to all contributors and maintainers of Verdaccio, without which this plugin would not be possible.
