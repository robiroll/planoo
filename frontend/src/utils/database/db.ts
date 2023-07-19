import { Pool } from 'pg'

const client = new Pool({
  user: 'robinson',
  password: '26510873',
  database: 'planoodb',
  host: 'planoo-db.cnyhxnhzmjke.eu-central-1.rds.amazonaws.com',
  port: 5432,
})

export default client
