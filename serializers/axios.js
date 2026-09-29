export default (err, serializeError) => {
  const serialized = {
    code: err.code,
    isAxiosError: err.isAxiosError,
  };

  if(err.config) {
    serialized.config = {
        xsrfCookieName: err.config.xsrfCookieName,
        xsrfHeaderName: err.config.xsrfHeaderName,
        timeout: err.config.timeout,
        maxContentLength: err.config.maxContentLength,
        maxBodyLength: err.config.maxBodyLength,
        headers: err.config.headers,
        baseURL: err.config.baseURL,
        method: err.config.method,
        url: err.config.url,
        data: err.config.data,
    };
  }

  if(err.request) {
    serialized.request = {
        finished: err.request.finished,
        method: err.request.method,
        path: err.request.path,
        aborted: err.request.aborted,
        host: err.request.host,
        protocol: err.request.protocol,
        _hasBody: err.request._hasBody,
        _headerSent: err.request._headerSent,
    };
  }

  if(err.response) {
    serialized.response = {
        status: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers,
        data: err.response.data,
    };
  }

  return serialized;
};

export const canHandle = (err) => err.isAxiosError;
