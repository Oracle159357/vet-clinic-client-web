import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUser } from 'api';
import { setUserOptions } from './options';

const initialState = {
  data: [],
  pageCount: 0,
  loading: false,
  error: null,
};

export const loadUserV2 = createAsyncThunk(
  'loadUser',
  async (_, { getState, rejectWithValue }) => {
    const {
      pageSize,
      pageIndex,
      sortBy,
      filters,
    } = getState().users.options;
    try {
      const data = await getUser(
        {
          paging: { page: pageIndex, size: pageSize },
          sorting: sortBy,
          filters,
        },
      );
      const pageCount = Math.ceil(data.dataLength / pageSize);
      return { data: data.resultData, pageCount };
    } catch (error) {
      return rejectWithValue(error.payload);
    }
  },
);

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loadUserV2.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(loadUserV2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserV2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const setUserOptionsAndLoad = createAsyncThunk(
  'setUserOptionsAndLoad',
  async (options, { dispatch }) => {
    dispatch(setUserOptions(options));
    dispatch(loadUserV2());
  },
);

export default resultSlice.reducer;
