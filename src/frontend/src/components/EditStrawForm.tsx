import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateStraw, useUpdateStrawStatus } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { SemenStraw } from '../backend';
import { QualityGrade, AvailabilityStatus } from '../backend';

interface EditStrawFormProps {
  straw: SemenStraw;
  onSuccess: () => void;
}

export default function EditStrawForm({ straw, onSuccess }: EditStrawFormProps) {
  const [bullId, setBullId] = useState(straw.bullId);
  const [collectionDate, setCollectionDate] = useState(straw.collectionDate);
  const [quality, setQuality] = useState<QualityGrade>(straw.quality as QualityGrade);
  const [storageLocation, setStorageLocation] = useState(straw.storageLocation);
  const [status, setStatus] = useState<AvailabilityStatus>(straw.status as AvailabilityStatus);
  const [quantity, setQuantity] = useState(straw.quantity.toString());

  const updateStrawMutation = useUpdateStraw();
  const updateStatusMutation = useUpdateStrawStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bullId.trim()) {
      toast.error('Bull ID is required');
      return;
    }
    if (!collectionDate.trim()) {
      toast.error('Collection date is required');
      return;
    }
    if (!storageLocation.trim()) {
      toast.error('Storage location is required');
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum < 0) {
      toast.error('Quantity must be a non-negative number');
      return;
    }

    try {
      // Update basic fields including quantity
      await updateStrawMutation.mutateAsync({
        strawId: straw.strawId,
        bullId: bullId.trim(),
        collectionDate: collectionDate.trim(),
        quality,
        storageLocation: storageLocation.trim(),
        quantity: BigInt(quantityNum),
      });

      // Update status if changed
      if (status !== straw.status) {
        await updateStatusMutation.mutateAsync({
          strawId: straw.strawId,
          newStatus: status,
        });
      }

      toast.success('Semen straw updated successfully');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update semen straw');
    }
  };

  const isLoading = updateStrawMutation.isPending || updateStatusMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Straw ID</Label>
        <Input value={straw.strawId} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Straw ID cannot be changed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-bullId">
            Bull ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-bullId"
            placeholder="e.g., BULL-456"
            value={bullId}
            onChange={(e) => setBullId(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-collectionDate">
            Collection Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-collectionDate"
            type="date"
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-quality">
            Quality Grade <span className="text-destructive">*</span>
          </Label>
          <Select
            value={quality}
            onValueChange={(value) => setQuality(value as QualityGrade)}
          >
            <SelectTrigger id="edit-quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QualityGrade.Superior}>Superior</SelectItem>
              <SelectItem value={QualityGrade.Standard}>Standard</SelectItem>
              <SelectItem value={QualityGrade.Substandard}>Substandard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-status">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as AvailabilityStatus)}
          >
            <SelectTrigger id="edit-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AvailabilityStatus.Available}>Available</SelectItem>
              <SelectItem value={AvailabilityStatus.Sold}>Sold</SelectItem>
              <SelectItem value={AvailabilityStatus.Used}>Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-storageLocation">
            Storage Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-storageLocation"
            placeholder="e.g., Tank A, Shelf 3"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-quantity"
            type="number"
            min="0"
            step="1"
            placeholder="e.g., 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Straw
        </Button>
      </div>
    </form>
  );
}
