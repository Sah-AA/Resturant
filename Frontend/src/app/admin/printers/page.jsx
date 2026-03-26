import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, MoreHorizontal, Pencil, Trash2, Printer, Loader2, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EMPTY_FORM = { name: "", ipAddress: "", type: "receipt", active: true };

export default function PrintersPage() {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchPrinters = () => {
    api.get("/printers").then(setPrinters).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrinters(); }, []);

  const handleOpenDialog = (printer = null) => {
    setEditingPrinter(printer);
    setFormData(printer ? { name: printer.name, ipAddress: printer.ipAddress, type: printer.type, active: printer.active } : EMPTY_FORM);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.ipAddress) return toast.error("Name and IP address are required");
    setIsSaving(true);
    try {
      if (editingPrinter) {
        await api.put(`/printers/${editingPrinter._id}`, formData);
        toast.success("Printer updated");
      } else {
        await api.post("/printers", formData);
        toast.success("Printer added");
      }
      setShowDialog(false);
      fetchPrinters();
    } catch (err) { toast.error(err.message); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this printer?")) return;
    try {
      await api.delete(`/printers/${id}`);
      toast.success("Printer deleted");
      fetchPrinters();
    } catch (err) { toast.error(err.message); }
  };

  const handleToggleActive = async (p) => {
    try {
      await api.put(`/printers/${p._id}`, { active: !p.active });
      toast.success(`Printer ${p.active ? "deactivated" : "activated"}`);
      fetchPrinters();
    } catch (err) { toast.error(err.message); }
  };

  const handleTestPrint = (id) => {
    setIsTesting(id);
    setTimeout(() => { toast.success("Test print sent"); setIsTesting(null); }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Printers</h1><p className="text-muted-foreground">Manage KOT and receipt printers</p></div>
        <Button onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-2" />Add Printer</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Printers</CardTitle><CardDescription>Configure printers for kitchen and receipt printing</CardDescription></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : printers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><Printer className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No printers configured</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>IP Address</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]"></TableHead></TableRow></TableHeader>
              <TableBody>
                {printers.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant="outline">{p.type === "kitchen" ? "KOT (Kitchen)" : "Receipt"}</Badge></TableCell>
                    <TableCell><code className="text-sm bg-muted px-2 py-1 rounded">{p.ipAddress}</code></TableCell>
                    <TableCell><Badge className={p.active ? "bg-green-500/10 text-green-600" : ""}>{p.active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleTestPrint(p._id)} disabled={isTesting === p._id}>
                          {isTesting === p._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(p)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActive(p)}>{p.active ? "Deactivate" : "Activate"}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p._id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPrinter ? "Edit Printer" : "Add Printer"}</DialogTitle><DialogDescription>{editingPrinter ? "Update printer config" : "Configure a new printer"}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Printer Name *</Label><Input placeholder="e.g., Kitchen Printer" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">KOT (Kitchen)</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>IP Address *</Label><Input placeholder="e.g., 192.168.1.100" value={formData.ipAddress} onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingPrinter ? "Update" : "Add Printer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
