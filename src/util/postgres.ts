
import { Pool } from 'pg';

export default class PGClient {
  pool: any = null;
  debug: boolean = false;


  public static async build(config: any): Promise<PGClient | null> {
    try {
      const pGClient = new PGClient();
      const client = new Pool({
        host: config.host,
        port: config.port ? ~~config.port : 5432,
        database: config.database,
        user: config.user,
        password: config.password,
        max: config.max || 20,
        idleTimeoutMillis: config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: config.connectionTimeoutMillis || 2000,
      });
      pGClient.debug = config.debugMode;
      await client.connect();
      pGClient.pool = client;
      return pGClient;
    } catch (err: any) {
      console.error("❌ Postgres connection error: ", err.message);
    }
    return null;
  }

  public async query(sql: string, params: any): Promise<any[]> {
    if (!this.pool) {
      return []
    }
    if (this.debug) {
      console.log("------------", new Date(), "----------------------------");
      console.log("sql: ", sql);
      console.log("params: ", params);
      console.log("----------------------------------------");
    }
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  public async load(table: string, conditions: any): Promise<any> {
    conditions = conditions || {};
    conditions.where = conditions.where || "1=1";
    conditions.limit = 1;
    conditions.cols = conditions.cols || '*';
    if (conditions.orderBy) {
      conditions.orderBy = 'order by ' + conditions.orderBy;
    } else {
      conditions.orderBy = '';
    }

    // table = "'" + table + "'";
    var sql = `select ${conditions.cols} from ${table} where ${conditions.where} ${conditions.orderBy} limit ${conditions.limit}`;
    var rows = await this.query(sql, conditions.params);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  }


  public loadByKV(table: string, key: string, value: any) {
    return this.load(table, {
      where: key + " = $1",
      params: [value]
    });
  }

  public loadById(table: string, id: any) {
    return this.loadByKV(table, "id", id);
  }

  public async insert(table: string, data: any): Promise<any> {
    const keys = Object.keys(data);

    let placeholders = [];
    let params = [];

    for (const keyIndex in keys) {
      const mIndex = ~~keyIndex;
      placeholders.push(`$${(mIndex + 1)}`);
      params.push(data[keys[mIndex]]);
    }

    const sql = `INSERT into ${table} (${keys.join(", ")}) values (${placeholders.join(", ")}) RETURNING id`;

    const result = await this.query(sql, params);
    return result[0];
    // console.log(result[0]);
  }

  public async update(table: string, data: any): Promise<any> {
    if (!data.id) {
      throw new Error("The updated data must include the id.");
    }

    const keys = Object.keys(data);
    const idIndex = keys.indexOf("id");
    // delete keys[idIndex];
    keys.splice(idIndex, 1);

    let placeholders = [];
    let params = [];

    for (const keyIndex in keys) {
      const mIndex = ~~keyIndex;
      placeholders.push(`$${(mIndex + 1)}`);
      params.push(data[keys[mIndex]]);
    }

    const sql = `UPDATE ${table} SET (${keys.join(", ")}) = (${placeholders.join(", ")}) WHERE id=${data.id} RETURNING id`;

    const result = await this.query(sql, params);
    return result[0];

  }

  public save(table: string, data: any): Promise<any> {
    if (data.id) {
      return this.update(table, data);
    } else {
      return this.insert(table, data);
    }
  }


}

