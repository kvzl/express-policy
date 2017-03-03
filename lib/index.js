const _ = require('lodash')

const pathToRegexp = require('path-to-regexp')

const policy = ({ config, policies }) => (req, res, next) => {
  const configList = Object.keys(config).map(key => ({ path: pathToRegexp(key), restrict: config[key] }))

  const url = req.url
  const resource = _.findLast(configList, r => url.match(r.path) !== null)

  const noRestrict = ({ restrict }) => _.isBoolean(restrict) && restrict

  // 沒有寫入 config 的直接通過
  if (!resource || noRestrict(resource)) {
    next()
  }
  else {
    const method = req.method.toLowerCase()

    // 若沒有對應到 method 則採用 '*'
    let list = resource.restrict[method] || resource.restrict['*']

    if (!list) {
      next()
    }
    else {
      if (typeof list === 'string') {
        list = [list]
      }

      const callNext = (index) => (error) => {
        if (error) {
          next(error)
        }
        else if (index === list.length) {
          next()
        }
        else {
          policies[list[index]](req, res, callNext(index + 1))
        }
      }
      callNext(0)()

    }
  }
}

module.exports = policy
