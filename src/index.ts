type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot = 
  | "8:30-10:00"
  | "10:15-11:45"
  | "12:15-13:45"
  | "14:00-15:30"
  | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  id: number;
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};

const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];


function addProfessor(professor: Professor): void {
  professors.push(professor);
}

function validateLesson(lesson: Lesson, ignoreLessonId?: number): ScheduleConflict | null {
  for (const l of schedule) {
    // якщо це той самий урок — пропускаємо
    if (ignoreLessonId && l.id === ignoreLessonId) continue;

    if (l.dayOfWeek === lesson.dayOfWeek && l.timeSlot === lesson.timeSlot) {
      if (l.professorId === lesson.professorId) {
        return { type: "ProfessorConflict", lessonDetails: l };
      }
      if (l.classroomNumber === lesson.classroomNumber) {
        return { type: "ClassroomConflict", lessonDetails: l };
      }
    }
  }
  return null;
}



function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict) {
    console.log(`❌ Conflict (${conflict.type}) with lesson ID ${conflict.lessonDetails.id}`);
    return false;
  }
  schedule.push(lesson);
  return true;
}


function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  const occupied = schedule
    .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
    .map(l => l.classroomNumber);
  return classrooms
    .map(c => c.number)
    .filter(n => !occupied.includes(n));
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(l => l.professorId === professorId);
}


function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 5 * 5;
  const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
  return (usedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
  const count: Record<CourseType, number> = { Lecture: 0, Seminar: 0, Lab: 0, Practice: 0 };
  for (const l of schedule) {
    const course = courses.find(c => c.id === l.courseId);
    if (course) count[course.type]++;
  }
  return (Object.entries(count).sort((a, b) => b[1] - a[1])[0][0]) as CourseType;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lesson = schedule.find(l => l.id === lessonId);
  if (!lesson) return false;

  const newLesson = { ...lesson, classroomNumber: newClassroomNumber };
  const conflict = validateLesson(newLesson, lessonId); // <-- ігноруємо тільки сам урок

  if (conflict) {
    console.log(`⚠️ Cannot reassign: ${conflict.type} with lesson ID ${conflict.lessonDetails.id}`);
    return false;
  }

  console.log(`✅ Reassigned lesson ${lessonId} to classroom ${newClassroomNumber}`);
  lesson.classroomNumber = newClassroomNumber;
  return true;
}


function cancelLesson(lessonId: number): void {
  const index = schedule.findIndex(l => l.id === lessonId);
  if (index !== -1) schedule.splice(index, 1);
}

function test(): void {
  addProfessor({ id: 1, name: "Dr. Smith", department: "Mathematics" });
  classrooms.push({ number: "101", capacity: 30, hasProjector: true });
  classrooms.push({ number: "102", capacity: 30, hasProjector: true });
  classrooms.push({ number: "103", capacity: 20, hasProjector: true });
  courses.push({ id: 1, name: "Calculus", type: "Lecture" });
  courses.push({ id: 2, name: "Calculus_max", type: "Seminar" });
  courses.push({ id: 3, name: "Calculus_pro", type: "Seminar" });

  const lesson1: Lesson = {
    id: 1,
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
  };
  const lesson2: Lesson = {
    id: 2,
    courseId: 2,
    professorId: 1,
    classroomNumber: "103",
    dayOfWeek: "Monday",
    timeSlot: "10:15-11:45",
  };
  const lesson3: Lesson = {
    id: 3,
    courseId: 3,
    professorId: 2,
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
  };

  console.log(addLesson(lesson1)); // true
  console.log(addLesson(lesson1)); // false (conflict)
  console.log(addLesson(lesson2)); // true 
  console.log(addLesson(lesson3)); // true 

  console.log(findAvailableClassrooms("8:30-10:00", "Monday")); // [103]

  console.log(getProfessorSchedule(1)); // [lesson1, lesson2]

  console.log(getClassroomUtilization("101").toFixed(2)+"%"); // 4.00%

  console.log(getMostPopularCourseType()); // "Seminar"

  console.log(reassignClassroom(1, "102")); // false (conflict)
  console.log(reassignClassroom(1, "103")); // true 

  cancelLesson(1);
  console.log(getProfessorSchedule(1)); // [lesson2]
}

  test();