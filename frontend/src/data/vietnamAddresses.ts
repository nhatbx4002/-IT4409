// Basic Vietnam address data structure
// This can be enhanced later with a proper API integration

export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  province_id: string;
}

export interface Ward {
  id: string;
  name: string;
  district_id: string;
}

// Common Vietnamese provinces
export const PROVINCES: Province[] = [
  { id: '1', name: 'Hà Nội' },
  { id: '2', name: 'Hồ Chí Minh' },
  { id: '3', name: 'Đà Nẵng' },
  { id: '4', name: 'Hải Phòng' },
  { id: '5', name: 'An Giang' },
  { id: '6', name: 'Bà Rịa - Vũng Tàu' },
  { id: '7', name: 'Bắc Giang' },
  { id: '8', name: 'Bắc Kạn' },
  { id: '9', name: 'Bạc Liêu' },
  { id: '10', name: 'Bắc Ninh' },
  { id: '11', name: 'Bến Tre' },
  { id: '12', name: 'Bình Định' },
  { id: '13', name: 'Bình Dương' },
  { id: '14', name: 'Bình Phước' },
  { id: '15', name: 'Bình Thuận' },
  { id: '16', name: 'Cà Mau' },
  { id: '17', name: 'Cần Thơ' },
  { id: '18', name: 'Cao Bằng' },
  { id: '19', name: 'Đắk Lắk' },
  { id: '20', name: 'Đắk Nông' },
  { id: '21', name: 'Điện Biên' },
  { id: '22', name: 'Đồng Nai' },
  { id: '23', name: 'Đồng Tháp' },
  { id: '24', name: 'Gia Lai' },
  { id: '25', name: 'Hà Giang' },
  { id: '26', name: 'Hà Nam' },
  { id: '27', name: 'Hà Tĩnh' },
  { id: '28', name: 'Hải Dương' },
  { id: '29', name: 'Hậu Giang' },
  { id: '30', name: 'Hòa Bình' },
  { id: '31', name: 'Hưng Yên' },
  { id: '32', name: 'Khánh Hòa' },
  { id: '33', name: 'Kiên Giang' },
  { id: '34', name: 'Kon Tum' },
  { id: '35', name: 'Lai Châu' },
  { id: '36', name: 'Lâm Đồng' },
  { id: '37', name: 'Lạng Sơn' },
  { id: '38', name: 'Lào Cai' },
  { id: '39', name: 'Long An' },
  { id: '40', name: 'Nam Định' },
  { id: '41', name: 'Nghệ An' },
  { id: '42', name: 'Ninh Bình' },
  { id: '43', name: 'Ninh Thuận' },
  { id: '44', name: 'Phú Thọ' },
  { id: '45', name: 'Phú Yên' },
  { id: '46', name: 'Quảng Bình' },
  { id: '47', name: 'Quảng Nam' },
  { id: '48', name: 'Quảng Ngãi' },
  { id: '49', name: 'Quảng Ninh' },
  { id: '50', name: 'Quảng Trị' },
  { id: '51', name: 'Sóc Trăng' },
  { id: '52', name: 'Sơn La' },
  { id: '53', name: 'Tây Ninh' },
  { id: '54', name: 'Thái Bình' },
  { id: '55', name: 'Thái Nguyên' },
  { id: '56', name: 'Thanh Hóa' },
  { id: '57', name: 'Thừa Thiên Huế' },
  { id: '58', name: 'Tiền Giang' },
  { id: '59', name: 'Trà Vinh' },
  { id: '60', name: 'Tuyên Quang' },
  { id: '61', name: 'Vĩnh Long' },
  { id: '62', name: 'Vĩnh Phúc' },
  { id: '63', name: 'Yên Bái' },
];

// Sample districts for major cities (can be expanded)
export const DISTRICTS: District[] = [
  // Hà Nội
  { id: '1', name: 'Ba Đình', province_id: '1' },
  { id: '2', name: 'Hoàn Kiếm', province_id: '1' },
  { id: '3', name: 'Tây Hồ', province_id: '1' },
  { id: '4', name: 'Long Biên', province_id: '1' },
  { id: '5', name: 'Cầu Giấy', province_id: '1' },
  { id: '6', name: 'Đống Đa', province_id: '1' },
  { id: '7', name: 'Hai Bà Trưng', province_id: '1' },
  { id: '8', name: 'Hoàng Mai', province_id: '1' },
  { id: '9', name: 'Thanh Xuân', province_id: '1' },
  // Hồ Chí Minh
  { id: '10', name: 'Quận 1', province_id: '2' },
  { id: '11', name: 'Quận 2', province_id: '2' },
  { id: '12', name: 'Quận 3', province_id: '2' },
  { id: '13', name: 'Quận 4', province_id: '2' },
  { id: '14', name: 'Quận 5', province_id: '2' },
  { id: '15', name: 'Quận 6', province_id: '2' },
  { id: '16', name: 'Quận 7', province_id: '2' },
  { id: '17', name: 'Quận 8', province_id: '2' },
  { id: '18', name: 'Quận 9', province_id: '2' },
  { id: '19', name: 'Quận 10', province_id: '2' },
  { id: '20', name: 'Quận 11', province_id: '2' },
  { id: '21', name: 'Quận 12', province_id: '2' },
  { id: '22', name: 'Bình Thạnh', province_id: '2' },
  { id: '23', name: 'Tân Bình', province_id: '2' },
  { id: '24', name: 'Tân Phú', province_id: '2' },
  { id: '25', name: 'Phú Nhuận', province_id: '2' },
  { id: '26', name: 'Gò Vấp', province_id: '2' },
  // Đà Nẵng
  { id: '27', name: 'Hải Châu', province_id: '3' },
  { id: '28', name: 'Thanh Khê', province_id: '3' },
  { id: '29', name: 'Sơn Trà', province_id: '3' },
  { id: '30', name: 'Ngũ Hành Sơn', province_id: '3' },
  { id: '31', name: 'Liên Chiểu', province_id: '3' },
];

// Sample wards (can be expanded)
export const WARDS: Ward[] = [
  // Sample wards for Hà Nội - Ba Đình
  { id: '1', name: 'Phường Điện Biên', district_id: '1' },
  { id: '2', name: 'Phường Đội Cấn', district_id: '1' },
  { id: '3', name: 'Phường Giảng Võ', district_id: '1' },
  { id: '4', name: 'Phường Kim Mã', district_id: '1' },
  { id: '5', name: 'Phường Liễu Giai', district_id: '1' },
  // Sample wards for Hồ Chí Minh - Quận 1
  { id: '10', name: 'Phường Bến Nghé', district_id: '10' },
  { id: '11', name: 'Phường Bến Thành', district_id: '10' },
  { id: '12', name: 'Phường Cầu Kho', district_id: '10' },
  { id: '13', name: 'Phường Cầu Ông Lãnh', district_id: '10' },
  { id: '14', name: 'Phường Cô Giang', district_id: '10' },
  { id: '15', name: 'Phường Đa Kao', district_id: '10' },
  { id: '16', name: 'Phường Nguyễn Cư Trinh', district_id: '10' },
  { id: '17', name: 'Phường Nguyễn Thái Bình', district_id: '10' },
  { id: '18', name: 'Phường Phạm Ngũ Lão', district_id: '10' },
  { id: '19', name: 'Phường Tân Định', district_id: '10' },
];

export function getDistrictsByProvince(provinceId: string): District[] {
  return DISTRICTS.filter((d) => d.province_id === provinceId);
}

export function getWardsByDistrict(districtId: string): Ward[] {
  return WARDS.filter((w) => w.district_id === districtId);
}

