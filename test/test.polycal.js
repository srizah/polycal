var assert = chai.assert;

describe('Polycal.init()', function(){

    it('should return a valid calendar', function(done){
        var cal = new Polycal({
            start: {
                year: 2015,
                month: 5
            },
            months: 6
        });
        assert.equal('object', typeof cal);
        assert.equal(true, !!cal.model);
        assert.equal(6, cal.model.length);
        assert.equal(30, cal.model[0].days.length);
        done();
    });

    it('should return a valid February 2016', function(done){
        var cal = new Polycal({
            start: {
                year: 2016,
                month: 1
            },
            months: 1
        });
        assert.equal(2016, cal.model[0].year);
        assert.equal(1, cal.model[0].month);
        assert.equal(29, cal.model[0].days.length);
        assert.equal(1, cal.model[0].days[0].day);
        done();
    });

    it('should default to 60 months starting this month', function(done){
        var cal = new Polycal(),
            now = new Date();
        assert.equal(true, cal.model.length === 60);
        assert.equal(true, cal.model[0].year === now.getFullYear());
        assert.equal(true, cal.model[0].month === now.getMonth());
        done();
    });

});


describe('Polycal.find()', function(){

    var cal = new Polycal({
        start: {
            year: 2015,
            month: 5
        }
    });

    it('should find month by ISO8601 string', function(done){
        var m = cal.find('2015-08');
        assert.equal(2015, m.year);
        assert.equal(7, m.month);
        assert.equal(31, m.days.length);
        done();
    });

    it('should find day by ISO8601 string', function(done){
        var d = cal.find('2016-08-26');
        assert.equal(2016, d.year);
        assert.equal(7, d.month);
        assert.equal(26, d.date);
        assert.equal(5, d.day);
        done();
    });

    it('should find month by YYYY, MM parameters', function(done){
        var m = cal.find(2017,1);
        assert.equal(2017, m.year);
        assert.equal(1, m.month);
        assert.equal(28, m.days.length);
        done();
    });

    it('should find day by YYYY, MM, DD parameters', function(done){
        var d = cal.find(2017,1,28);
        assert.equal(2017, d.year);
        assert.equal(1, d.month);
        assert.equal(28, d.date);
        assert.equal(2, d.day);
        done();
    });

    it('should throw an error when unable to find a date', function(done){
        assert.throw(function(){
            cal.find(1988,7,26);
        }, Error);
        done();
    });

});


describe('Polycal.today()', function(){

    var cal = new Polycal(),
        now = new Date(),
        today = cal.today();

    it('should return a valid today', function(done){
        assert.equal(true, today.year === now.getFullYear());
        assert.equal(true, today.month === now.getMonth());
        assert.equal(true, today.date === now.getDate());
        assert.equal(true, today.day === now.getDay());
        done();
    });

});

describe('Polycal.Month.table()', function(){

    var cal = new Polycal(),
        m   = cal.model[0],
        t   = m.table();

    it('should return a table element', function(done){
        assert.equal("TABLE", t.tagName);
        done();
    });

    it('should return a table with styling hooks', function(done){
        assert.equal(true, !!t.getElementsByClassName('polycal-header').length);
        assert.equal(true, !!t.getElementsByClassName('polycal-label').length);
        assert.equal(true, !!t.getElementsByClassName('polycal-empty').length);
        assert.equal(true, !!t.getElementsByClassName('polycal-day').length);
        done();
    });

});
