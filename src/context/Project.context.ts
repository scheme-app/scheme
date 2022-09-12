import { createContext } from "react";

type Project = {
  id: string;
  name: string;
};

type ProjectContext = {
  project: Project;
  setProject: (project: Project) => void;
};

const ProjectContext = createContext<ProjectContext>({
  project: {
    id: "",
    name: "",
  },
  setProject: () => {},
});

export default ProjectContext;
