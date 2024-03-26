# esbuild-plugin-sharp

[![Build](https://github.com/Liber-UFPE/esbuild-plugin-sharp/actions/workflows/build.yml/badge.svg)](https://github.com/Liber-UFPE/esbuild-plugin-sharp/actions/workflows/build.yml)
[![CodeQL](https://github.com/Liber-UFPE/esbuild-plugin-sharp/actions/workflows/codeql.yml/badge.svg)](https://github.com/Liber-UFPE/esbuild-plugin-sharp/actions/workflows/codeql.yml)

And esbuild plugin that generates webp and avif images out-of-the-box, and allows other formats supported by [sharp](https://github.com/lovell/sharp).

## Install

```shell
npm install @liber-ufpe/esbuild-plugin-sharp --save-dev
```

## Usage

> [!IMPORTANT]
> `metafile: true` option is required to generate the images files. See more about [metafile in esbuild docs](https://esbuild.github.io/api/#metafile).

```javascript
import esbuild from "esbuild";
import {imagesPlugin} from "@liber-ufpe/esbuild-plugin-sharp";

esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    metafile: true,
    outfile: "dist/index.js",
    plugins: [imagesPlugin()],
}).catch(() => process.exit(1));
```

Or when customizing the options:

```javascript
import esbuild from "esbuild";
import {imagesPlugin} from "@liber-ufpe/esbuild-plugin-sharp";

esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    metafile: true,
    outfile: "dist/index.js",
    plugins: [imagesPlugin({ webp: false })],
}).catch(() => process.exit(1));
```

If you need to add an extra format, for example, another webp image but with lower quality:

```javascript
import esbuild from "esbuild";
import {imagesPlugin} from "@liber-ufpe/esbuild-plugin-sharp";

esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    metafile: true,
    outfile: "dist/index.js",
    plugins: [
        imagesPlugin({
            extraFormats: [{
                name: "webp",
                extension: ".low.webp",
                options: {
                    quality: 50
                }
            }]
        })
    ],
}).catch(() => process.exit(1));
```

See [sharp documentation](https://sharp.pixelplumbing.com/api-output#toformat) for a full list of supported formats and options for each one of them.

## Options

- `webp`: Enable webp generation.
    - type: `boolean`
    - default: `true`
- `avif`: Enable avif generation.
    - type: `boolean`
    - default: `true`
- `includes`: List of glob patterns to match files that will be included
    - type: `string[]`
    - default: `["**/*.{jpg,jpeg,png}"]`
- `excludes`: glob patterns to exclude files. Takes precedence over includes.
    - type: `string[]`
    - default: `[]`
- `webpOptions`: configuration for webp generation.
    - type: See [docs for details](https://sharp.pixelplumbing.com/api-output#webp)
    - default: `{}`
- `avifOptions`: configuration for avif generation.
    - type: See [docs for details](https://sharp.pixelplumbing.com/api-output#avif)
    - default: `{}`
- `extraFormats`: an array listing other formats to be generated.
    - type: `ImageFormat[]`. ImageFormat has the following options:
        - `name`: name of the format according
          to [what is supported by sharp](https://sharp.pixelplumbing.com/api-output#toformat)
        - `extension`: which extension will be used for the generated file. For example, `.lowquality.webp`.
        - `options`: the options used for each format.
          See [sharp docs](https://sharp.pixelplumbing.com/api-output#toformat) for a list of options for each format.
    - default: `[]`

## References:

- [Serve images in modern formats](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images/)
- [Can I Use WebP image format?](https://caniuse.com/webp)
- [Can I Use AVIF image format?](https://caniuse.com/avif)
