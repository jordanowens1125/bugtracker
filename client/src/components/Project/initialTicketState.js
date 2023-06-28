import dayjs from "dayjs";

const initialTicketState = {
  title: "",
  description: "",
  assignedTo: '',
  priority: "Low",
  status: "Open",
  deadline: dayjs(new Date()).format("YYYY-MM-DD"),
};

export default initialTicketState
