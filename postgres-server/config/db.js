// db.js
const postgres = require("postgres");
require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');

// const connectionString = process.env.CONNECTION_STRING;
// const sql = postgres(connectionString);

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

module.exports = supabase;
