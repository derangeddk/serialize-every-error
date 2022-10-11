import pick from 'lodash.pick';

export default (err, serializeError) => {
  const serialized = pick(err, [
    "code",
    "isAxiosError",
  ]);

  if(err.config) {
    serialized.config = pick(err.config, [
        "xsrfCookieName",
        "xsrfHeaderName",
        "timeout",
        "maxContentLength",
        "maxBodyLength",
        "headers",
        "baseURL",
        "method",
        "url",
        "data",
    ]);
  }

  if(err.request) {
    serialized.request = pick(err.request, [
        "finished",
        "method",
        "path",
        "aborted",
        "host",
        "protocol",
        "_hasBody",
        "_headerSent",
    ]);
  }

  if(err.response) {
    serialized.response = pick(err.response, [
        "status",
        "statusText",
        "headers",
        "data",
    ]);
  }

  return serialized;
};

export const canHandle = (err) => err.isAxiosError;
