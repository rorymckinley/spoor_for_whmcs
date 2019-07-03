module.exports = {
  validateUrl(requestBase, requiredArgs, url) {
    const expectedArgs = requiredArgs.concat([['ajax', 'true']]);
    const requestBaseAsRegExp = requestBase.replace(/\//g, '\\/').replace(/\?/g, '\\?');
    const components = url.match(new RegExp(`${requestBaseAsRegExp}&(.+)`));

    expect(components, 'Uses the requestBase').not.toBe(null);
    const urlParams = components[1].split('&').map((keyValue) => keyValue.split('='));
    expect(urlParams.sort(this.__paramsSort)).toStrictEqual(expectedArgs.sort(this.__paramsSort));
  },

  __paramsSort(firstEl, secondEl) {
    return firstEl[0] < secondEl[0] ? -1 : 1;
  }
};
