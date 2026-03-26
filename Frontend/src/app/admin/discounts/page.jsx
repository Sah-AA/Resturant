import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EMPTY_FORM = { name: "", type: "percentage", value: "", active: true };

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchDiscounts = () => {
    api.get("/discounts").then(setDiscounts).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDiscounts(); }, []);

  const handleOpenDialog = (discount = null) => {
    setEditingDiscount(discount);
    setFormData(discount ? {
      name: discount.name, type: discount.type,
      value: discount.value.toString(), active: discount.active,
    } : EMPTY_FORM);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.value) return toast.error("Name and value are required");
    setIsSaving(true);
    try {
      const body = { ...formData, value: parseFloat(formData.value) };
      if (editingDiscount) {
        await api.put(`/discounts/${editingDiscount._id}`, body);
        toast.success("Discount updated");
      } else {
        await api.post("/discounts", body);
        toast.success("Discount created");
      }
      setShowDialog(false);
      fetchDiscounts();
    } catch (err) { toast.error(err.message); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this discount?")) return;
    try {
      await api.delete(`/discounts/${id}`);
      toast.success("Discount deleted");
      fetchDiscounts();
    } catch (err) { toast.error(err.message); }
  };

  const handleToggleActive = async (d) => {
    try {
      await api.put(`/discounts/${d._id}`, { active: !d.active });
      toast.success(`Discount ${d.active ? "deactivated" : "activated"}`);
      fetchDiscounts();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">Manage discounts for your orders</p>
        </div>
        <Button onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-2" />Add Discount</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{discounts.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Active</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{discounts.filter((d) => d.active).length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Percentage Type</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{discounts.filter((d) => d.type === "percentage").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Discounts</CardTitle><CardDescription>{discounts.length} discounts configured</CardDescription></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : discounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><Percent className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No discounts yet</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Status</TableHead><TableHead className="w-[70px]"></TableHead></TableRow></TableHeader>
              <TableBody>
                {discounts.map((d) => (
                  <TableRow key={d._id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
                    <TableCell className="font-medium">{d.type === "percentage" ? `${d.value}%` : `Rs. ${d.value}`}</TableCell>
                    <TableCell><Badge className={d.active ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"}>{d.active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(d)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(d)}>{d.active ? "Deactivate" : "Activate"}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(d._id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDiscount ? "Edit Discount" : "Add Discount"}</DialogTitle><DialogDescription>{editingDiscount ? "Update discount details" : "Create a new discount"}</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Name *</Label><Input placeholder="e.g., Summer Sale" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (Rs.)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value * {formData.type === "percentage" ? "(%)" : "(Rs.)"}</Label>
                <Input type="number" placeholder="0" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label>Active</Label><p className="text-sm text-muted-foreground">Enable this discount</p></div>
              <Switch checked={formData.active} onCheckedChange={(v) => setFormData({ ...formData, active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingDiscount ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
