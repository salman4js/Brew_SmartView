// Handle checkin time format!
export function handleTimeFormat(time) {
    try {
      const [hour, minutes] = time.split(":");
      var min = minutes.length > 1 ? minutes : "0" + minutes;
      if (hour > 12) {
        const time = hour - 12 + ":" + min + " PM";
        return time;
      } else if (hour == 0) {
        const time = 12 + ":" + min + " AM";
        return time
      } else {
        const time = hour + ":" + min + " AM";
        return time;
      }
    } catch (err) {
      console.error("Time format has been introduced in recent builds")
    }
}

// Convert time from 12 hour format to 24 hour format!
export function convert12to24(timestart){
  try{
    var hrs = Number(timestart.match(/^(\d+)/)[1]);
    var mnts = Number(timestart.match(/:(\d+)/)[1]);
    var format = timestart.match(/\s(.*)$/)[1];
    if (format == "PM" && hrs < 12) hrs = hrs + 12;
    if (format == "AM" && hrs == 12) hrs = hrs - 12;
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    var timeend = hours + ":" + minutes
    return timeend;
  } catch(err){
    console.log("For some dates, we dont have checkin time!");
  }
}

// Compare two times! --> Always returns the bigger one!
export function compareTime(time1, time2){
  if(time1 > time2){
    return false;
  } else if(time2 > time1){
    return true;
  } else if(time2 === time1) {
    return true;
  } else {
    return undefined;
  }
}

// get today's date in date object!
export function loadDate(){
  return new Date();
}