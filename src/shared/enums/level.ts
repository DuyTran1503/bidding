export enum LEVELTASK {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERYHARD = "veryhard",
}

export const levelTaskEnumArray: LEVELTASK[] = [LEVELTASK.EASY, LEVELTASK.MEDIUM, LEVELTASK.HARD, LEVELTASK.VERYHARD];

export const mappingLevelTask: { [key in LEVELTASK]: string } = {
  [LEVELTASK.EASY]: "Dễ",
  [LEVELTASK.MEDIUM]: "Trung bình",
  [LEVELTASK.HARD]: "Khó",
  [LEVELTASK.VERYHARD]: "Rất khó",
};

export enum EDUCATIONLEVEL {
  primary_school = "Tiểu học",
  secondary_school = "Trung học cơ sở",
  high_school = "Trung học phổ thông",
  college = "Cao đẳng",
  university = "Đại học",
  after_university = "Sau đại học",
}
