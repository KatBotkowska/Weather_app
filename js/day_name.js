const getDayName = unix_timestamp => {
    let date =  new Date(unix_timestamp *1000);
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[date.getDay()];
    return dayName;
}
export {getDayName};