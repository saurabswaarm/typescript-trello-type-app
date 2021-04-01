import {InputSetup} from "./components/input-form";
import {ListSetup} from "./components/project-list"

new InputSetup('app', 'project-input', true, 'user-input');
new ListSetup('app', 'project-list', false, 'active');
new ListSetup('app', 'project-list', false, 'finished');

console.log('poo');