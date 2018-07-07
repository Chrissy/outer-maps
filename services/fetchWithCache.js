const fetchWithFailure = url =>
  fetch(url).then(response => {
    return response.ok
      ? response.json()
      : { failure: true, message: response.statusText };
  });

const tryCachedFile = ({ model, id }) =>
  new Promise((resolve, reject) => {
    const cachedPath = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${model}-${id}.json`;
    const apiPath = `/api/${model}/${id}`;

    fetchWithFailure(cachedPath).then(response => {
      if (!response.failure) {
        return resolve(response);
      } else {
        fetchWithFailure(apiPath).then(response => {
          if (!response.failure) {
            return resolve(response);
          } else {
            reject("Rejected by both the cache and the api");
          }
        });
      }
    });
  });

export default tryCachedFile;
