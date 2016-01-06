jQuery(function ($) {

    $.settings = {

        // Custom Options ------------------------------------------------------
        // note: This example uses js data arrays for data instead of HTML tables

        // Columns - The columns data-array
        columns: [
            {label: 'Country', type: 'string'},
            {label: '2013', type: 'number'},
            {label: '2014', type: 'number'},
            {label: '2015', type: 'number'}],

        // Rows - The rows data-array
        // If colIndexes array has values the row data will be inserted into the columns
        // defined in the colindexes array. Otherwise the row data will be appended
        // to any existing row data extracted from an HTML table or Google Sheet
        rows: [
            ['China', 18, 11, 9],
            ['Japan', 12, 8, 9],
            ['Russia', 10, 9, 7],
            ['Mexico', 5, 4, 2],
            ['Brazil', 6, 2, 1],
            ['Italy', 4, 3, 5]],

        // The class to apply to the table element
        tableClass: 'col-table',

        // Create Table - String
        // Create a basic HTML table or a Google Table Chart from chart data
        // Options: false, 'basic-table', 'table-chart'
        // Note: This table will replace an existing HTML table
        createTable: 'basic-table',

        // The chart type - String
        // Derived from the Google Charts visualization class name
        // Default: 'BarChart'
        // Use TitleCase names. eg. BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
        // See Google Charts Gallery for a complete list of Chart types
        // https://developers.google.com/chart/interactive/docs/gallery
        chartType: 'ColumnChart',

        // The data title
        // A title used to identify the set of data
        // Used as a caption when generating an HTML table
        dataTitle: 'Column Chart Data',

        // The chart aspect ratio custom option - width/height
        // Used to calculate the chart dimensions relative to the width or height
        // this is overridden if the Google Chart's height and width options have values
        // Suggested value: 1.25
        // Default: false - not used
        chartAspectRatio: 1.5,

        width: 500,
        height: 400,

        // Google Column Chart Options
        columnChart: {

            // Width of chart in pixels - Number
            // Default: automatic (unspecified)
            width: 600,

            // Height of chart in pixels - Number
            // Default: automatic (unspecified)
            height: 400,

            chartArea: {
                left: "10%",
                top: 30,
                width: "90%",
                height: "65%"
            },

            // The font size in pixels - Number
            // Or use css selectors as keywords to assign font sizes from the page
            // For example: 'body'
            // Default: false - Use Google Charts defaults
            //fontSize: 'body',

            // The font family name - String
            // Default: body font family
            fontName: 'Roboto',

            // Chart Title - String
            // Default: Table caption.
            title: 'Column Chart',

            titleTextStyle: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: 'h4'
            },
            legend: {

                // Legend position - String
                // Options: bottom, top, left, right, in, none.
                // Default: bottom
                position: 'bottom'
            },

            // Array of colours
            colors: ['#a82180', '#dd61b8', '#ff99e1'],

            // Stack values within a bar or column chart - Boolean
            // Default: false.
            isStacked: true,

            tooltip: {

                // Shows tooltip with values on hover - String
                // Options: focus, none.
                // Default: focus
                trigger: 'focus'
            }
        },

        // Google Bar Chart Options
        barChart: {

            // Width of chart in pixels - Number
            // Default: automatic (unspecified)
            width: 400,
            height: 200,

            // Height of chart in pixels - Number
            // Default: automatic (unspecified)

            chartArea: {
                left: "20%",
                top: 30,
                width: "74%",
                height: "80%"
            },

            // The font size in pixels - Number
            // Or use css selectors as keywords to assign font sizes from the page
            // For example: 'body'
            // Default: false - Use Google Charts defaults
            //fontSize: 'body',

            // Font-family name - String
            // Default: The body font-family
            fontName: 'Roboto',

            // Chart Title - String
            // Default: Table caption.
            title: 'Bar Chart',

            titleTextStyle: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: 'h4'
            },
            legend: {

                // Legend position - String
                // Options: bottom, top, left, right, in, none.
                // Default: bottom
                position: 'bottom'
            },

            // Array of colours
            colors: ['#a82180', '#dd61b8', '#ff99e1', '#DDB1C7'],

            // Stack values within a bar or column chart - Boolean
            // Default: false.
            isStacked: false,

            tooltip: {

                // Shows tooltip with values on hover - String
                // Options: focus, none.
                // Default: focus
                trigger: 'focus'
            }
        },

        lineChart: {

            // Width of chart in pixels - Number
            // Default: automatic (unspecified)
            width: null,

            // Height of chart in pixels - Number
            // Default: automatic (unspecified)
            height: 400,

            chartArea: {
                left: "20%",
                top: 30,
                width: "74%",
                height: "80%"
            },

            // The font size in pixels - Number
            // Or use css selectors as keywords to assign font sizes from the page
            // For example: 'body'
            // Default: false - Use Google Charts defaults
            //fontSize: 'body',

            // The font family name. String
            // Default: body font family
            fontName: 'Roboto',

            // Chart Title - String
            // Default: Table caption.
            title: 'Line Chart',

            titleTextStyle: {

                // The font size in pixels - Number
                // Or use css selectors as keywords to assign font sizes from the page
                // For example: 'body'
                // Default: false - Use Google Charts defaults
                fontSize: 'h4'
            },
            legend: {

                // Legend position - String
                // Options: bottom, top, left, right, in, none.
                // Default: bottom
                position: 'bottom'
            },

            // Array of colours
            colors: ['#94ac27', '#3691ff', '#bf5cff'],

            tooltip: {

                // Shows tooltip with values on hover - String
                // Options: focus, none.
                // Default: focus
                trigger: 'focus'
            }
        },

        // Show table as well as chart - String
        // Options: 'show', 'hide', 'remove'
        showTable: 'show'
    };


    $.fn.extend({
        chart: function(option) { 

            var options = $.extend($.settings,option);

            if (option['height'] && option['width']) {
                $.settings['barChart']['height'] = option['height'];
                $.settings['barChart']['width'] = option['width'];
            }

            $(this).chartinator(options);

        }


    });


});

