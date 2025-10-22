import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@codium.com" },
    update: {},
    create: {
      email: "admin@codium.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN", // CORREGIDO: Usar string
    },
  });

  // Create professor
  const professorPassword = await bcrypt.hash("professor123", 10);
  const professor = await prisma.user.upsert({
    where: { email: "professor@codium.com" },
    update: {},
    create: {
      email: "professor@codium.com",
      password: professorPassword,
      firstName: "John",
      lastName: "Doe",
      role: "PROFESSOR", // CORREGIDO: Usar string
    },
  });

  // Create students
  const studentPassword = await bcrypt.hash("student123", 10);
  const student1 = await prisma.user.upsert({
    where: { email: "student1@codium.com" },
    update: {},
    create: {
      email: "student1@codium.com",
      password: studentPassword,
      firstName: "Alice",
      lastName: "Smith",
      role: "STUDENT", // CORREGIDO: Usar string
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@codium.com" },
    update: {},
    create: {
      email: "student2@codium.com",
      password: studentPassword,
      firstName: "Bob",
      lastName: "Johnson",
      role: "STUDENT", // CORREGIDO: Usar string
    },
  });

  // Create course
  const course = await prisma.course.upsert({
    where: { code: "NRC12345" },
    update: {},
    create: {
      name: "Desarrollo de Aplicaciones Backend",
      code: "NRC12345",
      period: "2025-1",
      group: 1,
      professors: {
        connect: { id: professor.id },
      },
    },
  });

  // Enroll students
  await prisma.courseStudent.createMany({
    data: [
      { courseId: course.id, studentId: student1.id },
      { courseId: course.id, studentId: student2.id },
    ],
    skipDuplicates: true,
  });

  // Create sample challenge
  await prisma.challenge.create({
    data: {
      title: "Two Sum",
      description: "Dado un arreglo de enteros nums y un entero target, devuelve los índices de los dos números que suman target.",
      difficulty: "EASY", // CORREGIDO: Usar string
      tags: ["arrays", "hashmap"],
      timeLimit: 1500,
      memoryLimit: 256,
      status: "PUBLISHED", // CORREGIDO: Usar string
      courseId: course.id,
      createdById: professor.id,
      testCases: {
        create: [
          {
            input: "[2,7,11,15]\n9",
            expectedOutput: "[0,1]",
            isHidden: false,
            points: 50,
            order: 1,
          },
          {
            input: "[3,2,4]\n6",
            expectedOutput: "[1,2]",
            isHidden: true,
            points: 50,
            order: 2,
          },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📝 Test credentials:");
  console.log("Admin: admin@codium.com / admin123");
  console.log("Professor: professor@codium.com / professor123");
  console.log("Student: student1@codium.com / student123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });