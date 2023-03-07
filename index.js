require("util").inspect.defaultOptions.depth = null;
const store = require("./rtk/store/store");
const { fetchVideo, fetchVideos } = require("./rtk/features/video/videoSlice");

store.subscribe(() => {});

store.dispatch(fetchVideo());
