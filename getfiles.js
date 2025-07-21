import fs from 'fs/promises';
import path from 'path';
import { optionData } from './cal.js';

const d1 = 'D:/Project/pratik_nse_demo/db/reliance/2025/07/14/14/';
// 🔁 Recursively get all files
async function getAllFiles(dir = d1, prefix = '') {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    const relPath = path.join(prefix, dirent.name);

    if (dirent.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, relPath);
      files.push(...subFiles);
    } else {
      files.push(relPath);
    }
  }

  return files;
}
function getRowData(data) {
  const rowData = [];
  data.optionData.forEach((item) => {
    let eachRow = { name: item.name, isOk: item.isOk, diff: item.diff };
    item.option.forEach((eachOption) => {
      eachRow[eachOption.indKey] = eachOption.finalPrice;
    });
    rowData.push(eachRow);
  });
  return rowData[0];
}
async function readFilesSequentially(folder = d1) {
  try {
    const files = await fs.readdir(folder);
    const finalRows = []; // console.log(fullPath);
    for (const file of files) {
      const fullPath = path.join(folder, file);
      const stat = await fs.stat(fullPath);

      if (stat.isFile()) {
        const content = await fs.readFile(fullPath, 'utf8');
        const data = JSON.parse(content).data;
        const optionRes = optionData(data);
        const rowData = getRowData(optionRes);
        finalRows.push(rowData);
        // console.log(rowData);
        // console.log(`--- ${file} ---\n${content}\n`);
      } else {
        console.log(`${file} is a folder, skipping...`);
      }
    }
    // console.log("Final Rows:", finalRows);
    csvFile(finalRows);
    return finalRows;
  } catch (err) {
    console.error('Error reading files:', err);
  }
}
function csvFile(finalRows) {
  const headers = Object.keys(finalRows[0]).join(',') + '\n';
  const rows = finalRows
    .map((row) =>
      Object.values(row)
        .map((val) => (typeof val === 'string' ? `"${val}"` : val)) // Add quotes for strings
        .join(','),
    )
    .join('\n');

  // Combine header and rows
  const csv = headers + rows;

  // Write to file
  fs.writeFile('./csv/' + Date.now() + 'output.csv', csv, 'utf8');

  console.log('CSV file saved as output.csv');
}
export { getAllFiles, readFilesSequentially };
// console.log(getAllFiles(d1).then(files => {
//   console.log(files);
// }   ).catch(err => {
//   console.error('Error:', err);
// }));
readFilesSequentially();
