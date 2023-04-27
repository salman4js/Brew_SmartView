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