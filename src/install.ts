import { Client } from 'pg';
import fs from 'fs';
import config from './config';
// import helper from './util/helper';

export default async function () {
    const client = new Client({
        host: config.pgsql.host,
        port: config.pgsql.port ? ~~config.pgsql.port : 5432,
        database: config.pgsql.database,
        user: config.pgsql.user,
        password: config.pgsql.password,
    })
    try {
        await client.connect();
    } catch (err: any) {
        console.error("❌ Postgres connection error: ", err.message);
        return;
    }
    console.log("Postgres connected, Check database status...");
    const sql = "SELECT to_regclass('public.eiai_key')";
    const res = await client.query(sql);
    const regClass = res.rows[0]["to_regclass"];
    if (regClass) {
        console.log("Tables created, skip installation.");
    } else {
        console.log("Tables not exists, installing...");
        const sqlCreate = fs.readFileSync("./src/scripts/create.sql", "utf8");
        await client.query(sqlCreate);
        console.log("Created successfully.");
    }
    await client.end();
    const adminKey = config.admin_api_key;
    if (!adminKey) {
        console.error("❌ Admin API key not set, please set 'ADMIN_API_KEY' in env.");
    }
}