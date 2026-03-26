import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Building, Receipt, Percent, DollarSign, Calendar, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get("/settings")
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (section) => {
    setIsSaving(true);
    try {
      const updated = await api.put("/settings", settings);
      setSettings(updated);
      toast.success(`${section} settings saved`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!settings) return <p className="text-muted-foreground">Failed to load settings.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your restaurant system settings</p>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="restaurant" className="flex items-center gap-2"><Building className="h-4 w-4" />Restaurant</TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2"><Percent className="h-4 w-4" />Tax</TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center gap-2"><Receipt className="h-4 w-4" />Receipt</TabsTrigger>
          <TabsTrigger value="currency" className="flex items-center gap-2"><DollarSign className="h-4 w-4" />Currency</TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Financial Year</TabsTrigger>
        </TabsList>

        {/* Restaurant */}
        <TabsContent value="restaurant">
          <Card>
            <CardHeader><CardTitle>Restaurant Information</CardTitle><CardDescription>Basic details about your restaurant</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Restaurant Name</Label><Input value={settings.restaurantName || ""} onChange={(e) => set("restaurantName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={settings.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Address</Label><Input value={settings.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
              <Button onClick={() => handleSave("Restaurant")} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax */}
        <TabsContent value="tax">
          <Card>
            <CardHeader><CardTitle>Tax Configuration</CardTitle><CardDescription>Configure tax rate applied to orders</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tax Name</Label><Input placeholder="e.g., GST, VAT" value={settings.taxName || ""} onChange={(e) => set("taxName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" placeholder="0" value={settings.taxRate ?? ""} onChange={(e) => set("taxRate", parseFloat(e.target.value) || 0)} /></div>
              </div>
              <Button onClick={() => handleSave("Tax")} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt */}
        <TabsContent value="receipt">
          <Card>
            <CardHeader><CardTitle>Receipt Settings</CardTitle><CardDescription>Configure how receipts are printed</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Label>Footer Text</Label><Input placeholder="Thank you for dining with us!" value={settings.receiptFooter || ""} onChange={(e) => set("receiptFooter", e.target.value)} /></div>
              <Button onClick={() => handleSave("Receipt")} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency */}
        <TabsContent value="currency">
          <Card>
            <CardHeader><CardTitle>Currency Settings</CardTitle><CardDescription>Configure currency display format</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency || "INR"} onValueChange={(v) => set("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="NPR">Nepali Rupee (NPR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Currency Symbol</Label><Input value={settings.currencySymbol || ""} onChange={(e) => set("currencySymbol", e.target.value)} /></div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Preview</p>
                <p className="text-2xl font-bold">{settings.currencySymbol} 1,234.56</p>
              </div>
              <Button onClick={() => handleSave("Currency")} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Year */}
        <TabsContent value="financial">
          <Card>
            <CardHeader><CardTitle>Financial Year</CardTitle><CardDescription>Manage your financial year settings</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Financial Year Start Month</Label>
                <Select value={settings.financialYearStart || "04"} onValueChange={(v) => set("financialYearStart", v)}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                    <SelectItem value="07">July</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Start Month</span><span className="font-medium">{settings.financialYearStart || "04"}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><span className="font-medium text-green-600">Active</span></div>
              </div>
              <Button onClick={() => handleSave("Financial Year")} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
