import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Loader2, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // "2026-03"
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [genMonth, setGenMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/payroll?month=${filterMonth}`),
      api.get("/staff"),
    ]).then(([p, s]) => { setPayrolls(p); setStaff(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterMonth]);

  const handleGeneratePayroll = async () => {
    if (!genMonth) return toast.error("Select a month");
    setIsProcessing(true);
    try {
      // Create payroll for each active staff member for the selected month
      const activeStaff = staff.filter((s) => s.active);
      if (activeStaff.length === 0) return toast.error("No active staff found");

      await Promise.all(activeStaff.map((s) =>
        api.post("/payroll", {
          staff: s._id,
          month: genMonth,
          basicSalary: s.salary,
          deductions: 0,
          bonus: 0,
        })
      ));
      toast.success(`Payroll generated for ${activeStaff.length} staff members`);
      setShowGenerateDialog(false);
      setFilterMonth(genMonth);
      fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setIsProcessing(false); }
  };

  const handleMarkPaid = async () => {
    if (!selectedPayroll) return;
    setIsProcessing(true);
    try {
      await api.patch(`/payroll/${selectedPayroll._id}/paid`);
      toast.success("Payment marked as paid");
      setShowPayDialog(false);
      setSelectedPayroll(null);
      fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setIsProcessing(false); }
  };

  const handlePayAll = async () => {
    const pending = payrolls.filter((p) => !p.paid);
    if (pending.length === 0) return toast.error("No pending payments");
    setIsProcessing(true);
    try {
      await Promise.all(pending.map((p) => api.patch(`/payroll/${p._id}/paid`)));
      toast.success(`${pending.length} payments marked as paid`);
      fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setIsProcessing(false); }
  };

  const getInitials = (name = "") => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const totalPayroll = payrolls.reduce((s, p) => s + p.netPay, 0);
  const paidCount = payrolls.filter((p) => p.paid).length;
  const pendingCount = payrolls.filter((p) => !p.paid).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage staff salaries and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePayAll} disabled={isProcessing || pendingCount === 0}>
            <DollarSign className="h-4 w-4 mr-2" />Pay All Pending
          </Button>
          <Button onClick={() => setShowGenerateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Generate Payroll
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Calendar className="h-4 w-4" />Period</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">{filterMonth}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Payroll</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">Rs. {totalPayroll.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" />Paid</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{paidCount}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2"><Clock className="h-4 w-4" />Pending</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p></CardContent></Card>
      </div>

      {/* Month Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label>Filter by Month</Label>
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>{filterMonth} — {payrolls.length} staff members</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No payroll records for this period.</p>
              <p className="text-sm">Click "Generate Payroll" to create entries.</p>
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead className="text-right">Basic</TableHead><TableHead className="text-right">Bonus</TableHead><TableHead className="text-right">Deductions</TableHead><TableHead className="text-right">Net Pay</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]"></TableHead></TableRow></TableHeader>
              <TableBody>
                {payrolls.map((p) => {
                  const name = p.staff?.user?.name || "Staff";
                  return (
                    <TableRow key={p._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{getInitials(name)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{p.staff?.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">Rs. {p.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">+ Rs. {(p.bonus || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">- Rs. {(p.deductions || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold">Rs. {p.netPay.toLocaleString()}</TableCell>
                      <TableCell>
                        {p.paid
                          ? <Badge className="bg-green-500/10 text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>
                          : <Badge className="bg-yellow-500/10 text-yellow-600"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>}
                      </TableCell>
                      <TableCell>
                        {!p.paid && (
                          <Button variant="outline" size="sm" onClick={() => { setSelectedPayroll(p); setShowPayDialog(true); }}>Pay</Button>
                        )}
                        {p.paid && p.paidAt && <span className="text-xs text-muted-foreground">{new Date(p.paidAt).toLocaleDateString()}</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Monthly Payroll</DialogTitle><DialogDescription>Generate payroll for all active staff</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Month</Label>
              <input type="month" value={genMonth} onChange={(e) => setGenMonth(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" />
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Summary</p>
              <div className="flex justify-between text-sm"><span>Active Staff</span><span>{staff.filter((s) => s.active).length}</span></div>
              <div className="flex justify-between text-sm"><span>Period</span><span>{genMonth}</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>Cancel</Button>
            <Button onClick={handleGeneratePayroll} disabled={isProcessing}>{isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Generate Payroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Payment</DialogTitle><DialogDescription>Mark salary as paid for {selectedPayroll?.staff?.user?.name}</DialogDescription></DialogHeader>
          {selectedPayroll && (
            <div className="py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Basic Salary</span><span>Rs. {selectedPayroll.basicSalary?.toLocaleString()}</span></div>
                <div className="flex justify-between text-green-600"><span>Bonus</span><span>+ Rs. {(selectedPayroll.bonus || 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-red-600"><span>Deductions</span><span>- Rs. {(selectedPayroll.deductions || 0).toLocaleString()}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Net Pay</span><span>Rs. {selectedPayroll.netPay?.toLocaleString()}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>Cancel</Button>
            <Button onClick={handleMarkPaid} disabled={isProcessing}>{isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}<DollarSign className="h-4 w-4 mr-2" />Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
