type TableColumnsHeaderProps = {
  quoteAsset: string;
  baseAsset: string;
};

export function TableColumnsHeader({
  quoteAsset,
  baseAsset,
}: TableColumnsHeaderProps) {
  const valueColumnClassName = "ob-table-cell-right";

  return (
    <div className="ob-text-body-sm ob-text-tertiary mx-4 mb-1.5">
      <div className="ob-table-grid">
        <span className="ob-table-cell text-left">Price ({quoteAsset})</span>
        <span className={valueColumnClassName}>Amount ({baseAsset})</span>
        <span className={valueColumnClassName}>Total</span>
      </div>
    </div>
  );
}
