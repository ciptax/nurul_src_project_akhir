import prisma from "../src/prisma.js";

async function main() {
  await prisma.category.create({
    data: {
      nama: "Sembako",
    },
  });
}

main()
  .then(() => {
    console.log("Seeding success");
    prisma.$disconnect();
  })
  .catch(() => {
    console.error("Seeding failed");
    prisma.$disconnect();
    process.exit(1);
  });
