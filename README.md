# JavaScript Responsive Hijri/Gregorian Dual Calendar Library

[![DOI: 10.5281/zenodo.2648846](https://zenodo.org/badge/doi/10.5281/zenodo.2648846.svg)](https://zenodo.org/record/2648846)

[![DOI: 10.5281/zenodo.2600115](https://zenodo.org/badge/doi/10.5281/zenodo.2600115.svg)](https://zenodo.org/record/2600115)

## Demo
Demo [here](https://zulns.github.io/Calendar.js/).

## Dependencies
- [HijriDate.js](https://github.com/ZulNs/HijriDate.js) which allows the use of
[`HijriDate`](https://zulns.github.io/HijriDate.js/hijri-date-api-doc.html) objects, JS library to calculates Hijri dates in the same way as built-in
`Date` object calculates Gregorian dates.
- [w3css](https://github.com/ZulNs/w3css), originally forked from [CSS Framework](https://github.com/JaniRefsnes/w3css) by
[Jan Egil Refsnes](https://github.com/JaniRefsnes) for styling this widget. 

## Usage
Simply put this code snippet to anywhere you want in the body of your html file:

### Offline

```html
<div id="calendar"></div>
<link rel="stylesheet" href="../w3css/w3.css" />
<script type="text/javascript" src="../HijriDate.js/hijri-date.js"></script>
<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript">
    var calendar = new Calendar();
    calendar.attachTo(document.getElementById('calendar'));
    // or use
    // document.getElementById('calendar').appendChild(calendar.getElement());
    // other code
</script>
```

Or online mode:

```html
<div id="calendar"></div>
<link rel="stylesheet" href="https://zulns.github.io/w3css/w3.css" />
<script type="text/javascript" src="https://zulns.github.io/HijriDate.js/hijri-date.js"></script>
<script type="text/javascript" src="https://zulns.github.io/Calendar.js/calendar.js"></script>
<script type="text/javascript">
    var calendar = new Calendar();
    calendar.attachTo(document.getElementById('calendar'));
    // or use
    // document.getElementById('calendar').appendChild(calendar.getElement());
    // other code
</script>
```

## Supported Languages
Languages currently supported are:
- English (en)
- Arabic (ar)
- Indonesian (id)

You can extend with your own language by adding this code snippet (assume your language is English):

```javascript
Calendar.language["en"] = {
    isRTL: false,             // or true for right to left language
    menuItem0: ["Hijri calendar", "Gregorian calendar"],
    menuItem1: "Firstday",
    menuItem2: "Today",
    menuItem3: "New theme",
    menuItem4: "About",
    menuItem5: "Close",
    eraSuffix: ["AD", "BC"],  // suffix for Gregorian era
    hEraSuffix: ["H", "BH"],  // suffix for Hijri era
    monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    monthShortNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    weekdayShortNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hMonthNames: [
        "Muharram",
        "Safar",
        "Rabi'ul-Awwal",
        "Rabi'ul-Akhir",
        "Jumadal-Ula",
        "Jumadal-Akhir",
        "Rajab","Sha'ban",
        "Ramadan",
        "Syawwal",
        "Dhul-Qa'da",
        "Dhul-Hijja"
    ];
    hMonthNames: [
        "Muharram",
        "Safar",
        "Rabi'ul-Awwal",
        "Rabi'ul-Akhir",
        "Jumadal-Ula",
        "Jumadal-Akhir",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Syawwal",
        "Dhul-Qa'da",
        "Dhul-Hijja"
    ];
    hMonthShortNames: ["Muh", "Saf", "RAw", "RAk", "JAw", "JAk", "Raj", "Sha", "Ram", "Sya", "DhQ", "DhH"];
};
```

## API Documentation
API doc [here](calendar-api-doc.md).

&nbsp;

&nbsp;

&nbsp;

---
#### Designed By ZulNs
##### @Gorontalo, 14 January 2019
---
