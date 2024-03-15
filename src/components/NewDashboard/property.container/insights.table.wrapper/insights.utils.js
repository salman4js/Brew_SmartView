import bwt from "brew-date";
import axios from "axios";
import Variables from "../../../Variables";

class InsightsUtils {
    constructor(options) {
        this.options = options;
    };

    async fetchInsightsCollections(){
        var me = this,
            collectionData = {};
        const weeklyData = {
            dates: bwt.getBetween(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6), bwt.getFullDate("yyyy/mm/dd"))
        }

        const monthlyData = {
            datesBetween: bwt.getAllDatesOfMonth(new Date().getFullYear(), new Date().getMonth())
        }

        // Weekly Function!
        async function weeklyEstimate() {
            return await axios.post(`${Variables.hostId}/${me.options.accId}/weeklyestimate`, weeklyData)
        }

        // Monthly Function!
        async function monthlyEstimate() {
            return await axios.post(`${Variables.hostId}/${me.options.accId}/totaldailycalculator`, monthlyData)
        }

        // Room Type Revenue Calculation!
        async function dailyRoomTypeEstimate() {
            return await axios.post(`${Variables.hostId}/${me.options.accId}/roomtypeanalysis`, {date: bwt.getFullDate("yyyy/mm/dd")})
        }

        // API calls
        await axios.all([weeklyEstimate(), monthlyEstimate(), dailyRoomTypeEstimate()]).then(axios.spread((...responses) => {
           const weekly = responses[0];
           const monthly = responses[1];
           const roomType = responses[2];

           // Weekly Bar Chart data from the API
           if (weekly.data.success) {
                collectionData['weeklyData'] = {
                    label: weekly.data.dates,
                    data: weekly.data.message
                }
           }

           // Monthly Line chart data from the API
           if (monthly.data.success) {
                collectionData['monthlyData'] = {
                    label: monthly.data.label,
                    data: monthly.data.dailyCollection
                }
           }

           // Room Type Revenue!
           if (roomType.data.success) {

           }

        }));
        return collectionData;
    };
}

export default InsightsUtils;