const express = require("express");
const router = express.Router();
const {
  getTickets,
  createTicket,
  deleteTicket,
  getTicket,
  updateTicket,
  getTicketsByUser,
} = require("../controllers/tickets");

//require auth 
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)

/* GET tickets listing. */
router.get("/", getTickets);
router.get("/user/:id", getTicketsByUser);
router.post("/create", createTicket);
router.delete("/delete/:id", deleteTicket);
router.get("/:id", getTicket);
router.put("/:id", updateTicket);

module.exports = router;
