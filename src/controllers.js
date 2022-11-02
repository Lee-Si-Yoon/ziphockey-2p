/**
 * generate static getpages
 * @param {string} htmlLocation
 * @param {string} title
 * @returns {function}
 */
export function staticPage(htmlLocation, title) {
  return (req, res) => {
    return res.render(htmlLocation, { pageTitle: title });
  };
}
