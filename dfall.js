(function(global) {
  /**
   * 여러 개의 스크립트 URL 중 하나라도 성공적으로 로드될 때까지 순차적으로 시도하는 함수.
   * jQuery가 존재하면 $.Deferred 와 $.getScript 를 사용하고,
   * 그렇지 않으면 순수 자바스크립트(Promise 및 script 태그 삽입)를 사용.
   *
   * @param {string[]} urls - 시도할 스크립트 URL 배열
   * @returns {Promise|jQuery.Promise} - 하나라도 로드되면 resolve 되는 Promise 또는 jQuery Promise
   */
  function getScriptWithFallback(urls) {
    const list = urls.slice(); // clone to avoid modifying original

    if (typeof jQuery !== 'undefined' && typeof jQuery.Deferred === 'function') {
      return jQuery.Deferred(function(deferred) {
        (function loadNext() {
          if (list.length === 0) return deferred.reject();
          const url = list.shift();
          jQuery.getScript(url).done(deferred.resolve).fail(loadNext);
        })();
      }).promise();
    } else {
      return new Promise(function(resolve, reject) {
        (function loadNext() {
          if (list.length === 0) return reject();
          const url = list.shift();
          const script = document.createElement('script');
          script.src = url;
          script.async = true;
          script.onload = () => resolve(url);
          script.onerror = loadNext;
          document.head.appendChild(script);
        })();
      });
    }
  }

  // works 네임스페이스가 없으면 생성 후, 해당 함수 연결
  if (!global.works) global.works = {};
  global.works.getScriptWithFallback = getScriptWithFallback;

})(typeof window !== 'undefined' ? window : this);
