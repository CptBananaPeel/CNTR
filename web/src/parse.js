import semver from 'semver'

import { CNTR_FORMAT_VERSION } from './constants.js'

export function parse (dataString) {
  console.time('parse')

  const [headerLine, ...frameLines] = dataString.split(/[\r\n]+/)

  const header = processHeader (headerLine)

  if (!semver.satisfies(header.formatVersion, CNTR_FORMAT_VERSION)) throw new Error ('Incompatible CNTR format!')

  const frames = frameLines
    .map(line => line.split(';')
      .filter(entry => entry)
      .map(entry => entry.split(',')
        .map(processEntry)))

  console.timeEnd('parse')

  return {
    header,
    frames,
  }
}

function processHeader (headerString) {
  const [formatVersion, worldName, missionName, author, captureInterval] = headerString.split(',')
  return {
    formatVersion,
    worldName,
    missionName,
    author,
    captureInterval: Number.parseInt(captureInterval),
  }
}

function processEntry (entry) {
  const number = Number.parseFloat(entry)
  return number.toString() === entry ? number : entry
}
