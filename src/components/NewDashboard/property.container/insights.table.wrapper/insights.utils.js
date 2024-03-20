import bwt from "brew-date";
import axios from "axios";
import Variables from "../../../Variables";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";


class InsightsUtils {
    constructor(options) {
        this.options = options;
    };

    _prepareChartData(options, parsedResult){
        const chartData = [],
            datesBetween = bwt.getBetween(options.fromDate, options.toDate);
        datesBetween.forEach((date) => {
            const parsedDate = date.replace(/\//g, "-");
            chartData.push(parsedResult[parsedDate] || 0);
        });
        return {data: chartData, label: datesBetween};
    };

    _resultParser(result){
      const parsedResult = {};
      result.map((res) => {
          delete res.roomTypes;
          parsedResult[res.date] = res.totalBillAmount;
      });
      return parsedResult;
    };

    _getAllRoomTypes(){
        return CollectionInstance.getAttribute('roomTypes', 'suiteType');
    };

    _getCurrentWeekDates(){
        return {
            fromDate: bwt.format(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6), 'yyyy/mm/dd'),
            toDate: bwt.getFullDate("yyyy/mm/dd")
        }
    };

    _getFilters(options){
        return {roomType: options.filters !== undefined ? options.filters : this._getAllRoomTypes()}
    };

    _getSelectedDates(options){
        return options.selectedDates.fromDate !== undefined ? options.selectedDates : this._getCurrentWeekDates()
    };

    async fetchInsightsCollections(options){
        const filters = encodeURIComponent(JSON.stringify(this._getFilters(options))),
            selectedDates = encodeURIComponent(JSON.stringify(this._getSelectedDates(options)));
        return await axios.get(`${Variables.hostId}/${this.options.accId}/${filters}/${selectedDates}/insights-filter`).then((result) => {
            if(result.data.success){
                const parsedResult = this._resultParser(result.data.result);
                return this._prepareChartData(this._getSelectedDates(options), parsedResult);
            }
        });
    };
}

export default InsightsUtils;