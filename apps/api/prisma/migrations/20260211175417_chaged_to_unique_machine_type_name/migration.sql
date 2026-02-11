/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `machines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "machines_name_type_key" ON "machines"("name", "type");
