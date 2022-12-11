module.exports.getMillisecond = (isoDate) => {
  const date = new Date(isoDate);
  return date.getTime();
}