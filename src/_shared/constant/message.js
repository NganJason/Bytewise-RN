import { tsToDateTimeStr } from '../util/date';

export const genStockUpdateTimeMsg = updateTime => {
  let formattedTime = 'NA';
  if (updateTime !== 0) {
    formattedTime = tsToDateTimeStr(updateTime);
  }
  return `Stock market info is updated everynight at\n00:00 AM (UTC +08:00).\n\nLast updated at: ${formattedTime}`;
};
