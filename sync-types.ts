
import {typeSync} from "@hakit/core/sync";
import * as dotenv from 'dotenv';

const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : 'development';
dotenv.config({ path: `.env.${mode}.local` });
async function runner(){
    await typeSync({
        url: `${process.env.VITE_HA_URL}`,
        token: `${process.env.HA_TOKEN}`,
    });
    
}
runner();
