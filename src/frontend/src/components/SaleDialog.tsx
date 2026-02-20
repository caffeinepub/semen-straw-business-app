import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateSale } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { SemenStraw } from '../backend';

interface SaleDialogProps {
  straw: SemenStraw;
  onSuccess: () => void;
}

export default function SaleDialog({ straw, onSuccess }: SaleDialogProps) {
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [quantitySold, setQuantitySold] = useState('1');
  const [salePrice, setSalePrice] = useState('');

  const createSaleMutation = useCreateSale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!saleDate.trim()) {
      toast.error('Sale date is required');
      return;
    }
    if (!buyerName.trim()) {
      toast.error('Buyer name is required');
      return;
    }
    if (!buyerContact.trim()) {
      toast.error('Buyer contact is required');
      return;
    }

    const quantityNum = parseInt(quantitySold, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Quantity sold must be a positive number');
      return;
    }

    if (quantityNum > Number(straw.quantity)) {
      toast.error(`Quantity sold cannot exceed available quantity (${straw.quantity})`);
      return;
    }

    const priceNum = parseFloat(salePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Sale price must be a non-negative number');
      return;
    }

    try {
      await createSaleMutation.mutateAsync({
        strawId: straw.strawId,
        saleDate: saleDate.trim(),
        buyerName: buyerName.trim(),
        buyerContact: buyerContact.trim(),
        quantitySold: BigInt(quantityNum),
        salePrice: priceNum,
      });

      toast.success('Sale recorded successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Straw ID:</span>
          <span className="text-sm">{straw.strawId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Bull ID:</span>
          <span className="text-sm">{straw.bullId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium">Available Quantity:</span>
          <span className="text-sm font-semibold">{straw.quantity.toString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="saleDate">
            Sale Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="saleDate"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantitySold">
            Quantity Sold <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantitySold"
            type="number"
            min="1"
            max={Number(straw.quantity)}
            step="1"
            placeholder="e.g., 5"
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyerName">
            Buyer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="buyerName"
            placeholder="e.g., John Doe"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyerContact">
            Buyer Contact <span className="text-destructive">*</span>
          </Label>
          <Input
            id="buyerContact"
            placeholder="e.g., +1234567890"
            value={buyerContact}
            onChange={(e) => setBuyerContact(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salePrice">
          Sale Price <span className="text-destructive">*</span>
        </Label>
        <Input
          id="salePrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g., 150.00"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={createSaleMutation.isPending}
          className="gap-2"
        >
          {createSaleMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Record Sale
        </Button>
      </div>
    </form>
  );
}
