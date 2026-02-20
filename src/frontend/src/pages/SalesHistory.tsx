import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllSales } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Receipt, FileText } from 'lucide-react';
import BillView from '@/components/BillView';

export default function SalesHistory() {
  const { data: sales, isLoading, error } = useGetAllSales();
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  const handleGenerateBill = (saleId: string) => {
    setSelectedSaleId(saleId);
    setIsBillDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Sales History</h2>
        <p className="text-muted-foreground mt-1">
          View all recorded semen straw sales and transactions
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load sales history. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : sales && sales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Sales Recorded</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No sales have been recorded yet. Start selling straws from the inventory dashboard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Sale ID</TableHead>
                <TableHead className="font-semibold">Straw ID</TableHead>
                <TableHead className="font-semibold">Sale Date</TableHead>
                <TableHead className="font-semibold">Buyer Name</TableHead>
                <TableHead className="font-semibold">Buyer Contact</TableHead>
                <TableHead className="font-semibold">Quantity Sold</TableHead>
                <TableHead className="font-semibold text-right">Sale Price</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales?.map((sale) => (
                <TableRow key={sale.saleId} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{sale.saleId}</TableCell>
                  <TableCell>{sale.strawId}</TableCell>
                  <TableCell>{sale.saleDate}</TableCell>
                  <TableCell>{sale.buyerName}</TableCell>
                  <TableCell>{sale.buyerContact}</TableCell>
                  <TableCell className="font-medium">{sale.quantitySold.toString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${sale.salePrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateBill(sale.saleId)}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Generate Bill
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Invoice</DialogTitle>
          </DialogHeader>
          {selectedSaleId && (
            <BillView
              saleId={selectedSaleId}
              onClose={() => setIsBillDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
