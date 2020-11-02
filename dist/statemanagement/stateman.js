class State {
    constructor() {
        this.listeners = [];
    }
    addListener(func) {
        this.listeners.push(func);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addProject(project) {
        this.projects.push(project);
        this.fireListeners();
    }
    updateItem(itemId, status) {
        let project = this.projects.find((proj) => proj.id == itemId);
        if (project && project.status !== status) {
            project.status = status;
            this.fireListeners();
        }
    }
    fireListeners() {
        for (const listener of this.listeners) {
            listener(this.projects);
        }
    }
}
export default ProjectState.getInstance();
//# sourceMappingURL=stateman.js.map