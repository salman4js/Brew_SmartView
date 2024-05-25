const ReportGenerationWrapperConstants = Object.freeze({
    zeroStateMessage: 'Your applied filter has no data, Try refining your filter criteria!',
    reportErrorMessage: 'Trouble while fetching custom reports lists, please try again later!',
    widgetName: 'customReport',
    selectionField: {
        fromDate: {
            label: 'From Date',
            placeholder: `Select 'from' date for selected report mode`
        },
        toDate: {
            label: 'To Date',
            placeholder: `Select 'to' date for selected report mode`
        },
        searchBtn: {
            btnValue: 'Refine Report'
        }
    }
});

export default ReportGenerationWrapperConstants;