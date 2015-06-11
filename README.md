# Polycal

Polycal is a tiny javascript library and foundation for building custom calendars. It provides a simple interface to create calendar models, access those models, and create views for those models.

* 1.4kb minified & gzipped.
* No dependencies.
* CommonJS compatible.

## Installation
Download the latest [polycal.js](https://raw.githubusercontent.com/camwiegert/polycal/master/polycal.js) and include it like so...
```html
<script src="/path/to/polycal.js"></script>
```
If you're using a module system like Browserify or Webpack, you can also require Polycal right from your main javascript file like this...
```javascript
var Polycal = require('/path/to/polycal.js');
```

## Usage

#### Initialization
The first thing you'll need to do in order to use Polycal is create an instance.
```javascript
var calendar = new Polycal();
```
Each instance has one enumerable key, which is the model. The model is an object array.
```javascript
Object.keys(calendar); // ["model"]
```

#### Options
You can also initialize Polycal with an options object.
```javascript
var calendar = new Polycal([options]);
```
| Option     | Type     | Description                                                          | Default
|------------|----------|----------------------------------------------------------------------|---------------
| start      | Object   | Takes `year` and `month` keys as numbers. Sets first month of model. | Current month
| months     | Number   | Number of months to model, beginning at `start`.                     | 60
| dayNames   | Array    | Array of 7 day names in order. i.e. ["Monday", "Tuesday", etc]  | ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
| monthNames | Array    | Array of 12 month names in order i.e. ["Jan", Feb"] | ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

#### Model structure
The objects contained in your model array each represent a month.
```javascript
{
  year: 2015,
  month: 0,
  days: Array[30]
}
```
In turn, each month contains an object array wherein each object represents a day. In day objects, `date` represents the day of the month, while `day` represents the day of the week.
```javascript
{
  year: 2015,
  month: 0,
  date: 1,
  day: 4
}
```
**Important:** Polycal models respect [Date()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). So, `year` and `date` are 1-based, while `month` and `day` are zero-based.

## Methods

#### `Polycal.prototype.find( date )`
The find method is the main way to retrieve months and days from your model. It accepts `date` as either an ISO8601 formatted string or as YYYY,MM,DD parameters as numbers.
```javascript
// Find days.
calendar.find('2015-02-18');
=> { year: 2015, month: 1, date: 18, day: 4 }

calendar.find(2015,1,18);
=> { year: 2015, month: 1, date: 18, day: 4 }

// Find months.
calendar.find('2015-02');
=> { year: 2015, month: 1, days: Array[28] }

calendar.find(2015,1);
=> { year: 2015, month: 1, days: Array[28] }
```

#### `Polycal.prototype.today()`
The today method will return the object for today, if it exists.
```javascript
// new Date().toLocaleString(); => "6/11/2015, 2:28:56 PM"
calendar.today();
=> { year: 2015, month: 5, date: 11, day: 4 }
```

#### `Month.prototype.table()`
Each month object in your model has a table method which returns a table element view of itself.
```javascript
var t = calendar.find(2015,7).table();
document.body.appendChild(t);
```
The table will also have classes to act as styling hooks.
```html
<table class="polycal">
  <thead>
    <tr><th colspan="7" class="polycal-header">June 2015</th></tr>
    <tr>
      <th class="polycal-label">Sun</th>
      <th class="polycal-label">Mon</th>
      ...
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="polycal-empty"></td>
      <td class="polycal-day">1</td>
      <td class="polycal-day">2</td>
      ...
    </tr>
  </tbody>
</table>
```