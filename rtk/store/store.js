const { configureStore } = require("@reduxjs/toolkit");
const { createLogger } = require("redux-logger");
const videoReducer = require("../features/video/videoSlice");

const logger = createLogger();
const store = configureStore({
  reducer: {
    video: videoReducer,
  },

  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

module.exports = store;
