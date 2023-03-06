const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { default: fetch } = require("cross-fetch");
const { dispatch } = require("../../store/store");

// initial state
const initialState = {
  loading: false,
  video: {},
  tagsString: "",
  videos: {
    loading: false,
    videos: [],
    error: "",
  },
  error: "",
};

// async thunk for video
const fetchVideo = createAsyncThunk(
  "video/fetchVideo",
  async (_, { dispatch, getState }) => {
    const response = await fetch("http://localhost:9000/videos");
    const video = await response.json();

    dispatch(fetchVideos(video.tags.join("&tags_like=")));

    return {
      video: video,
      // videos: videos,
    };
  }
);

// async thunk for videos
const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (dataString) => {
    const url = `http://localhost:9000/videos?tags_like=${dataString}`;
    const response = await fetch(url);
    const videos = await response.json();
    return videos;
  }
);

// video slice
const videoSlice = createSlice({
  name: "video",
  initialState,
  extraReducers: (builder) => {
    // pending add case for video
    builder.addCase(fetchVideo.pending, (state) => {
      state.loading = true;
    });
    // fulfilled add case for video
    builder
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload.video;
        state.error = "";
      })
      // pending add case for videos after video add cse fulfilled
      .addCase(fetchVideos.pending, (state, action) => {
        state.videos.loading = true;
      })
      // fulfilled add case for videos after video add cse fulfilled and pending add case for videos
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.loading = false;
        const filteredVideos = action.payload.sort((a, b) => {
          // parseFloat(b.views.split("k")[0]))
          return (
            parseFloat(b.views.split("k")[0]) -
            parseFloat(a.views.split("k")[0])
          );
        });

        state.videos.videos = filteredVideos;
        state.videos.error = "";
      })
      // error add case for videos after video add cse fulfilled and videos rejected
      .addCase(fetchVideos.rejected, (state, action) => {
        state.videos.error = action.error.message;
        state.videos.loading = false;
        state.videos.videos = [];
      });

    // error add case for video
    builder.addCase(fetchVideo.rejected, (state, action) => {
      state.loading = false;
      state.video = {};
      state.video = [];
      state.error = action.error.message;
    });
  },
});

module.exports = videoSlice.reducer;
module.exports.videoActions = videoSlice.actions;
module.exports.fetchVideo = fetchVideo;
module.exports.fetchVideos = fetchVideos;
