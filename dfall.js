(function(global) {
  /**
   * 여러 개의 스크립트 URL 중 하나라도 성공적으로 로드될 때까지 순차적으로 시도.
   * jQuery 있으면 $.Deferred, 없으면 Promise 사용.
   *
   * @param {string[]} urls - 시도할 스크립트 URL 배열
   * @param {number} timeoutMs - 각 시도별 타임아웃(ms)
   * @returns {Promise|jQuery.Promise} - 성공 시 resolve, 모두 실패 시 reject
   */
  function getScriptWithFallback(urls, timeoutMs) {
    const list = urls.slice();

    function loadScript(url, onSuccess, onFail) {
      let done = false;

      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      script.onload = () => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          onSuccess(url);
        }
      };
      script.onerror = () => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          onFail();
        }
      };

      const timer = setTimeout(() => {
        if (!done) {
          done = true;
          script.remove();
          onFail();
        }
      }, timeoutMs);

      document.head.appendChild(script);
    }

    if (typeof jQuery !== 'undefined' && typeof jQuery.Deferred === 'function') {
      return jQuery.Deferred(function(deferred) {
        (function loadNext() {
          if (list.length === 0) return deferred.reject();
          const url = list.shift();
          loadScript(url, deferred.resolve, loadNext);
        })();
      }).promise();
    } else {
      return new Promise(function(resolve, reject) {
        (function loadNext() {
          if (list.length === 0) return reject();
          const url = list.shift();
          loadScript(url, resolve, loadNext);
        })();
      });
    }
  }

  if (!global.works) global.works = {};
  global.works.getScriptWithFallback = getScriptWithFallback;

})(typeof window !== 'undefined' ? window : this);
