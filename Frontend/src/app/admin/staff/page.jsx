import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, Users, UserCheck, Phone, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EMPTY_FORM = { name: "", email: "", password: "", position: "", salary: "", joinDate: new Date().toISOString().split("T")[0], role: "cashier" };

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchStaff = () => {
    api.get("/staff").then(setStaff).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleOpenDialog = (member = null) => {
    setEditingStaff(member);
    setFormData(member ? {
      name: member.user?.name || "", email: member.user?.email || "", password: "",
      position: member.position, salary: member.salary.toString(),
      joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split("T")[0] : "",
      role: member.user?.role || "cashier",
    } : EMPTY_FORM);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.position || !formData.salary) return toast.error("Name, position and salary are required");
    if (!editingStaff && !formData.email) return toast.error("Email is required for new staff");
    if (!editingStaff && !formData.password) return toast.error("Password is required for new staff");
    setIsSaving(true);
    try {
      if (editingStaff) {
        await api.put(`/staff/${editingStaff._id}`, { position: formData.position, salary: parseFloat(formData.salary) });
        toast.success("Staff updated");
      } else {
        await api.post("/staff", { ...formData, salary: parseFloat(formData.salary) });
        toast.success("Staff added");
      }
      setShowDialog(false);
      fetchStaff();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this staff member?")) return;
    try {
      await api.delete(`/staff/${id}`);
      toast.success("Staff deleted");
      fetchStaff();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const filtered = staff.filter((s) => {
    const n = s.user?.name || "";
    const e = s.user?.email || "";
    return n.toLowerCase().includes(searchQuery.toLowerCase()) || e.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalSalary = staff.reduce((sum, s) => sum + (s.active ? s.salary : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your restaurant staff members</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4" />Total Staff</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{staff.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2"><UserCheck className="h-4 w-4" />Active Staff</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{staff.filter((s) => s.active).length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">Rs. {totalSalary.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>{filtered.length} members found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><Users className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No staff found</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback>{getInitials(member.user?.name)}</AvatarFallback></Avatar>
                        <span className="font-medium">{member.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {member.user?.email && <div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3 text-muted-foreground" />{member.user.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-medium">{member.position}</span>
                        <div><Badge variant="secondary">{member.user?.role}</Badge></div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">Rs. {member.salary.toLocaleString()}</TableCell>
                    <TableCell><Badge className={member.active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}>{member.active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(member)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(member._id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
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
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
            <DialogDescription>{editingStaff ? "Update staff details" : "Add a new team member"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editingStaff && (
              <>
                <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="e.g., Ravi Sharma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Password *</Label><Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Position *</Label><Input placeholder="e.g., Waiter" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} /></div>
              <div className="space-y-2"><Label>Monthly Salary *</Label><Input type="number" placeholder="0" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} /></div>
            </div>
            {!editingStaff && <div className="space-y-2"><Label>Join Date</Label><Input type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingStaff ? "Update" : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
