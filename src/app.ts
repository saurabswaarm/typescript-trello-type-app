/// <reference path="./components/input-form.ts" />
/// <reference path="./components/project-list.ts" />

namespace app {

new InputSetup('app', 'project-input', true, 'user-input');
new ListSetup('app', 'project-list', false, 'active');
new ListSetup('app', 'project-list', false, 'finished');

}
