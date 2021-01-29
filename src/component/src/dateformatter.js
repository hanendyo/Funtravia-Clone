export const dateFormat = (date) => {
  let monthNames = [
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
    "December",
  ];
  let formattedDate = new Date(date);
  let newDate =
    formattedDate.getDate().toString() +
    " " +
    monthNames[formattedDate.getMonth()] +
    " " +
    formattedDate.getFullYear().toString();

  return newDate;
};

// date hasil 20-01-2021 from 2021/01/20

export const dateFormatDMY = (date) => {
  const format = new Date(date);
  const month =
    format.getMonth() + 1 < 10
      ? "0" + (format.getMonth() + 1)
      : format.getMonth() + 1;
  const newDate =
    format.getDate() +
    "-" +
    month.toString() +
    "-" +
    format.getFullYear().toString();
  return newDate;
};

// date hasil 20-01-2021 from 2021-01-20

export const dateFormatYMD = (date) => {
  const format = new Date(date);
  const month =
    format.getMonth() + 1 < 10
      ? "0" + (format.getMonth() + 1)
      : format.getMonth() + 1;
  const newDate =
    format.getDate() +
    "-" +
    month.toString() +
    "-" +
    format.getFullYear().toString();
  return newDate;
};

// date hasil 2021/01/21 from 2021-01-20

export const FormatYMD = (date) => {
  const format = new Date(date);
  const month =
    format.getMonth() + 1 < 10
      ? "0" + (format.getMonth() + 1)
      : format.getMonth() + 1;
  let newDate = format.getFullYear() + "-" + month + "-" + format.getDate();
  // console.log(newDate);
  return newDate;
};

export const dateFormatMonthYears = (date) => {
  let monthNames = [
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
    "December",
  ];
  let formattedDate = new Date(date);
  let newDate =
    monthNames[formattedDate.getMonth()] +
    ", " +
    formattedDate.getFullYear().toString();

  return newDate;
};

export const dateFormats = (date) => {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let formattedDate = new Date(date);
  let newDate =
    formattedDate.getDate().toString() +
    " " +
    monthNames[formattedDate.getMonth()] +
    " " +
    formattedDate.getFullYear().toString();

  return newDate;
};

export const dateMountFormats = (date) => {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDate = new Date(date);
  var dayName = days[formattedDate.getDay()];
  let newDate =
    formattedDate.getDate().toString() +
    " " +
    monthNames[formattedDate.getMonth()];
  let newDay = dayName + " " + formattedDate.getFullYear().toString();
  return { datemount: newDate, dayyear: newDay };
};

export const dateFormatBetween = (date_from, date_until) => {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let formattedDate_from = new Date(date_from);
  let formattedDate_until = new Date(date_until);
  let year_from = "";
  let mount_from = monthNames[formattedDate_from.getMonth()];
  let mount_until = monthNames[formattedDate_until.getMonth()];
  let view_mount_from = " " + mount_from;
  if (formattedDate_from.getFullYear() == formattedDate_until.getFullYear()) {
    year_from = "";

    if (mount_from != mount_until) {
      view_mount_from = " " + mount_from;
    } else {
      view_mount_from = "";
    }
  } else {
    year_from = " " + formattedDate_from.getFullYear().toString();
  }
  let newDate;

  if (date_from == date_until) {
    newDate =
      formattedDate_until.getDate().toString() +
      " " +
      monthNames[formattedDate_until.getMonth()] +
      " " +
      formattedDate_until.getFullYear().toString();
  } else {
    let date_start =
      formattedDate_from.getDate() < 10
        ? "0" + formattedDate_from.getDate()
        : formattedDate_from.getDate();
    let date_end =
      formattedDate_until.getDate() < 10
        ? "0" + formattedDate_until.getDate()
        : formattedDate_until.getDate();
    newDate =
      date_start +
      view_mount_from +
      year_from +
      " - " +
      date_end +
      " " +
      monthNames[formattedDate_until.getMonth()] +
      " " +
      formattedDate_until.getFullYear().toString();
  }

  return newDate;
};

export const dateFormatForNotif = (date_from, date_until) => {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let formattedDate_from = new Date(date_from);
  let formattedDate_until = new Date(date_until);
  let year_from = "";
  let mount_from = monthNames[formattedDate_from.getMonth()];
  let mount_until = monthNames[formattedDate_until.getMonth()];
  let view_mount_from = " " + mount_from;

  view_mount_from = " " + mount_from;
  if (formattedDate_from.getFullYear() == formattedDate_until.getFullYear()) {
    year_from = "";
  } else {
    year_from = " " + formattedDate_from.getFullYear().toString();
  }
  let date_start =
    formattedDate_from.getDate() < 10
      ? "0" + formattedDate_from.getDate()
      : formattedDate_from.getDate();
  let newDate;

  newDate = date_start + view_mount_from + year_from;

  return newDate;
};
