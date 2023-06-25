import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const formatDate = (date: string) => {
  dayjs.extend(customParseFormat);
  return {
    folder: dayjs(date).format("MM-YYYY"),
    file: dayjs(date).format("DD-MM-YYYY"),
  };
};
