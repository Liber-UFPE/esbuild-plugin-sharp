import {Plugin} from "esbuild";
import path from "node:path";
import picomatch from "picomatch";

import sharp, {
    AvailableFormatInfo,
    FormatEnum,
    AvifOptions,
    GifOptions,
    HeifOptions,
    Jp2Options,
    JpegOptions,
    JxlOptions,
    OutputOptions,
    PngOptions,
    TiffOptions,
    WebpOptions,
} from "sharp"

export type ImageFormatOptions = OutputOptions
    | JpegOptions
    | PngOptions
    | WebpOptions
    | AvifOptions
    | HeifOptions
    | JxlOptions
    | GifOptions
    | Jp2Options
    | TiffOptions;

interface ImageFormat {
    name: keyof FormatEnum | AvailableFormatInfo,
    extension: string,
    options?: ImageFormatOptions
}

interface ImagesOptions {
    webp?: boolean,
    avif?: boolean,
    includes?: string[],
    excludes?: string[],
    webpOptions?: WebpOptions,
    avifOptions?: AvifOptions,
    extraFormats?: ImageFormat[]
}

const defaultOptions: ImagesOptions = {
    webp: true,
    avif: true,
    includes: ["**/*.{jpg,jpeg,png}"],
    excludes: [],
    webpOptions: {},
    avifOptions: {},
    extraFormats: [],
}

function imagesPlugin(options: ImagesOptions = defaultOptions): Plugin {
    return {
        name: "esbuild-plugin-sharp",
        setup(build) {
            build.onEnd(result => {
                if (!result.metafile) {
                    throw new Error("Expected metafile, but it does not exist. Please set `metafile: true` in the esbuild options.");
                }

                const resolvedOptions = {...defaultOptions, ...options};

                const safeIncludes = resolvedOptions.includes || [];
                const includes = safeIncludes.map(incl => picomatch(incl));

                const safeExcludes = resolvedOptions.excludes || [];
                const excludes = safeExcludes.map(exclude => picomatch(exclude));

                Object.keys(result.metafile.outputs).forEach(file => {
                    if (!includes.some(incl => incl(file))) {
                        return;
                    }

                    if (excludes.some(excl => excl(file))) {
                        return;
                    }

                    const formats = [...(resolvedOptions.extraFormats || [])];
                    if (resolvedOptions.webp) {
                        formats.push({name: "webp", extension: "webp", options: resolvedOptions.webpOptions});
                    }

                    if (resolvedOptions.avif) {
                        formats.push({name: "avif", extension: "avif", options: resolvedOptions.avifOptions});
                    }

                    formats.forEach(async format => {
                        const filePath = path.parse(file);
                        // Allow users to configure extensions either as `.webp` or simply `webp` (with no leading `.`)
                        const extension = format.extension.replace(/^\./, "");
                        const outputImage = `${filePath.dir}/${filePath.name}.${extension}`;
                        await sharp(file).toFormat(format.name, format.options).toFile(outputImage);
                    })
                })
            })
        }
    }
}

module.exports = {imagesPlugin};
