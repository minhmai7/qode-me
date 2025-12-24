import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    const jsCategory = await prisma.category.upsert({
        where: { slug: 'javascript' },
        update: {},
        create: { name: 'JavaScript',
                  description: 'JavaScript Fundamentals and ES6+',
                  icon: '',
                  slug: 'javascript'
                },
    })

    const pythonCategory = await prisma.category.upsert({
        where: { slug: 'python' },
        update: {},
        create: { name: 'Python',
                  description: 'Python Programming Basics',
                  icon: '',
                  slug: 'python'
                },
    })

    const javaCategory = await prisma.category.upsert({
        where: { slug: 'java' },
        update: {},
        create: { name: 'Java',
                  description: 'Java Programming Basics',
                  icon: '',
                  slug: 'java'
                },
    })

    const algoCategory = await prisma.category.upsert({
        where: { slug: 'algorithms' },
        update: {},
        create: { name: 'Algorithms',
                  description: 'Data Structures and Algorithms',
                  icon: '',
                  slug: 'algorithms'
                },
    })

    console.log({ jsCategory, pythonCategory, javaCategory, algoCategory });
    console.log('Database seeded successfully.');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });