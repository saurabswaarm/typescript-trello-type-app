import { InputSetup } from "./components/input-form.js";
import { ListSetup } from "./components/project-list.js";
new InputSetup('app', 'project-input', true, 'user-input');
new ListSetup('app', 'project-list', false, 'active');
new ListSetup('app', 'project-list', false, 'finished');
//# sourceMappingURL=app.js.map