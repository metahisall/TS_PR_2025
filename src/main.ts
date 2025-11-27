/**
 * Перелік статусів студента.
 */
enum StudentStatus {
  Active = "Active",
  Academic_Leave = "Academic_Leave",
  Graduated = "Graduated",
  Expelled = "Expelled",
}

/**
 * Перелік типів курсу.
 */
enum CourseType {
  Mandatory = "Mandatory",
  Optional = "Optional",
  Special = "Special",
}

/**
 * Перелік семестрів навчання.
 */
enum Semester {
  First = "First",
  Second = "Second",
}

/**
 * Перелік можливих значень оцінок.
 */
enum GradeValue {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2,
}

/**
 * Перелік факультетів університету.
 */
enum Faculty {
  Computer_Science = "Computer_Science",
  Economics = "Economics",
  Law = "Law",
  Engineering = "Engineering",
}

/**
 * Інтерфейс для сутності Студент.
 */
interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}

/**
 * Інтерфейс для сутності Курс.
 */
interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}

/**
 * Інтерфейс для запису про оцінку або реєстрацію на курс.
 */
interface Grade {
  studentId: number;
  courseId: number;
  grade?: GradeValue;
  date: Date;
  semester: Semester;
}

class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private grades: Grade[] = [];

  allCourses(): Course[] {
    return this.courses;
  }

  allStudents(): Student[] {
    return this.students;
  }

  addCourse(course: Omit<Course, "id">): void {
    const checkedCourse = this.courses.find(
      (c) =>
        c.name === course.name &&
        c.semester === course.semester &&
        c.faculty === course.faculty
    );
    if (checkedCourse) {
      throw new Error(
        "Курс з таким ім'ям вже існує для цього факультету та семестру"
      );
    }

    const newCourse: Course = {
      id: this.courses.length + 1,
      ...course,
    };
    this.courses.push(newCourse);
  }

  enrollStudent(student: Omit<Student, "id">): Student {
    const newStudent: Student = {
      id: this.students.length + 1,
      ...student,
    };
    this.students.push(newStudent);
    return newStudent;
  }

  registerForCourse(studentId: number, courseId: number): void {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error("Студента не знайдено");

    const course = this.courses.find((c) => c.id === courseId);
    if (!course) throw new Error("Курс не знайдено");

    if (course.faculty !== student.faculty) {
      throw new Error(
        "Студент не може реєструватися на курс іншого факультету"
      );
    }

    const enrolledCount = this.grades.filter(
      (g) => g.courseId === courseId
    ).length;
    if (enrolledCount >= course.maxStudents) {
      throw new Error("Курс вже заповнений");
    }

    const alreadyRegistered = this.grades.some(
      (g) => g.studentId === studentId && g.courseId === courseId
    );
    if (alreadyRegistered) {
      throw new Error("Студент вже зареєстрований на цей курс");
    }

    const newGrade: Grade = {
      studentId,
      courseId,
      date: new Date(),
      semester: course.semester,
    };
    this.grades.push(newGrade);
  }

  setGrade(studentId: number, courseId: number, grade: GradeValue): void {
    const gradeRecord = this.grades.find(
      (g) => g.studentId === studentId && g.courseId === courseId
    );
    if (!gradeRecord) throw new Error("Студент не зареєстрований на цей курс");

    if (gradeRecord.grade !== undefined) {
      throw new Error("Оцінка за цей курс вже виставлена");
    }

    gradeRecord.grade = grade;
    gradeRecord.date = new Date();
  }

  updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error("Студента не знайдено");

    if (student.status === StudentStatus.Expelled) {
      throw new Error("Неможливо змінити статус відрахованому студенту");
    }

    student.status = newStatus;
  }

  getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter((s) => s.faculty === faculty);
  }

  getStudentGrades(studentId: number): Grade[] {
    // Фільтруємо записи, які мають фінальну оцінку
    return this.grades.filter(
      (g) => g.studentId === studentId && g.grade !== undefined
    );
  }

  getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
    return this.courses.filter(
      (c) => c.faculty === faculty && c.semester === semester
    );
  }

  calculateAverageGrade(studentId: number): number {
    const gradedRecords = this.getStudentGrades(studentId);

    if (gradedRecords.length === 0) return 0;

    const sum = gradedRecords.reduce((acc, g) => acc + (g.grade as number), 0);
    return sum / gradedRecords.length;
  }

  getExcellentStudents(faculty: Faculty): Student[] {
    return this.students.filter((student) => {
      if (student.faculty !== faculty) return false;

      const grades = this.getStudentGrades(student.id);

      if (grades.length === 0) return false;

      return grades.every((g) => g.grade === GradeValue.Excellent);
    });
  }
}

// --- ДЕМОНСТРАЦІЙНИЙ ТЕСТОВИЙ БЛОК ---

function runDemonstration(): void {
  const system = new UniversityManagementSystem();

  console.log("=== Демонстрація системи управління університетом ===");
  console.log("-----------------------------------------------------");

  // 1. Додавання курсів
  system.addCourse({
    name: "Основи JS",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 5,
  }); // ID: 1
  system.addCourse({
    name: "Фінанси",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 10,
  }); // ID: 2
  system.addCourse({
    name: "Бази даних",
    type: CourseType.Optional,
    credits: 3,
    semester: Semester.Second,
    faculty: Faculty.Computer_Science,
    maxStudents: 5,
  }); // ID: 3

  console.log("✅ Курси додано. ", system.allCourses());

  // 2. Зарахування студентів
  const st_anna = system.enrollStudent({
    fullName: "Анна Коваль",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "пд-42",
  }); // ID: 1

  const st_bogdan = system.enrollStudent({
    fullName: "Богдан Мельник",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "пд-42",
  }); // ID: 2

  console.log(`✅ Зараховано студентів:`, system.allStudents());
  console.log("-----------------------------------------------------");

  // 3. Реєстрація на курси
  system.registerForCourse(st_anna.id, 1); // Основи JS
  system.registerForCourse(st_anna.id, 3); // Бази даних
  system.registerForCourse(st_bogdan.id, 1); // Основи JS

  try {
    system.registerForCourse(st_anna.id, 3); // Бази даних (повторна реєстрація)
  } catch (e) {
    if (e instanceof Error) {
      console.log(
        `\n❌ Перевірка валідації (повторна реєстрація): ${e.message}`
      );
    }
  }

  console.log("✅ Студенти зареєстровані на курси.");

  // 4. Встановлення оцінок
  system.setGrade(st_anna.id, 1, GradeValue.Excellent); // Анна: 5
  system.setGrade(st_anna.id, 3, GradeValue.Excellent); // Анна: 5
  system.setGrade(st_bogdan.id, 1, GradeValue.Good); // Богдан: 4

  console.log("✅ Оцінки виставлено.");
  console.log("-----------------------------------------------------");

  // 5. Перевірка логіки
  const gradesAnna = system.getStudentGrades(st_anna.id);
  const avgAnna = system.calculateAverageGrade(st_anna.id);
  const avgBogdan = system.calculateAverageGrade(st_bogdan.id);
  const excellentCS = system.getExcellentStudents(Faculty.Computer_Science);

  console.log(
    `⭐ Оцінки ${st_anna.fullName}:`,
    gradesAnna.map((g) => g.grade)
  );
  console.log(`⭐ Середній бал ${st_anna.fullName}: ${avgAnna}`); // Очікувано: 5

  console.log(`⭐ Середній бал ${st_bogdan.fullName}: ${avgBogdan}`); // Очікувано: 4

  console.log(
    `⭐ Відмінники ФКН:`,
    excellentCS.map((s) => s.fullName)
  ); // Очікувано: ['Анна Коваль']

  // 6. Перевірка валідації (спроба зареєструватися на інший факультет)
  try {
    system.registerForCourse(st_anna.id, 2); // Курс 'Фінанси' (Economics)
  } catch (e) {
    if (e instanceof Error) {
      console.log(`\n❌ Перевірка валідації (факультет): ${e.message}`);
    }
  }
}

runDemonstration();
