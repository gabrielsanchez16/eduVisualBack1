/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,studentId]` on the table `TeacherStudent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `aiContent` LONGTEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TeacherStudent_teacherId_studentId_key` ON `TeacherStudent`(`teacherId`, `studentId`);
