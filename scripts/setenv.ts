const { writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();

const environment = argv.environment;

const isProduction = environment === 'prod';

const targetPath = `./src/environments/environment.ts`;

const envFileContent = `
export const environment = {
  production: ${isProduction},
  apiURL: "${isProduction ? process.env.LATT_PROD_API_URL : process.env.LATT_DEV_API_URL}",
};
`;

writeFile(targetPath, envFileContent, function(err) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
