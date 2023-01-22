const axios  = require("axios");
var Variables = require('../Variables').default;

export const excludeDatesCheckin = async (props) => {
    const res = await axios.get(`${Variables.hostId}/${props}/excludeDatescheckin`);
    return res.data;
}
