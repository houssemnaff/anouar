export function EmptyOrders() {
  return (
    <div className="bg-card border border-border rounded-2xl p-12 text-center">
      <p className="text-muted-foreground mb-4">No orders yet</p>
      <p className="text-sm text-muted-foreground">
        Orders will appear here when customers place them
      </p>
    </div>
  );
}
