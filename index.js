var _ = require('lodash')
, build = module.exports = function(query) {
    query = query ? _.clone(query, true) : {
        params: {},
        wheres: [],
        selects: [],
        orders: [],
        froms: []
    }

    query.values = []

    var parts = []

    parts.push('SELECT ' + (query.selects.length ? query.selects.join(', ') : '*'))

    if (query.froms.length) {
        parts.push('FROM ' + query.froms.join(', '))
    }

    if (query.wheres.length) {
        parts.push('WHERE ' + query.wheres.join(' AND '))
    }

    if (query.orders.length) {
        parts.push('ORDER BY ' + query.orders.map(function(o) {
            return o[0] + (o[1][0] == 'a' ? '' : ' DESC')
        }).join(', '))
    }

    if (query.lim) {
        parts.push('LIMIT ' + parseInt(query.lim, 10))
    }

    if (query.offs) {
        parts.push('OFFSET ' + parseInt(query.offs, 10))
    }

    query.text = parts.join('\n')

    Object.keys(query.params).forEach(function(n) {
        var v = query.params[n]
        query.values.push(v)
        query.text = query.text.replace(
            new RegExp('\\$\\{' + n + '\\}', 'g'),
            '$' + query.values.length)
    }, this)

    query.param = query.p = param.bind(query)
    query.where = query.w = where.bind(query)
    query.order = query.o = order.bind(query)
    query.from = query.f = from.bind(query)
    query.select = query.s = select.bind(query)
    query.limit = query.l = limit.bind(query)
    query.offset = query.skip = offset.bind(query)

    return query
}

function param(n, v) {
    if (typeof n == 'object') {
        Object.keys(n).forEach(function(k) {
            this.params[k] = n[k]
        }, this)
    } else {
        this.params[n] = v
    }
    return build(this)
}

function order(expr, dir) {
    this.orders.push([expr, dir ? dir.toLowerCase() : 'asc'])
    return build(this)
}

function limit(n) {
    this.lim = n
    return build(this)
}

function offset(n) {
    this.offs = n
    return build(this)
}

function from() {
    for (var i = 0; i < arguments.length; i++) {
        this.froms.push(arguments[i])
    }
    return build(this)
}

function select() {
    for (var i = 0; i < arguments.length; i++) {
        this.selects.push(arguments[i])
    }
    return build(this)
}

function where(cond) {
    this.wheres.push(cond)
    return build(this)
}
