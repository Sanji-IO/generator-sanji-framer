import FramerController from './framer.controller';

const <%= framerComponentClassName %> = {
  bindings: {
    externalUrl: '<'
  },
  template: `<iframe ng-src="{{$ctrl.url | trustAsResourceUrl}}"
              width="100%" scrolling="no" style="border: 0; height: 100%;"></iframe>`,
  controller: FramerController
};
export default <%= framerComponentClassName %>;
