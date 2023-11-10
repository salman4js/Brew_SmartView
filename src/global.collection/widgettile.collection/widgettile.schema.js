// Define the widget tile model schema!
let widgetTileModelSchema = {
  instance: undefined, // This instance key will determine if the object has been already!
  // Created or not.
  collections: {
    // Inside the collections, Populate the data with factory design pattern!
  },
  fetch: {
    url: undefined,
    payload: undefined
  } // This is used to fetch the collections when the collection data has been lost.
};

export default widgetTileModelSchema;