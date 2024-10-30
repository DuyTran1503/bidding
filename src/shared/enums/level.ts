export enum LEVELTASK {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  VERYHARD = "veryhard",
}

export const levelTaskEnumArray: LEVELTASK[] = [LEVELTASK.EASY, LEVELTASK.MEDIUM, LEVELTASK.HARD, LEVELTASK.VERYHARD];

export const mappingLevelTask: { [key in LEVELTASK]: string | any } = {
  [LEVELTASK.EASY]: "Dễ",
  [LEVELTASK.MEDIUM]: "Trung bình",
  [LEVELTASK.HARD]: "Khó",
  [LEVELTASK.VERYHARD]: "Rất khó",
};

export enum EDUCATIONLEVEL {
  PRIMARY_SCHOOL = "primary_school",
  SECONDARY_SCHOOL = "secondary_school",
  HIGH_SCHOOL = "high_school",
  COLLEGE = "college",
  UNIVERSITY = "university",
  AFTER_UNIVERSITY = "after_university",
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
