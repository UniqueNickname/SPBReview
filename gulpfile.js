var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglify-es').default,
	cleancss     = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	rsync        = require('gulp-rsync'),
	newer        = require('gulp-newer'),
	rename       = require('gulp-rename'),
	responsive   = require('gulp-responsive'),
	del          = require('del');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: '_site'
		},
		notify: false,
		open: false,
		// online: false, // Work offline without internet connection
		//tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('css'))
	.pipe(gulp.dest('_site/css'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js', // Optional jQuery plug-in (npm i --save-dev jquery)
		'node_modules/ilyabirman-likely/release/likely.js', // Optional likely plug-in (npm i --save-dev ilyabirman-likely)
		'js/_lazy.js', // JS library plug-in example
		'js/_prognroll.js', // JS library plug-in example
		'js/_custom.js', // Custom scripts. Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('js'))
	.pipe(gulp.dest('_site/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// Responsive Images
gulp.task('img-responsive', async function() {
	return gulp.src('img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('img/_@1x'))
		.pipe(responsive({
			'*': [{
				// Produce @2x images
				width: '100%', quality: 90, rename: { prefix: '_@2x/', },
			}, {
				// Produce @1x images
				width: '50%', quality: 90, rename: { prefix: '_@1x/', }
			}]
		})).on('error', function () { console.log('No matching images found') })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('img'))
});
gulp.task('img', gulp.series('img-responsive', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['img/_@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('_site/**')
	.pipe(rsync({
		root: '_site/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch('sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'js/_custom.js'], gulp.parallel('scripts'));
	gulp.watch(['*.html', '_site/*.html'], gulp.parallel('code'));
	// gulp.watch(['*.html', '_site/**/*.html'], gulp.parallel('code'));
	gulp.watch('img/_src/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('img', 'styles', 'scripts', 'browser-sync', 'watch'));
