type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const createParams = (
  method: RequestMethod,
  body: object | undefined,
  params?: RequestInit | undefined
) => {
  const result: RequestInit = {
    ...params,
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      ...params?.headers
    }
  };

  if (!result.headers) {
    result.headers = {}
  }

  if (body) {
    result.headers["Content-Type"] = "application/json";
  }

  return result;
}

export const makeRequest = (
  url: string,
  method: RequestMethod = "GET",
  body: object | undefined = undefined,
  params: RequestInit | undefined = undefined
) => {
  const sentParams: RequestInit | undefined = createParams(
    method,
    body,
    params
  );
  
  return fetch(url, sentParams);
}