const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { default: fetch } = require("cross-fetch");

// initial state
const initialState = {
  loading: false,
  video: {},
  videos: {
    loading: false,
    videos: [],
    error: "",
  },
  error: "",
};

// async thunk for video
const fetchVideo = createAsyncThunk("video/fetchVideo", async () => {
  const response = await fetch("http://localhost:9000/videos");
  const video = await response.json();

  return video;
});

// async thunk for videos
const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (arguments, { getState }) => {
    const state = getState();
    const tags = state.video?.video?.tags;
    let tagsString = "tags_like=";
    if (tags?.length) {
      tagsString = tagsString + tags?.join("&tags_like=");
    }

    const response = await fetch(`http://localhost:9000/${tagsString}`);
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
    builder.addCase(fetchVideo.pending, (state, action) => {
      state.loading = true;
    });
    // fulfilled add case for video
    builder
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
        state.error = "";
      })
      // pending add case for videos after video add cse fulfilled
      .addCase(fetchVideos.pending, (state, action) => {
        state.videos.loading = true;
      })
      // fulfilled add case for videos after video add cse fulfilled and pending add case for videos
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.loading = false;
        state.videos.videos = action.payload;
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
