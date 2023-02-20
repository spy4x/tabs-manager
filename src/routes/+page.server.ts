import { prisma } from '$lib/server/prisma';

export async function load() {
  const links = await prisma.link.findMany();
  return {
    links,
  };
}
