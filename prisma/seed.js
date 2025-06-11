import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@kuafor.com";
  const name = process.env.ADMIN_NAME || "Admin";
  const passwordPlain = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("❌ Admin kullanıcı zaten mevcut");
    return;
  }

  const hashed = await bcrypt.hash(passwordPlain, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin oluşturuldu:", email, "şifre:", passwordPlain);

  // Seed sample barbers & services
  const barberCount = await prisma.barber.count();
  if (barberCount === 0) {
    const barber1 = await prisma.barber.create({
      data: {
        name: "Ahmet Usta",
        description: "20 yıllık deneyimli kuaför",
        services: {
          create: [
            { name: "Saç Kesimi", price: 150, duration: 30 },
            { name: "Sakal Tıraşı", price: 100, duration: 20 },
          ],
        },
      },
    });
    const barber2 = await prisma.barber.create({
      data: {
        name: "Mehmet Usta",
        description: "Modern stiller uzmanı",
        services: {
          create: [
            { name: "Saç Boyama", price: 300, duration: 60 },
            { name: "Bakım Paketi", price: 400, duration: 90 },
          ],
        },
      },
    });
    console.log("✅ Örnek kuaförler eklendi", barber1.name, ",", barber2.name);
  } else {
    console.log("ℹ️ Kuaför verisi zaten mevcut, atlandı");
  }

  // Seed sample normal user
  const userEmail = "user@kuafor.com";
  const userExists = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!userExists) {
    const userHashed = await bcrypt.hash("user123", 10);
    await prisma.user.create({
      data: {
        name: "Örnek Kullanıcı",
        email: userEmail,
        password: userHashed,
        role: "USER",
      },
    });
    console.log("✅ Örnek kullanıcı eklendi:", userEmail, "şifre: user123");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  }); 