import resource from './component.resource.json';

export default routerHelper => {
  'ngInject';
  routerHelper.configureStates(getStates());

  function getStates() {
    return [{
      state: resource.route.state,
      config: {
        url: resource.route.url,
        template: `<<%= componentTplName %>-framer></<%= componentTplName %>-framer height="100%">`,
        authenticate: resource.authenticate,
        title: resource.title
      }
    }];
  }
};
