import _ from "lodash";
import moment from "moment";

export const years = _.range(1990, moment().year() + 5, 1);
export const months = [
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
