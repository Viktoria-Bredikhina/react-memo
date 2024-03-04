import { useParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";

export function GamePage() {
  const { pairsCount, hasCounter } = useParams();

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} hasCounter={hasCounter === "true"}></Cards>
    </>
  );
}
