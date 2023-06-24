import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const formatDate = (date: string) => {
  dayjs.extend(customParseFormat);
  return dayjs(date).format("dd-mm-yyyy");
};
