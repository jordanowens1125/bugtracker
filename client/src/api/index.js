
import * as ticketsApi from "./tickets";
import * as projectsApi from "./projects";
import * as commentsApi from "./comments";
import * as usersApi from "./users";

const api = {
  tickets: ticketsApi,
  projects: projectsApi,
  users: usersApi,
  comments: commentsApi,
};

export default api;

