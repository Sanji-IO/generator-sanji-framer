import config from './component.resource.json';

const $inject = [];
class <%= framerControllerClassName %> {
  constructor(...injects) {
    <%= framerControllerClassName %>.$inject.forEach((item, index) => this[item] = injects[index]);
    this.url = this.externalUrl || config.externalUrl || 'http://www.moxa.com';
  }
}
<%= framerControllerClassName %>.$inject = $inject;
export default <%= framerControllerClassName %>;
