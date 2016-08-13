import route from './component.route';
import <%= framerComponentClassName %> from './framer.component';

const <%= libraryName %> = angular.module('<%= ngModuleName %>', ['sanji.core'])
  .component('<%= framerComponentName %>', <%= framerComponentClassName %>)
  .run(route)
  .name;
export { <%= libraryName %> };
