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
  PRIMARY_SCHOOL = "Tiểu học",
  SECONDARY_SCHOOL = "Trung học cơ sở",
  HIGH_SCHOOL = "Trung học phổ thông",
  COLLEGE = "Cao đẳng",
  UNIVERSITY = "Đại học",
  AFTER_UNIVERSITY = "Sau đại học",
}

export const educationLevelEnumArray: EDUCATIONLEVEL[] = [
  EDUCATIONLEVEL.PRIMARY_SCHOOL,
  EDUCATIONLEVEL.SECONDARY_SCHOOL,
  EDUCATIONLEVEL.HIGH_SCHOOL,
  EDUCATIONLEVEL.COLLEGE,
  EDUCATIONLEVEL.UNIVERSITY,
  EDUCATIONLEVEL.AFTER_UNIVERSITY,
];

export const mappingEducationLevel: { [key in EDUCATIONLEVEL]: string } = {
  [EDUCATIONLEVEL.PRIMARY_SCHOOL]: "Tiểu học",
  [EDUCATIONLEVEL.SECONDARY_SCHOOL]: "Trung học cơ sở",
  [EDUCATIONLEVEL.HIGH_SCHOOL]: "Trung học phổ thông",
  [EDUCATIONLEVEL.COLLEGE]: "Cao đẳng",
  [EDUCATIONLEVEL.UNIVERSITY]: "Đại học",
  [EDUCATIONLEVEL.AFTER_UNIVERSITY]: "Sau đại học",
};
