import * as fs from 'fs'

export const writeFile = (data, destination) => fs.writeFileSync(destination, data)

export const readFile = (path, convertFn = null) =>
  convertFn && typeof convertFn === 'function'
    ? convertFn(fs.readFileSync(path))
    : fs.readFileSync(path)
