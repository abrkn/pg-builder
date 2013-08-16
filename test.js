/* global describe, it */
var expect = require('expect.js')
, build = require('./')

describe('where', function() {
    it('adds to wheres', function() {
        var q = build()
        q = q.where('1=1')
        expect(q.wheres[0]).to.eql('1=1')
    })

    it('adds to query', function() {
        var q = build()
        q = q.where('1=1')
        expect(q.text).to.be('SELECT *\nWHERE 1=1')
    })
})

describe('all', function() {
    it('can buid example query 1', function() {
        var q = build()
        .s('type')
        .s('transaction_id', 'created_at')
        .s('amount')
        .f('transaction_view')
        .w('user_id = ${uid}')
        .w('currency_id = ${curr}')
        .p('uid', 123)
        .o('transaction_id', 'desc')
        .o('amount')
        .p('curr', 'EUR')

        expect(q.text).to.be(
            'SELECT type, transaction_id, created_at, amount\n' +
            'FROM transaction_view\n' +
            'WHERE user_id = $1 AND currency_id = $2\n' +
            'ORDER BY transaction_id DESC, amount'
        )
    })
})
