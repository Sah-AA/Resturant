import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Package, Truck, Users, DollarSign, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function POSPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [transferToTable, setTransferToTable] = useState("");

  useEffect(() => {
    Promise.all([api.get("/rooms"), api.get("/orders?status=open")])
      .then(([r, o]) => { setRooms(r); setOrders(o); })
      .catch(console.error);
  }, []);

  // Flatten all tables across rooms
  const allTables = useMemo(() =>
    rooms.flatMap((room) =>
      room.tables.map((t) => ({ ...t, roomName: room.name, roomId: room._id }))
    ), [rooms]);

  const runningTables = useMemo(() =>
    allTables
      .filter((t) => t.status === "occupied")
      .map((t) => ({
        ...t,
        orderTotal: orders.find((o) => o.tableId === t._id)?.totalAmount || 0,
      })), [allTables, orders]);

  const availableTables = useMemo(() =>
    allTables.filter((t) => t.status === "open"), [allTables]);

  const todayRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleTableClick = (tableId, status, roomId) => {
    if (status === "open") navigate(`/cashier/pos/table/${tableId}?roomId=${roomId}&type=new`);
    else navigate(`/cashier/pos/table/${tableId}?roomId=${roomId}&type=existing`);
  };

  const handleTransfer = () => {
    if (!selectedTable || !transferToTable) return toast.error("Please select both tables");
    toast.info("Table transfer coming soon");
    setShowTransferDialog(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden p-6">
      <div className="flex-1 flex gap-6 overflow-hidden">

        {/* Left — Tables */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">

          {/* Running Tables */}
          <section className="bg-card border border-border rounded-2xl p-5 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Running Tables</h2>
              <span className="text-sm text-muted-foreground">({runningTables.length})</span>
            </div>
            <div className="flex-1 overflow-auto">
              {runningTables.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground"><p>No active orders</p></div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {runningTables.map((table) => (
                    <button key={table._id} onClick={() => handleTableClick(table._id, "occupied", table.roomId)}
                      className="bg-secondary/10 border-2 border-secondary rounded-xl p-4 hover:bg-secondary/20 transition-all text-left">
                      <p className="text-xl font-bold">{table.tableNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">{table.roomName}</p>
                      <p className="text-sm font-semibold text-secondary mt-2">Rs. {table.orderTotal.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Available Tables */}
          <section className="bg-card border border-border rounded-2xl p-5 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold">Available Tables</h2>
              <span className="text-sm text-muted-foreground">({availableTables.length})</span>
            </div>
            <div className="flex-1 overflow-auto">
              {availableTables.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground"><p>No available tables</p></div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {availableTables.map((table) => (
                    <button key={table._id} onClick={() => handleTableClick(table._id, "open", table.roomId)}
                      className="bg-background border-2 border-border rounded-xl p-4 hover:border-primary hover:bg-primary/5 transition-all text-left">
                      <p className="text-xl font-bold">{table.tableNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">{table.roomName}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right — Summary & Actions */}
        <div className="w-80 flex flex-col gap-6">

          {/* Today's Summary */}
          <section className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Orders</p>
                  <p className="text-xl font-bold">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Revenue</p>
                  <p className="text-xl font-bold">Rs. {todayRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tables</p>
                  <p className="text-xl font-bold">{runningTables.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Transfer Table */}
          <section className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-12" onClick={() => setShowTransferDialog(true)}>
                <ArrowRightLeft className="w-5 h-5" />
                <span>Transfer Table</span>
              </Button>
            </div>
          </section>

          {/* Delivery / Takeaway */}
          <section className="bg-card border border-border rounded-2xl p-5 flex-1">
            <Tabs defaultValue="delivery" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="delivery">Home Delivery</TabsTrigger>
                <TabsTrigger value="takeaway">Take Away</TabsTrigger>
              </TabsList>
              <TabsContent value="delivery">
                <Button variant="outline" className="w-full h-16 justify-start gap-3" onClick={() => navigate("/cashier/pos/table/delivery?type=new")}>
                  <Truck className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">New Delivery</p>
                    <p className="text-xs text-muted-foreground">Create new delivery order</p>
                  </div>
                </Button>
              </TabsContent>
              <TabsContent value="takeaway">
                <Button variant="outline" className="w-full h-16 justify-start gap-3" onClick={() => navigate("/cashier/pos/table/takeaway?type=new")}>
                  <Package className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">New Takeaway</p>
                    <p className="text-xs text-muted-foreground">Create new takeaway order</p>
                  </div>
                </Button>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>

      {/* Transfer Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Table</DialogTitle>
            <DialogDescription>Move an order from one table to another.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From Table</Label>
              <Select value={selectedTable || ""} onValueChange={setSelectedTable}>
                <SelectTrigger><SelectValue placeholder="Select occupied table" /></SelectTrigger>
                <SelectContent>
                  {runningTables.map((t) => <SelectItem key={t._id} value={t._id}>{t.roomName} - {t.tableNumber}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center"><ArrowRightLeft className="w-5 h-5 text-muted-foreground" /></div>
            <div className="space-y-2">
              <Label>To Table</Label>
              <Select value={transferToTable} onValueChange={setTransferToTable}>
                <SelectTrigger><SelectValue placeholder="Select available table" /></SelectTrigger>
                <SelectContent>
                  {availableTables.map((t) => <SelectItem key={t._id} value={t._id}>{t.roomName} - {t.tableNumber}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
            <Button onClick={handleTransfer} disabled={!selectedTable || !transferToTable}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
