import fs from 'fs';

import { src, dest, parallel, series, watch } from 'gulp';
import browsersync   from 'browser-sync';
import webpack       from 'webpack';
import webpackStream from 'webpack-stream';
import del           from 'del';
import yargs         from 'yargs';
import scss          from 'gulp-sass';
import autoprefixer  from 'gulp-autoprefixer';
import gcmq          from 'gulp-group-css-media-queries';
import cleanCSS      from 'gulp-clean-css';
import imagemin      from 'gulp-imagemin';
import debug         from 'gulp-debug';
import rename        from 'gulp-rename';
import webp          from 'gulp-webp';
import webphtml      from 'gulp-webp-html';
import webpcss       from 'gulp-webpcss';
import ttf2woff      from 'gulp-ttf2woff';
import ttf2woff2     from 'gulp-ttf2woff2';
import eslint        from 'gulp-eslint';
import fileinclude   from 'gulp-file-include';
import htmlmin       from 'gulp-htmlmin';

import webpackConfig from './webpack.config.js';
    
const buildDir = 'build';
const srcDir = 'src';

const path = {
    build: {
        html:  buildDir + '/',
        css:   buildDir + '/css/',
        js:    buildDir + '/js/',
        img:   buildDir + '/img/',
        fonts: buildDir + '/fonts/',
    },
    src: {
        html:  srcDir + '/*.html',
        css:   srcDir + '/scss/**/*.scss',
        js:    srcDir + '/js/index.js',
        img:   srcDir + '/img/**/*.{jpg,png,svg,ico,webp}',
        fonts: srcDir + '/fonts/*.ttf',
    },
    watch: {
        html:  srcDir + '/**/*.html',
        css:   srcDir + '/**/*.scss',
        js:    srcDir + '/**/*.js',
        img:   srcDir + '/img/**/*.{jpg,png,svg,ico,webp}',
    },
    clean: './' + buildDir + '/'
};

const production = !!yargs.argv.production;

webpackConfig.mode = production ? 'production' : 'development';
webpackConfig.devtool = production ? false : 'eval-cheap-module-source-map';

const server = browsersync.create();

const browserSync = () => {
    server.init({
        server: {
            baseDir: `./${buildDir}/`
        },
    });
};

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest(path.build.html))
        .pipe(server.stream());
};

const css = () => {
    return src(path.src.css)
        .pipe(scss({
            includePaths: 'node_modules/bootstrap/scss',
            outputStyle: 'expanded'
        }))
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrouserList: ['last 5 version'],
            cascade: true
        }))
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(cleanCSS())
        .pipe(rename({
            
        }))
        .pipe(dest(path.build.css))
        .pipe(server.stream());
};

const js = () => {
    return src(path.src.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(dest(path.build.js))
        .pipe(debug({
            'title': 'JS files'
        }))
        .pipe(server.stream());
};

const images = () => {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(src(path.src.img))
        .pipe(dest(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ 
                removeViewBox: false 
            }],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img));
};

const fonts = () => {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
};

const fontsStyle = (cb) => {
    let file_content = fs.readFileSync(srcDir + '/scss/base/_fonts.scss');
    if (file_content == '') {
        fs.writeFile(srcDir+ '/scss/base/_fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(srcDir + '/scss/base/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        });
    }
    cb();
};

const watcher = () => {
    watch(path.watch.html, html);
    watch(path.watch.css, css);
    watch(path.watch.img, images);
    watch(path.watch.js, js);
};

const clean = () => del(path.clean);

export const development = series(clean, parallel(html, css, js, images, fonts), parallel(browserSync, watcher), fontsStyle);
export const prod = series(clean, html, css, js, images, fonts);

export default development;
