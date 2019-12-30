module.exports = function (options) {
  return `${options.$plugin}({
    preFix: ${options.preFix || "'udock-'"}
  })`
}

