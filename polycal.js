(function(root, factory){

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.Polycal = factory();
    }

})(this, function(){


    var
        now         = new Date(),
        year        = now.getFullYear(),
        month       = now.getMonth(),
        date        = now.getDate();


    //==================================
    // Utility Functions
    //==================================

    // Extend given object with any number of additional objects.

    function extend(obj) {
        var ext = Array.prototype.slice.call(arguments, 1), val, i, l, key;
        for (i=0, l=ext.length; i<l; i++) {
            if (!!ext[i] && typeof ext === 'object') {
                for (key in ext[i]) {
                    if (ext[i].hasOwnProperty(key)) {
                        val = ext[i][key];
                        obj[key] = val;
                    }
                }
            }
        }
        return obj;
    }


    // Conform date query to standard query object from ISO8601 string or YYYY,MM,DD args.

    function parseDateQuery() {
        if (arguments.length === 1 && typeof arguments[0] === 'string' && (arguments[0].length === 10 || arguments[0].length === 7)) {
            return makeQuery(arguments[0].split('-'), true);
        } else if ((arguments.length === 2 || arguments.length === 3) && argsAreNumbers(arguments)) {
            return makeQuery(arguments, false);
        } else {
            throw new Error('Unable to parse date. Please use ISO8601 formatting, i.e. YYYY-MM-DD. Or pass YYYY, MM, DD as arguments');
        }
    }


    // Helper functions for date query parsing.

    function makeQuery(arr, rezero) {
        return {
            year: +arr[0],
            month: rezero ? +arr[1] - 1 : +arr[1],
            day: +arr[2]
        };
    }

    function argsAreNumbers(arr) {
        for (var i=0, l=arr.length; i<l; i++) {
            if (typeof arr[i] !== 'number') return false;
        }
        return true;
    }


    // Get number of rows needed for table of given month model.

    function getNumRows(month) {
        return Math.ceil((month.days.length + month.days[0].day) / 7);
    }


    // Create table row with 'n' number of children.

    function makeRow(type, n, transform) {
        var row = document.createElement('tr');
        for (var i=0; i < n; i++) {
            var cell = document.createElement(type);
            if (typeof transform === 'function') {
                row.appendChild(transform(i, cell));
            } else {
                row.appendChild(cell);
            }
        }
        return row;
    }


    //==================================
    // Global
    //==================================

    function Polycal(options) {
        var config = (!!options && typeof options === 'object') ? extend({}, this.defaults, options) : this.defaults;
        this.model = [];
        this.init(config);
    }


    Polycal.prototype.defaults = {

        dayNames: [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ],

        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],

        months: 60,

        start: {
            year: year,
            month: month
        }

    };


    // Initialize with options.

    Polycal.prototype.init = function(_config) {

        var config = _config;

        for (var i=0, l=config.months; i<l; i++) {
            this.model.push(new Month(config.start.year, config.start.month + i));
        }

        //==================================
        // Days
        //==================================

        function Day(year, month, date, dayOfWeek) {
            this.year = year;
            this.month = month;
            this.date = date;
            this.day = dayOfWeek;
        }


        //==================================
        // Months
        //==================================

        function Month(year, month) {

            var numDays     = new Date(year, (month + 1), 0).getDate(),
                dayOfFirst  = new Date(year, month, 1).getDay(),
                daysArray   = [],

                y = year + Math.floor(month/12),
                m = month % 12;

            for (var i=0; i<numDays; i++) {
                daysArray.push(new Day(y, m, i + 1, (dayOfFirst + i) % 7));
            }

            this.year = y;
            this.month = m;
            this.days = daysArray;

        }

        Month.prototype.table = function() {

            var table = document.createElement('table'),
                thead = document.createElement('thead'),
                tbody = document.createElement('tbody'),
                self  = this;

            // Create the table header.
            thead.appendChild(makeRow('th', 1, function(index, cell) {
                cell.textContent = config.monthNames[self.month] + ' ' + self.year;
                cell.setAttribute('colspan', '7');
                cell.className = 'polycal-header'
                return cell;
            }));

            // Create the day labels.
            thead.appendChild(makeRow('th', 7, function(index, cell){
                cell.textContent = config.dayNames[index];
                cell.className = 'polycal-label'
                return cell;
            }));

            // Create calendar day cells.
            for (var i=0; i < getNumRows(this); i++) {
                tbody.appendChild(makeRow('td', 7, function(index, cell){
                    cell.className = 'polycal-empty';
                    return cell;
                }));
            }

            // Render the date number onto each td.
            var dayCells = [].slice.call(tbody.getElementsByTagName('td'), this.days[0].day);
            for (var d=0, l=this.days.length; d < l; d++) {
                dayCells[d].textContent = this.days[d].date;
                dayCells[d].className = 'polycal-day';
            }

            // Slap it all together and return it.
            table.appendChild(thead);
            table.appendChild(tbody);
            table.className = 'polycal';

            return table;

        };

    };


    // Take query per parseDateQuery and return month or day object.

    Polycal.prototype.find = function() {
        var q = parseDateQuery.apply(null, arguments), i, l, m;
        for (i=0, l=this.model.length; i<l; i++) {
            m = this.model[i];
            if (!q.day && m.year === q.year && m.month === q.month) return m;
            if (!!q.day && m.year === q.year && m.month === q.month && m.days[q.day - 1] !== undefined) {
                return m.days[q.day - 1];
            }
        }
        throw new Error('Unable to find date.');
    };


    // Return day object for today.

    Polycal.prototype.today = function() {
        return this.find(year,month,date);
    };


    return Polycal;


});
