export interface IBidBond {
  id: string; // Khóa chính, tự động tăng
  project_id: string;
  enterprise_id: string;
  bond_amount: number; // Số tiền bảo lãnh
  bond_type: string; // Loại bảo lãnh (ví dụ: bảo lãnh ngân hàng, tiền mặt)
  bond_number: string; // Số bảo lãnh duy nhất
  bond_amount_in_words?: string;
  issuer?: string; // Tên tổ chức phát hành bảo lãnh
  issue_date: string; // Ngày phát hành bảo lãnh
  expiry_date: string; // Ngày hết hạn bảo lãnh
  scan_document?: string; // Đường dẫn đến file scan của chứng từ bảo lãnh
  notes?: string; // Ghi chú bổ sung
  status?: string; // Trạng thái hiện tại của bảo lãnh (default 'active')
}
