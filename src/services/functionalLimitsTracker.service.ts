import * as fs from 'fs';
import * as path from 'path';
import { getWorkingDataDirPath } from '../utils'
import logger from '../utils/logger';

const WORKING_DIR = getWorkingDataDirPath();


export const getTimesBalanceShownToUserToday = (accountId: number) => {
  makeDirIfNotExist(WORKING_DIR);

  const targetFileName = getFileNameForToday();
  const fileExists = fs.existsSync(path.join(WORKING_DIR, targetFileName));

  if (fileExists) {
    const pathToTargetFile = path.join(WORKING_DIR, targetFileName);
    const bufferData = fs.readFileSync(pathToTargetFile);
    const arrayData = JSON.parse(bufferData.toString());
    const mapData = new Map<number, number>(arrayData);
    const currentValForAccount = mapData.get(accountId);
    return currentValForAccount ?? 0;
  }

  return 0;
};

export const incrementTimesBalanceShownToUserToday = (accountId: number) => {
  makeDirIfNotExist(WORKING_DIR);

  const targetFileName = getFileNameForToday();
  const pathToTargetFile = path.join(WORKING_DIR, targetFileName);
  const fileExists = fs.existsSync(pathToTargetFile);

  if (fileExists) {
    fs.readFile(pathToTargetFile, (err, data) => {
      if (err) {
        logger.error(`Failed to read file at ${pathToTargetFile}. Error: ${err}`);
      }

      const dataMap = new Map<number, number>(JSON.parse(data.toString()));
      const currentTimesForThisUser = dataMap.get(accountId);

      if (currentTimesForThisUser) {
        // the user has already requested balance today
        const incremented = currentTimesForThisUser + 1;
        dataMap.set(accountId, incremented);
      } else {
        // the user has NOT requested balance today
        dataMap.set(accountId, 1);
      }

      const mapArray = Array.from(dataMap.entries());
      const dataMapAsText = JSON.stringify(mapArray);
      writeNewMapToFile(pathToTargetFile, dataMapAsText);
    });

  }

  if (!fileExists) {
    const dataMap = new Map();
    dataMap.set(accountId, 1);
    const mapArray = Array.from(dataMap.entries());
    const dataMapAsText = JSON.stringify(mapArray);
    writeNewMapToFile(pathToTargetFile, dataMapAsText);
  }
}


//
// PRIVATE FUNCTIONS BELOW
//
function makeDirIfNotExist(pathToDir: string) {
  const exists = fs.existsSync(pathToDir);
  if (!exists) {
    fs.mkdirSync(pathToDir);
  }
}

function writeNewMapToFile(pathToTargetFile: string, dataMapAsText: string) {
  fs.writeFile(pathToTargetFile, dataMapAsText, (err) => {
    if (err) {
      logger.error(`Failed to write file at path ${pathToTargetFile}. Error: ${err}`);
    }
  });
}


function getFileNameForToday() {
  const todayDate = new Date();
  const fileName = `accountsShownMetrics_${todayDate.getDate()}-${todayDate.getMonth()}-${todayDate.getFullYear()}.txt`;

  return fileName;
}
