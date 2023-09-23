import { src, dest } from 'gulp';
import { gulpYarn, IGulpYarnOptions } from 'gulp-yarn';

const settings = {
  production: true
} as IGulpYarnOptions;

const yarnTask = function () {
  return src(['./package.json'])
    .pipe(dest('./dist'))
    .pipe(gulpYarn(settings));
};
