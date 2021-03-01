import config from 'commander';

type Config = {
  spec: string,
  port: string,
  imageProvider: string
};

export const configure = (): Config => {
  config
    .option(
      '-s --spec <spec>',
      'URL or path to spec file (yml, or json is same)',
      './spec.yaml'
    )
    .option('-p --port <port>', 'Port for fake API', 3000)
    .option(
      '-i --image-provider <url>',
      'Provider for random image. URL includes width and height parameters',
      'https://picsum.photos/<width>/<height>/?random'
    )
    .parse(process.argv);

  return config.opts() as Config;
};
