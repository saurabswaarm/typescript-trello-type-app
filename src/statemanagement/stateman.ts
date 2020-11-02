
import {Project} from "../models/project.js";

type Listener<T> = (proj: T[]) => void; //declaring type for our listener function, with type arguments for what the listener functions process

abstract class State<T>{
    protected listeners: Listener<T>[] = [];

    addListener(func: Listener<T>) {
        this.listeners.push(func);
    }

}

class ProjectState extends State<Project> {
    private static instance: ProjectState;

    private projects: Project[] = [];


    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }

    public addProject(project: Project) {
        this.projects.push(project);
        this.fireListeners();
    }

    public updateItem(itemId: string, status: "active" | "finished") {
        let project = this.projects.find((proj) => proj.id == itemId);
        if (project && project.status !== status) {
            project.status = status;
            this.fireListeners();
        }
    }

    private fireListeners() {
        for (const listener of this.listeners) {
            listener(this.projects);
        }
    }


}

export default ProjectState.getInstance();
