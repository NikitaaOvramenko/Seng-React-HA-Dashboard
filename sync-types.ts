
import {typeSync} from "@hakit/core/sync";
import * as dotenv from 'dotenv';

dotenv.config()
async function runner(){
    await typeSync({
        url: `${process.env.VITE_HA_URL}`,
        token: `${process.env.VITE_HA_TOKEN}`,
    });
    
}
runner();
