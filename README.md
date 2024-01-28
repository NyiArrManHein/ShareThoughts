## Installations

NodeJs, npm

## Installing Packages

```bash
npm install
```

## Change the DATABASE_URL in .env

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

```

## .env variables (You can't run without them)

Contact the author -> dimensions.mm.it@gmail.com

## Getting Started

First, generate prisma and migrate:

```bash
npx prisma generate && npx prisma migrate dev

```

Run development server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
