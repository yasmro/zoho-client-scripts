function isContainFullByteChars(str) {
  return str.match(/^[^\x01-\x7E\xA1-\xDF]+$/)
}