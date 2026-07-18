import { notFound } from "next/navigation";
import { GAMES } from "@/app/data/games";
import { GamePlayerClient } from "@/components/GamePlayerClient";

export default async function GamePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <GamePlayerClient game={game} />;
}
