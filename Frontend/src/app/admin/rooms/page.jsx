import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Home, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function RoomsTablesPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rooms");

  // Room dialog
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [roomForm, setRoomForm] = useState({ name: "", description: "" });

  // Table dialog (embedded in room)
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableForm, setTableForm] = useState({ tableNumber: "", roomId: "" });

  const fetchRooms = () => {
    api.get("/rooms").then(setRooms).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  // All tables flattened from rooms
  const allTables = rooms.flatMap((r) =>
    r.tables.map((t) => ({ ...t, roomName: r.name, roomId: r._id }))
  );

  // --- Room handlers ---
  const handleOpenRoomDialog = (room = null) => {
    setEditingRoom(room);
    setRoomForm({ name: room?.name || "", description: room?.description || "" });
    setShowRoomDialog(true);
  };

  const handleSubmitRoom = async () => {
    if (!roomForm.name.trim()) return toast.error("Room name is required");
    setIsSaving(true);
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, roomForm);
        toast.success("Room updated");
      } else {
        await api.post("/rooms", roomForm);
        toast.success("Room created");
      }
      setShowRoomDialog(false);
      fetchRooms();
    } catch (err) { toast.error(err.message); }
    finally { setIsSaving(false); }
  };

  const handleDeleteRoom = async (id) => {
    if (!confirm("Delete this room and all its tables?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted");
      fetchRooms();
    } catch (err) { toast.error(err.message); }
  };

  // --- Table handlers ---
  const handleOpenTableDialog = () => {
    setTableForm({ tableNumber: "", roomId: rooms[0]?._id || "" });
    setShowTableDialog(true);
  };

  const handleSubmitTable = async () => {
    if (!tableForm.tableNumber || !tableForm.roomId) return toast.error("Table number and room are required");
    setIsSaving(true);
    try {
      // Add table as embedded subdocument: PUT room with new table
      const room = rooms.find((r) => r._id === tableForm.roomId);
      if (!room) throw new Error("Room not found");
      const updatedTables = [...room.tables, { tableNumber: tableForm.tableNumber, status: "open" }];
      await api.put(`/rooms/${tableForm.roomId}`, { tables: updatedTables });
      toast.success("Table added");
      setShowTableDialog(false);
      fetchRooms();
    } catch (err) { toast.error(err.message); }
    finally { setIsSaving(false); }
  };

  const handleUpdateTableStatus = async (roomId, tableId, status) => {
    try {
      await api.patch(`/rooms/${roomId}/tables/${tableId}/status`, { status });
      toast.success(`Table set to ${status}`);
      fetchRooms();
    } catch (err) { toast.error(err.message); }
  };

  const statusColor = (s) => s === "open" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rooms & Tables</h1>
          <p className="text-muted-foreground">Manage your restaurant floor layout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Home className="h-4 w-4" />Total Rooms</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{rooms.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Grid3X3 className="h-4 w-4" />Total Tables</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{allTables.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Available Now</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{allTables.filter((t) => t.status === "open").length}</p></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
          </TabsList>
          <Button onClick={() => activeTab === "rooms" ? handleOpenRoomDialog() : handleOpenTableDialog()}>
            <Plus className="h-4 w-4 mr-2" /> Add {activeTab === "rooms" ? "Room" : "Table"}
          </Button>
        </div>

        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card>
            <CardHeader><CardTitle>All Rooms</CardTitle><CardDescription>Manage restaurant rooms/floors</CardDescription></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><Home className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No rooms yet</p></div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Tables</TableHead><TableHead className="w-[70px]"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {rooms.map((room) => (
                      <TableRow key={room._id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell className="text-muted-foreground">{room.description || "-"}</TableCell>
                        <TableCell><Badge variant="secondary">{room.tables.length} tables</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenRoomDialog(room)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRoom(room._id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <Card>
            <CardHeader><CardTitle>All Tables</CardTitle><CardDescription>Tables across all rooms</CardDescription></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : allTables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No tables yet</p></div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Table #</TableHead><TableHead>Room</TableHead><TableHead>Status</TableHead><TableHead className="w-[70px]"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {allTables.map((table) => (
                      <TableRow key={table._id}>
                        <TableCell className="font-medium">Table {table.tableNumber}</TableCell>
                        <TableCell>{table.roomName}</TableCell>
                        <TableCell><Badge className={statusColor(table.status)}>{table.status === "open" ? "Available" : "Occupied"}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdateTableStatus(table.roomId, table._id, "open")}>Set Available</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateTableStatus(table.roomId, table._id, "occupied")}>Set Occupied</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Room Dialog */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRoom ? "Edit Room" : "Add Room"}</DialogTitle><DialogDescription>{editingRoom ? "Update room details" : "Create a new room/floor"}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Room Name *</Label><Input placeholder="e.g., Ground Floor" value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Input placeholder="Optional" value={roomForm.description} onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoomDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitRoom} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingRoom ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Table Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Table</DialogTitle><DialogDescription>Add a table to a room</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Table Number *</Label><Input placeholder="e.g., 1, A1" value={tableForm.tableNumber} onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Room *</Label>
              <Select value={tableForm.roomId} onValueChange={(v) => setTableForm({ ...tableForm, roomId: v })}>
                <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                <SelectContent>{rooms.map((r) => <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTableDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitTable} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
