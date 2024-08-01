// Import các module và hàm cần thiết
import { commonStaticReducers } from "@/services/shared";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IInitialState, IResponse } from "@/shared/utils/shared-interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Itag } from "./tag.model";
import { createTag, deleteTag, getAllTags, getTagById, updateTag } from "./tag.thunk";

// Định nghĩa giao diện cho trạng thái ban đầu của slice tag
export interface ITagInitialState extends IInitialState {
  tags: Itag[]; // Danh sách tất cả các thẻ
  activeTag: Itag | undefined; // Thẻ đang được chọn hoặc đang hoạt động
}

// Định nghĩa trạng thái ban đầu cho slice tag
const initialState: ITagInitialState = {
  status: EFetchStatus.IDLE, // Trạng thái ban đầu của quá trình lấy dữ liệu
  message: "", // Thông báo liên quan đến các thao tác (thành công, lỗi, v.v.)
  tags: [], // Mảng để lưu trữ các thẻ đã lấy
  activeTag: undefined, // Ban đầu không có thẻ đang hoạt động
  totalRecords: 0, // Tổng số bản ghi (thẻ)
  filter: {
    size: 10, // Số lượng thẻ trên mỗi trang
    page: 1, // Số trang hiện tại
  },
};

// Tạo slice cho quản lý trạng thái của tag
const tagSlice = createSlice({
  name: "tag", // Tên của slice
  initialState, // Trạng thái ban đầu
  reducers: {
    ...commonStaticReducers<ITagInitialState>(), // Thêm các reducer chung từ commonStaticReducers
  },
  extraReducers(builder) {
    // Xử lý kết quả của các thunk khác nhau

    // Khi lấy tất cả các thẻ thành công
    builder.addCase(getAllTags.fulfilled, (state, { payload }: PayloadAction<IResponse<Itag[]>>) => {
      state.tags = payload.metaData; // Cập nhật danh sách thẻ với dữ liệu nhận được
    });

    // Khi lấy thẻ theo ID thành công
    builder.addCase(getTagById.fulfilled, (state, { payload }: PayloadAction<IResponse<Itag>>) => {
      state.activeTag = payload.metaData; // Cập nhật thẻ đang hoạt động với dữ liệu nhận được
    });

    // Khi tạo thẻ mới
    builder
      .addCase(createTag.pending, (state) => {
        state.status = EFetchStatus.PENDING; // Cập nhật trạng thái thành PENDING khi đang tạo thẻ
      })
      .addCase(createTag.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED; // Cập nhật trạng thái thành FULFILLED khi tạo thẻ thành công
        state.message = "Created successfully"; // Thông báo tạo thành công
      })
      .addCase(createTag.rejected, (state) => {
        state.status = EFetchStatus.REJECTED;
        state.message = "Created failed"; // Cập nhật trạng thái thành REJECTED khi tạo thẻ thất bại
      });

    // Khi cập nhật thẻ
    builder
      .addCase(updateTag.pending, (state) => {
        state.status = EFetchStatus.PENDING; // Cập nhật trạng thái thành PENDING khi đang cập nhật thẻ
      })
      .addCase(updateTag.fulfilled, (state) => {
        state.status = EFetchStatus.FULFILLED; // Cập nhật trạng thái thành FULFILLED khi cập nhật thẻ thành công
        state.message = "Updated successfully"; // Thông báo cập nhật thành công
      })
      .addCase(updateTag.rejected, (state) => {
        state.status = EFetchStatus.REJECTED; // Cập nhật trạng thái thành REJECTED khi cập nhật thẻ thất bại
      });

    // Khi xóa thẻ
    builder
      .addCase(deleteTag.pending, (state) => {
        state.status = EFetchStatus.PENDING; // Cập nhật trạng thái thành PENDING khi đang xóa thẻ
      })
      .addCase(deleteTag.fulfilled, (state, { payload }) => {
        state.status = EFetchStatus.FULFILLED; // Cập nhật trạng thái thành FULFILLED khi xóa thẻ thành công
        state.message = "Deleted successfully"; // Thông báo xóa thành công
        state.tags = state.tags.filter((tag) => tag.id !== payload); // Loại bỏ thẻ đã xóa khỏi danh sách thẻ
      })
      .addCase(deleteTag.rejected, (state) => {
        state.status = EFetchStatus.REJECTED; // Cập nhật trạng thái thành REJECTED khi xóa thẻ thất bại
      });
  },
});

// Export các action creators và reducer của slice
export const { resetStatus, setFilter } = tagSlice.actions;
export { tagSlice };
