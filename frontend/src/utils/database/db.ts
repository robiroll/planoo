import { Pool } from 'pg'

const client = new Pool({
  user: 'robinson',
  password: 'RazZ13MattazZ',
  database: 'postgres',
  host: 'planoo.cnj09xyahhy1.us-east-2.rds.amazonaws.com',
  port: 5432,
})

export default client
