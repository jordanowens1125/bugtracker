
import * as bugsApi from "./bugs";
import * as projectsApi from "./projects";
import * as commentsApi from "./comments";
import * as usersApi from "./users";
import * as aggregateApi from './aggregate'

const api = {
  aggregate: aggregateApi,
  bugs: bugsApi,
  projects: projectsApi,
  users: usersApi,
  comments: commentsApi,
};

export default api;

