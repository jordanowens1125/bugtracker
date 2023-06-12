
import * as bugsApi from "./bugs";
import * as projectsApi from "./projects";
import * as commentsApi from "./comments";
import * as usersApi from "./users";

const api = {
  bugs: bugsApi,
  projects: projectsApi,
  users: usersApi,
  comments: commentsApi,
};

export default api;

