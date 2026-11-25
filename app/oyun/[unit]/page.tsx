import { notFound } from "next/navigation";
import { DEMO_COURSE, findUnit } from "@/lib/demo";
import BossBattle from "./BossBattle";

export function generateStaticParams() {
  return DEMO_COURSE.units.map((u) => ({ unit: u.id }));
}

export default async function GamePage({ params }: PageProps<"/oyun/[unit]">) {
  const { unit: id } = await params;
  const unit = findUnit(id);
  if (!unit) notFound();
  return <BossBattle unit={unit} />;
}
