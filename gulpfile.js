const gulp = require('gulp'), // Подключаем Gulp
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'), // Подключаем Sass пакет
    pug = require('gulp-pug'), // Подключаем pug
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    spritesmith = require('gulp.spritesmith'), // Подключаем библиотеку создания спрайтов
    merge = require('merge2'), // Подключаем merge
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'), // Подключаем библиотеку для объеденения файлов
    uglifyES = require('uglify-es'),
    composer = require('gulp-uglify/composer'),
    uglify = composer(uglifyES, console), // Подключаем js-минификатор
    order = require("gulp-order"),
    del = require('del'),
    rename = require("gulp-rename"),
    fileinclude = require('gulp-file-include');

let browserSync = require('browser-sync').create();
let pathBuild = './dist/',
    pathSrc = './src/',

    pathFonts = [
        pathSrc + 'fonts/**/*'
    ],

    libsJS = [
        // './node_modules/slick-carousel/slick/slick.min.js',
        // './node_modules/bootstrap/dist/bootstrap.js',
        // './node_modules/bootstrap/js/dist/popover.js',
        // './node_modules/bootstrap/js/dist/tooltip.js',
        // './node_modules/bootstrap/js/dist/util.js',
        // './node_modules/bootstrap/js/dist/modal.js',
        // './node_modules/bootstrap/js/dist/dropdown.js',
        // './node_modules/bootstrap-select/dist/js/bootstrap-select.js',
        // './node_modules/js-image-zoom/js-image-zoom.js',
        // './node_modules/jquery-typeahead/dist/jquery.typeahead.min.js',
        //
        // './node_modules/overlayscrollbars/js/OverlayScrollbars.js',
        // './node_modules/overlayscrollbars/js/jquery.overlayScrollbars.min.js',
        // './node_modules/simplebar/dist/simplebar.min.js',
        // './node_modules/popper.js/dist/popper.js'
    ];

clean = () => {
    return del(['dist']);
};

scssBuild = () => {
    return gulp.src(pathSrc + 'sass/**/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['ie >= 9', 'last 2 version'], cascade: false}))
        .pipe(gulp.dest(pathBuild + 'css'));
};

cleanCSSBuild = () => {
    return gulp.src(pathBuild + 'css/**.css')
        .pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(gulp.dest(pathBuild + 'css/'))
};

pugBuild = () => {
    return gulp.src('src/pug/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))

};

libs = () => {
    return gulp.src(libsJS)
        .pipe(gulp.dest(pathSrc + 'js/libs/'));
};

jsConcat = () => {
    return gulp.src(pathSrc + 'js/**/*.js')
        .pipe(order([
            "libs/*.js",
            "@begin.js",
            "modules/*.js",
            "main.js",
            "@end.js",
            "modulesOnlyJS/*.js",
        ]))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(pathBuild + 'js'));
};

jsCompress = () => {
    return gulp.src(pathBuild + 'js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest(pathBuild + 'js'))
};

imageBuild = () => {
    return gulp.src(pathSrc + 'images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
};

fontsDev = () => {
    return gulp.src(pathFonts)
        .pipe(gulp.dest(pathBuild + 'fonts'));
};

sprite = () => {
    let spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({
        imgName: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    let imgStream = spriteData.images
        .pipe(gulp.dest('src/images/'));
    let cssStream = spriteData.css
        .pipe(gulp.dest('src/sprite/'));
    return merge(imgStream, cssStream);
};

htmlBuild = () => {
    return gulp.src([pathSrc + 'html/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(pathBuild));
};

renameFileToPHP = () => {
    return gulp.src(pathBuild + '*.html')
        .pipe(rename(function (path) {
            path.extname = ".php";
        })).pipe(gulp.dest(pathBuild));
};

browserSyncStart = () => {
    browserSync.init({
        server: pathBuild
    });
};

browserSyncReload = (done) => {
    browserSync.reload();
    done();
};

browserSyncstream = (done) => {
    browserSync.stream();
    done();
};

watchScrFiles = (done) => {
    gulp.watch('src/sass/**/*.+(sass|scss)', gulp.series(scssBuild, cleanCSSBuild, browserSyncReload));
    gulp.watch('src/pug/**/*.+(jade|pug)', gulp.series(pugBuild, browserSyncReload));
    gulp.watch('src/html/**/*.+(htm|html)', gulp.series(htmlBuild, browserSyncReload));
    gulp.watch('src/js/**/*.js', gulp.series(jsConcat, jsCompress, browserSyncReload));
    gulp.watch('src/images/**/*', gulp.series(imageBuild, browserSyncReload));
    // gulp.watch('src/sprite/**/*.png', gulp.series(sprite));
    done();
};
const compressCssJs = gulp.parallel(cleanCSSBuild, jsCompress);
const watch = gulp.parallel(browserSyncStart, watchScrFiles);

const develop = gulp.series(clean, gulp.parallel(scssBuild, htmlBuild, imageBuild, fontsDev, jsConcat), watch);

const build = gulp.series(clean, scssBuild, cleanCSSBuild, gulp.parallel(htmlBuild, imageBuild, fontsDev), jsConcat, jsCompress, renameFileToPHP, watch);

exports.compres = compressCssJs;
exports.clear = gulp.series(clean);
exports.libs = gulp.series(libs);
exports.watch = watch;
exports.dev = develop;
exports.default = build;
