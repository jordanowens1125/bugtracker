import dayjs from "dayjs";

export const MAX_TITLE_LENGTH = 30;
export const MAX_DESCRIPTION_LENGTH = 200;
export const initialState = {
  title: "",
  description: "",
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
  history: [],
  members: [],
  bugs: [],
  projectManager: '',
  client: "",
  public: true,
};
