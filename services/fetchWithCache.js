const fetchWithFailure = path =>
  fetch(path).then(response => {
    return response.ok
      ? response
      : { failure: true, message: response.statusText };
  });

const tryCachedFile = ({ path, extension }) =>
  new Promise((resolve, reject) => {
    console.time(`caching at ${path}`); //this will be removed soon;

    const cachedPath = `https://s3-us-west-2.amazonaws.com/chrissy-gunk/${path
      .slice(5)
      .replace(/\//g, "-")}.${extension}`;

    fetchWithFailure(cachedPath).then(response => {
      if (!response.failure) {
        console.timeEnd(`caching at ${path}`); //this will be removed soon;
        return resolve(response);
      } else {
        fetchWithFailure(path).then(response => {
          if (!response.failure) {
            return resolve(response);
          } else {
            reject("Rejected by both the cache and the api.");
          }
        });
      }
    });
  });

export default tryCachedFile;
