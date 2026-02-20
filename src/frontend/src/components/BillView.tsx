import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGenerateSaleBill } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Printer } from 'lucide-react';

interface BillViewProps {
  saleId: string;
  onClose: () => void;
}

export default function BillView({ saleId, onClose }: BillViewProps) {
  const { data: billData, isLoading, error } = useGenerateSaleBill(saleId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error || !billData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to generate bill. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const { sale, straw, totalAmount } = billData;

  return (
    <div className="space-y-6">
      {/* Print Button - Hidden during print */}
      <div className="flex justify-end gap-3 print:hidden">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content */}
      <div className="bg-background p-8 rounded-lg border border-border print:border-0">
        {/* Business Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Semen Straw Business</h1>
          <p className="text-muted-foreground">Professional Livestock Genetics</p>
        </div>

        <Separator className="mb-6" />

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Invoice Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number:</span>
                <span className="font-medium">#{sale.saleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale Date:</span>
                <span className="font-medium">{sale.saleDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Buyer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{sale.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium">{sale.buyerContact}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Item Details */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Item Details</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold text-sm">Straw ID</th>
                  <th className="text-left p-3 font-semibold text-sm">Bull ID</th>
                  <th className="text-left p-3 font-semibold text-sm">Color Code</th>
                  <th className="text-left p-3 font-semibold text-sm">Quality</th>
                  <th className="text-right p-3 font-semibold text-sm">Quantity</th>
                  <th className="text-right p-3 font-semibold text-sm">Unit Price</th>
                  <th className="text-right p-3 font-semibold text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 text-sm">{straw.strawId}</td>
                  <td className="p-3 text-sm">{straw.bullId}</td>
                  <td className="p-3 text-sm">{straw.colorCode || '-'}</td>
                  <td className="p-3 text-sm">{straw.quality}</td>
                  <td className="p-3 text-sm text-right">{sale.quantitySold.toString()}</td>
                  <td className="p-3 text-sm text-right">${sale.salePrice.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-medium">${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Total Amount */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Additional Information</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Storage Location: {straw.storageLocation}</p>
            <p>• Collection Date: {straw.collectionDate}</p>
            <p>• Status: {straw.status}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>Thank you for your business!</p>
          <p className="mt-1">For any queries, please contact us with your invoice number.</p>
        </div>
      </div>
    </div>
  );
}
