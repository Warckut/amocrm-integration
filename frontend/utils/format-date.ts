import moment from "moment";

export default (number: number) =>
  moment(number* 1000).format("DD.MM.yyyy hh:mm");
