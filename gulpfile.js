'use strict';

var gulp             = require('gulp');                  // основной плагин gulp
var uglify           = require('gulp-uglify');           // минификация js
var clean            = require('gulp-dest-clean');       // очистка
var sourcemaps       = require('gulp-sourcemaps');       // sourcemaps
var rename           = require('gulp-rename');           // переименвоание файлов
var plumber          = require('gulp-plumber');          // предохранитель для остановки гальпа
var concat           = require('gulp-concat');           // конкатизация
var replace          = require('gulp-replace');          // замена файлов
var watch            = require('gulp-watch');            // расширение возможностей watch
var gutil            = require('gulp-util');
var autoprefixer     = require('gulp-autoprefixer');
var cleanCSS         = require('gulp-csso');
var csscomb          = require('gulp-csscomb');
var browserSync      = require('browser-sync').create(); // лайврелоад и сервер
var size             = require('gulp-size');             // отображение размера файлов в консоли
var ghpages          = require('gulp-gh-pages');         // публикация на gh-pages
var newer            = require('gulp-newer');
var notify           = require('gulp-notify');           // вывод уведомлений
var merge            = require('merge-stream');
var source           = require('vinyl-source-stream');
var babel            = require("babel-core");
var browserify       = require("browserify");
var babelify         = require("babelify");
var buffer           = require("vinyl-buffer");
var reload           = browserSync.reload;               // перезагрузка сервера


var path = {
    build: {                                             // Тут мы укажем куда складывать готовые после сборки файлы
        common       : 'build/',
        html         : 'build/',
        js           : 'build/js/',
        css          : 'build/css/'
    },
    src: {                                               // Пути откуда брать исходники
        html         : 'src/*.html',
        js           : 'src/js/**/*.js',
        css          : 'src/css/**/*.*'
    },
    watch: {                                             //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html         : 'src/**/*.html',
        js           : 'src/js/**/*.js',
        css          : 'src/css/**/*.*'
    },
    clean            : './build/',                       // директории которые могут очищаться
    outputDir        : './build/**/*'                    // исходная корневая директория
};

var onError = function(err) {
    notify.onError({
		title: "Error in " + err.plugin,
    })(err);
    this.emit('end');
};

// ЗАДАЧА: билд html
gulp.task('html:build', function () {
  gulp.src(path.src.html)                             // Выберем файлы по нужному пути
    .pipe( plumber({errorHandler: onError}) )
    .pipe( size({
        showFiles: true,
        showTotal: false,
        title    : 'HTML'
    }) )
    .pipe( gulp.dest(path.build.html) )               // Выплюнем их в папку build
    .pipe( reload({stream: true}) );                   // И перезагрузим наш сервер для обновлений
});

// ЗАДАЧА: билд css
gulp.task('css:build', function() {
  gulp.src(path.src.css)                             // Выберем файлы по нужному пути
    .pipe( plumber({errorHandler: onError}) )
    .pipe( sourcemaps.init() )
    .pipe( concat('style.css') )
    .pipe( autoprefixer({                             // добавляем префиксы
        browsers: ['last 2 versions']
     }) )
    .pipe( csscomb() )
    .pipe( size({
        showFiles: true,
        showTotal: false,
        title    : 'Common CSS'
    }) )
    .pipe( gulp.dest(path.build.css) )
    .pipe( rename('style.min.css') )
    .pipe( cleanCSS() )
    .pipe( sourcemaps.write('/') )
    .pipe( size({
        showFiles: true,
        showTotal: false,
        title    : 'Minified CSS'
    }) )
    .pipe( gulp.dest(path.build.css) )               // Выплюнем их в папку build
    .pipe( reload({stream: true}) );                   // И перезагрузим наш сервер для обновлений
});

gulp.task("browserify", function() {
    const b = browserify({
        entries: "src/js/app.js",
        debug: true,
    });

    return b
    .transform(babelify.configure({
  		babelrc: '.babelrc'
	}))
    .bundle()
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .on('error', function(err){
        gutil.log(gutil.colors.red.bold('[browserify error]'));
        gutil.log(err.message);
        this.emit('end');
    })
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(path.build.js));
});

// ЗАДАЧА: билд js
gulp.task('js:build', ['browserify'], function() {
  return gulp.src([
  		"src/js/usesvg.js",
  		"build/js/app.js"
  	])
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))                    // инициализируем sourcemap
 	.pipe( concat('bundle.js') )                  // объеденим все файлы javascript
    .pipe( sourcemaps.write("./") )                       // пропишем карты
    .pipe( size({
        showFiles: true,
        showTotal: false,
        title    : 'Total JavaScript'
    }) )
    .pipe( gulp.dest(path.build.js) )
    .pipe( reload({stream: true}) );
});

// ЗАДАЧА: очистка директории /build
gulp.task('clean', function() {
  return gulp.src(path.clean)
    .pipe( clean(path.clean) );
});

// ЗАДАЧА: запуска сервера
gulp.task('server', function() {
  browserSync.init({                                  // запускаем локальный сервер (показ, автообновление, синхронизацию)
    server: {                                         // папка, которая будет «корнем» сервера (путь из константы)
        baseDir    : "./build/"
    },
    port           : 3000,                            // порт, на котором будет работать сервер
    startPath      : '/index.html',                   // файл, который буде открываться в браузере при старте сервера
    // tunnel         : "rapt0p7"                        // наименование сайта для доступа из интернета (вида site-name.localtunnel.me)
    // open           : false                            // возможно, каждый раз стартовать сервер не нужно...
  });
});

// ЗАДАЧА: выгрузка в gh-Pages, запуск вручную
gulp.task('deploy', function() {
  return gulp.src(path.outputDir)
    .pipe( ghpages() );
});

// ЗАДАЧА: билд всего
gulp.task('build', [
    'clean',
    'html:build',
    'css:build',
    'js:build'
]);

// ЗАДАЧА: отслеживание изменений
gulp.task('watch', function() {
     //билдим html в случае изменения
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
     //билдим css в случае изменения
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
     //билдим js в случае изменения
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
});

gulp.task('default', ['build', 'watch', 'server']);
