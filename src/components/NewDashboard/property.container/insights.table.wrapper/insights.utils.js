import bwt from "brew-date";
import axios from "axios";
import Variables from "../../../Variables";

class InsightsUtils {
    constructor(options) {
        this.options = options;
    };

    async fetchInsightsCollections(options){
        var me = this,
            collectionData = {};
        const selectedDate = {
            dates: bwt.getBetween(options?.fromDate || bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6), options?.toDate || bwt.getFullDate("yyyy/mm/dd"))
        }

        // Weekly Function!
        async function weeklyEstimate() {
            return await axios.post(`${Variables.hostId}/${me.options.accId}/weeklyestimate`, selectedDate)
        }

        // API calls
        await axios.all([weeklyEstimate()]).then(axios.spread((...responses) => {
           const selectedDatesCollection = responses[0];

           // Bar Chart data from the API
           if (selectedDatesCollection.data.success) {
                collectionData['chartData'] = {
                    label: selectedDatesCollection.data.dates,
                    data: selectedDatesCollection.data.message
                }
           }
        }));
        return collectionData;
    };
}

export default InsightsUtils;