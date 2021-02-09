var gulp = require('gulp');

/**
 * 雪碧图合成任务
 * @type {gulpSpritesmith}
 */
var spritesmith = require('gulp.spritesmith');
//main file
gulp.task('sprite',function () {
    var spriteData = gulp.src('icon/*.png').pipe(spritesmith({
        // imgName: 'img/icon-' + new Date().getTime() + '.png',
        // cssName: 'icon-scss/icon.scss',
        imgName: '../styles/icon-' + new Date().getTime() + '.png',
        cssName: '../styles/icon.scss',
        cssTemplate: 'css.handlebars'
    }));
    return spriteData.pipe(gulp.dest('./'));
});

//generalize lol file
// gulp.task('generalize-lol-sprite',function () {
//     var spriteData = gulp.src('img/generalize/icons-lol/*.png').pipe(spritesmith({
//         imgName: 'img/generalize/icon-lol-' + new Date().getTime() + '.png',
//         cssName: 'css/generalize/lol/icon.scss',
//         cssTemplate: 'css.handlebars'
//     }));
//     return spriteData.pipe(gulp.dest('./'));
// });

gulp.task('default',['sprite'], function(){
    gulp.watch('img/icons/*.png',['sprite']);
    gulp.watch('img/generalize/icons-lol/*.png',['generalize-lol-sprite']);
});
