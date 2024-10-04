export const demoData = {
  15: 2,
  16: 4,
  17: 1,
  18: 3,
  19: 5,
  20: 2,
  21: 4,
  22: 1,
  23: 3,
  24: 5,
};

// calculate all values related to subject progress
// export function calculateSubjectProgress(subject) {
//   const { targetHours, studyData } = subject;
//   let totalStudyDays = 0;
//   let totalStudyHours = 0;
//   let targetAchieved = false;

//   Object.values(studyData).forEach((year) => {
//     Object.values(year).forEach((month) => {
//       Object.values(month).forEach((hours) => {
//         totalStudyDays++;
//         totalStudyHours += hours;
//       });
//     });
//   });

//   const progressPercentage =
//     targetHours > 0 ? (totalStudyHours / targetHours) * 100 : 0;
//   targetAchieved = targetHours > 0 && totalStudyHours >= targetHours;

//   return { progressPercentage, totalStudyDays, totalStudyHours };
// }
